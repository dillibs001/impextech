import { LanguageCode, PaymentMethodHandler, CreatePaymentResult, SettlePaymentResult } from '@vendure/core';
import axios from 'axios';

/**
 * The Paystack Payment Handler enforces strict financial verification.
 * 1. It receives a transaction reference from the frontend.
 * 2. It performs a server-to-server call to Paystack to verify the exact amount.
 * 3. It natively handles minor unit math (kobo).
 */
export const paystackPaymentHandler = new PaymentMethodHandler({
    code: 'paystack',
    description: [{ languageCode: LanguageCode.en, value: 'Paystack' }],
    args: {
        secretKey: { type: 'string', ui: { component: 'password-input' } },
    },
    createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => {
        try {
            // The frontend popup returns a reference, which it sends to this mutation.
            const reference = metadata.reference;
            if (!reference) {
                return { 
                    amount: order.totalWithTax, 
                    state: 'Declined' as const, 
                    errorMessage: 'No Paystack reference provided by client.' 
                };
            }
            
            // Server Verification Rule: Cross-check charge.success
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: { Authorization: `Bearer ${args.secretKey}` }
            });

            const data = response.data.data;

            // Enforce exact amount matching (Minor Unit Math rule)
            // Paystack amount is in Kobo. Vendure 'amount' is also in minor units.
            if (data.status === 'success' && data.amount === amount) {
                return {
                    amount: amount,
                    state: 'Settled' as const,
                    transactionId: reference,
                    metadata: {
                        authorization_code: data.authorization?.authorization_code,
                        card_type: data.authorization?.card_type,
                        last4: data.authorization?.last4,
                        channel: data.channel,
                    },
                };
            } else if (data.status === 'abandoned' || data.status === 'failed') {
                return {
                    amount: amount,
                    state: 'Declined' as const,
                    errorMessage: data.gateway_response || 'Transaction failed',
                };
            }

            // If it's still processing
            return {
                amount: amount,
                state: 'Authorized' as const,
                transactionId: reference,
            };
        } catch (e: any) {
            return { 
                amount: order.totalWithTax, 
                state: 'Declined' as const, 
                errorMessage: e.response?.data?.message || e.message 
            };
        }
    },
    settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
        // Since we mark it as Settled directly inside createPayment after verification, 
        // this method just returns success.
        return { success: true };
    },
    createRefund: async (ctx, input, amount, order, payment, args) => {
        try {
            // Server-to-Server Automated Refund
            const response = await axios.post('https://api.paystack.co/refund', {
                transaction: payment.transactionId,
                amount: amount // Must be in minor units (Kobo)
            }, {
                headers: { Authorization: `Bearer ${args.secretKey}` }
            });

            if (response.data.status === true) {
                return {
                    state: 'Settled' as const,
                    transactionId: response.data.data.transaction?.reference || response.data.data.id.toString(),
                    metadata: response.data.data
                };
            }
            return { state: 'Failed' as const, errorMessage: response.data.message };
        } catch (e: any) {
            return { state: 'Failed' as const, errorMessage: e.response?.data?.message || e.message };
        }
    }
});
