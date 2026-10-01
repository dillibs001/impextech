import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { paystackPaymentHandler } from './paystack-handler';
import { PaystackWebhookController } from './paystack-webhook.controller';

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [PaystackWebhookController],
    configuration: config => {
        // Note: The payment method handler is added directly in vendure-config.ts 
        // to avoid circular dependencies, but it technically belongs to this plugin logic.
        return config;
    },
})
export class PaystackPlugin {}
