import { Controller, Headers, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Logger } from '@vendure/core';
import { Request, Response } from 'express';
import { getSecretKey, isValidWebhookSignature } from './paystack-client';
import { PaystackService } from './paystack.service';

/**
 * The webhook is the source of truth for payment: it settles the order even when the
 * customer closes the tab before the browser callback runs.
 *
 * `/paystack/webhook` is mounted behind a raw body parser (see PaystackPlugin), so
 * `req.body` is the exact Buffer Paystack signed.
 */
@Controller('paystack')
export class PaystackWebhookController {
    constructor(private paystackService: PaystackService) {}

    @Post('webhook')
    async webhook(
        @Headers('x-paystack-signature') signature: string | undefined,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const rawBody = req.body;
        if (!Buffer.isBuffer(rawBody)) {
            Logger.error('Paystack webhook received without a raw body; check the raw-body middleware', 'PaystackWebhook');
            return res.status(HttpStatus.BAD_REQUEST).send('Raw body required');
        }

        let secret: string;
        try {
            secret = getSecretKey();
        } catch {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Secret key not configured');
        }
        if (!isValidWebhookSignature(rawBody, signature, secret)) {
            return res.status(HttpStatus.UNAUTHORIZED).send('Invalid Paystack signature');
        }

        let event: { event?: string; data?: { reference?: string } };
        try {
            event = JSON.parse(rawBody.toString('utf8'));
        } catch {
            return res.status(HttpStatus.BAD_REQUEST).send('Invalid JSON');
        }

        if (event.event === 'charge.success' && event.data?.reference) {
            try {
                const result = await this.paystackService.settle(event.data.reference, 'webhook');
                if (result.status === 'pending') {
                    // Paystack has not finalised yet; a non-2xx makes Paystack retry later.
                    return res.status(HttpStatus.SERVICE_UNAVAILABLE).send('Pending, retry');
                }
            } catch {
                // Transient failure (network, DB). Ask Paystack to retry; settle() is idempotent.
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Retry');
            }
        }

        // Duplicates, already-settled references and unrelated events are acknowledged.
        return res.status(HttpStatus.OK).send();
    }
}
