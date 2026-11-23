import {
    CreatePaymentResult,
    CreateRefundResult,
    Injector,
    LanguageCode,
    Logger,
    PaymentMethodHandler,
    Refund,
    SettlePaymentResult,
    TransactionalConnection,
} from '@vendure/core';
import { PaystackTransaction } from './entities/paystack-transaction.entity';
import { evaluateVerification, getSecretKey, PaystackClient, planRefund } from './paystack-client';

let connection: TransactionalConnection;

/**
 * Paystack payments are only ever added by PaystackService (webhook, verify mutation,
 * scheduled jobs), which runs with an internal admin context. The public Shop API
 * `addPaymentToOrder` mutation is refused so a browser can never submit a reference itself.
 */
export const paystackPaymentHandler = new PaymentMethodHandler({
    code: 'paystack',
    description: [{ languageCode: LanguageCode.en, value: 'Paystack' }],
    args: {
        secretKey: { type: 'string', ui: { component: 'password-input' } },
    },
    init(injector: Injector) {
        connection = injector.get(TransactionalConnection);
    },
    createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => {
        const declined = (errorMessage: string): CreatePaymentResult => ({ amount, state: 'Declined', errorMessage });

        if (ctx.apiType !== 'admin') {
            return declined('Paystack payments are confirmed by the server. Use verifyPaystackPayment.');
        }
        const reference = typeof metadata?.reference === 'string' ? metadata.reference : undefined;
        if (!reference) {
            return declined('No Paystack reference provided');
        }
        const binding = await connection
            .getRepository(ctx, PaystackTransaction)
            .findOne({ where: { reference } });
        if (!binding || binding.orderCode !== order.code) {
            return declined('Reference was not issued for this order');
        }

        try {
            const tx = await new PaystackClient(getSecretKey(args.secretKey)).verify(reference);
            const outcome = evaluateVerification(tx, { amount, orderCode: order.code });
            if (outcome.decision !== 'settle') {
                return declined(outcome.reason);
            }
            return {
                amount,
                state: 'Settled',
                transactionId: reference,
                metadata: {
                    paystackTransactionId: tx.id,
                    channel: tx.channel,
                    paidAt: tx.paid_at,
                    card_type: tx.authorization?.card_type,
                    last4: tx.authorization?.last4,
                },
            };
        } catch (e: any) {
            return declined(e?.response?.data?.message || e?.message || 'Verification failed');
        }
    },
    settlePayment: async (): Promise<SettlePaymentResult> => {
        // Payments are only ever created as Settled after verification above.
        return { success: true };
    },
    createRefund: async (ctx, input, amount, order, payment, args): Promise<CreateRefundResult> => {
        try {
            const client = new PaystackClient(getSecretKey(args.secretKey));
            const tx = await client.verify(payment.transactionId);
            const paystackRefunds = (await client.listRefunds(tx.id)).filter(r => {
                const t = r.transaction;
                const id = typeof t === 'object' && t ? t.id : t;
                return id === undefined || id === null || String(id) === String(tx.id);
            });
            const knownRefunds = await connection
                .getRepository(ctx, Refund)
                .find({ where: { paymentId: payment.id } });
            const plan = planRefund({
                requested: amount,
                paymentAmount: payment.amount,
                paystackRefunds,
                knownRefundIds: knownRefunds.map(r => r.transactionId).filter((x): x is string => !!x),
            });

            if (plan.action === 'reject') {
                return { state: 'Failed', metadata: { errorMessage: plan.reason } };
            }
            if (plan.action === 'adopt') {
                Logger.warn(
                    `Adopting existing Paystack refund ${plan.refundId} for ${payment.transactionId} instead of refunding twice`,
                    'PaystackHandler',
                );
                const existing = paystackRefunds.find(r => r.id === plan.refundId)!;
                return { state: mapRefundState(existing.status), transactionId: String(existing.id), metadata: { adopted: true } };
            }
            const created = await client.createRefund(payment.transactionId, plan.amount);
            return { state: mapRefundState(created.status), transactionId: String(created.id), metadata: { status: created.status } };
        } catch (e: any) {
            // If Paystack accepted the refund but the response was lost, the next attempt adopts it.
            return { state: 'Failed', metadata: { errorMessage: e?.response?.data?.message || e?.message } };
        }
    },
});

function mapRefundState(status: string): 'Settled' | 'Pending' | 'Failed' {
    if (status === 'processed') return 'Settled';
    if (status === 'failed') return 'Failed';
    return 'Pending';
}

/**
 * Cash/transfer on delivery (the WhatsApp concierge flow). The order is placed as
 * PaymentAuthorized with stock reserved; staff click "Settle payment" in the admin
 * once the money is collected.
 */
export const cashOnDeliveryHandler = new PaymentMethodHandler({
    code: 'cash-on-delivery',
    description: [{ languageCode: LanguageCode.en, value: 'Pay on delivery (WhatsApp concierge)' }],
    args: {},
    createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => ({
        amount,
        state: 'Authorized',
        metadata: { channel: typeof metadata?.channel === 'string' ? metadata.channel : 'whatsapp' },
    }),
    settlePayment: async (): Promise<SettlePaymentResult> => ({ success: true }),
    cancelPayment: async () => ({ success: true }),
});
