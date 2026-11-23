import { OnApplicationBootstrap } from '@nestjs/common';
import {
    Logger,
    PaymentMethodService,
    PluginCommonModule,
    ProcessContext,
    RequestContextService,
    VendurePlugin,
} from '@vendure/core';
import { raw } from 'body-parser';
import { PaystackTransaction } from './entities/paystack-transaction.entity';
import { cashOnDeliveryHandler, paystackPaymentHandler } from './paystack-handler';
import { PaystackShopResolver, paystackShopApiExtensions } from './paystack.resolver';
import { PaystackService } from './paystack.service';
import { PaystackWebhookController } from './paystack-webhook.controller';

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [PaystackTransaction],
    providers: [PaystackService],
    controllers: [PaystackWebhookController],
    shopApiExtensions: {
        schema: paystackShopApiExtensions,
        resolvers: [PaystackShopResolver],
    },
    configuration: config => {
        // Keep the exact bytes Paystack signed: parse this one route as a raw Buffer,
        // before Nest's global JSON parser can consume the stream.
        config.apiOptions.middleware.push({
            route: '/paystack/webhook',
            handler: raw({ type: '*/*', limit: '1mb' }),
            beforeListen: true,
        });
        const handlers = config.paymentOptions.paymentMethodHandlers;
        for (const handler of [paystackPaymentHandler, cashOnDeliveryHandler]) {
            if (!handlers.some(h => h.code === handler.code)) handlers.push(handler);
        }
        return config;
    },
})
export class PaystackPlugin implements OnApplicationBootstrap {
    constructor(
        private paymentMethodService: PaymentMethodService,
        private requestContextService: RequestContextService,
        private processContext: ProcessContext,
    ) {}

    /** Makes sure the pay-on-delivery method exists so WhatsApp orders can be placed. */
    async onApplicationBootstrap() {
        if (this.processContext.isWorker) return;
        try {
            const ctx = await this.requestContextService.create({ apiType: 'admin' });
            const { items } = await this.paymentMethodService.findAll(ctx);
            if (!items.some(m => m.code === 'cash-on-delivery')) {
                await this.paymentMethodService.create(ctx, {
                    code: 'cash-on-delivery',
                    enabled: true,
                    handler: { code: 'cash-on-delivery', arguments: [] },
                    translations: [
                        {
                            languageCode: 'en' as any,
                            name: 'Pay on delivery',
                            description: 'Confirm on WhatsApp and pay when your device is delivered',
                        },
                    ],
                });
                Logger.info('Created "cash-on-delivery" payment method', 'PaystackPlugin');
            }
        } catch (e) {
            Logger.warn(`Could not ensure cash-on-delivery method: ${e instanceof Error ? e.message : e}`, 'PaystackPlugin');
        }
    }
}
