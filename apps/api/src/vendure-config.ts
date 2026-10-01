import {
    VendureConfig,
    DefaultSearchPlugin,
    DefaultJobQueuePlugin,
} from '@vendure/core';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { RequestBoardPlugin } from './plugins/request-board/request-board.plugin';
import { paystackPaymentHandler } from './plugins/paystack/paystack-handler';
import { PaystackPlugin } from './plugins/paystack/paystack.plugin';
import path from 'path';
import 'dotenv/config';

const IS_DEV = process.env.APP_ENV === 'dev' || process.env.NODE_ENV !== 'production';

export const config: VendureConfig = {
    apiOptions: {
        port: 3001,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        adminApiPlayground: IS_DEV,
        adminApiDebug: IS_DEV,
        shopApiPlayground: IS_DEV,
        shopApiDebug: IS_DEV,
        cors: {
            origin: ['http://localhost:3000'],
            credentials: true,
        },
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME ?? 'superadmin',
            password: process.env.SUPERADMIN_PASSWORD ?? 'superadmin',
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET ?? 'secret123',
        },
    },
    dbConnectionOptions: {
        type: 'better-sqlite3',
        synchronize: IS_DEV,
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        database: path.join(__dirname, '../vendure.sqlite'),
        
        // PostgreSQL Production Configuration
        /*
        type: 'postgres',
        synchronize: false,
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        url: process.env.DATABASE_URL,
        */
    },
    paymentOptions: {
        paymentMethodHandlers: [paystackPaymentHandler],
    },
    customFields: {
        GlobalSettings: [
            { name: 'cadRemitRate', type: 'float', defaultValue: 1085, ui: { component: 'currency-form-input', tab: 'Pricing Config' } },
            { name: 'defaultCommissionRate', type: 'float', defaultValue: 0.15, ui: { tab: 'Pricing Config', description: 'Default commission (e.g. 0.15 for 15%)' } },
        ],
        Product: [
            { name: 'condition', type: 'string', options: [{ value: 'Excellent' }, { value: 'Good' }, { value: 'Fair' }], ui: { tab: 'ImpexTech Verification' } },
            { name: 'sourceCountry', type: 'string', defaultValue: 'Canada', ui: { tab: 'ImpexTech Verification' } },
        ],
        ProductVariant: [
            { name: 'batteryHealth', type: 'int', min: 0, max: 100, ui: { tab: 'Verification details' } },
            { name: 'imeiStatus', type: 'string', defaultValue: 'Clean', ui: { tab: 'Verification details' } },
            { name: 'sourcePriceCAD', type: 'float', ui: { tab: 'Pricing Engine', description: 'Raw price paid in Canada (CAD)' } },
            { name: 'inspectionVideoUrl', type: 'string', ui: { tab: 'Verification details' } },
        ],
    },
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            assetUrlPrefix: IS_DEV ? 'http://localhost:3001/assets/' : undefined,
        }),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init({
            devMode: true,
            outputPath: path.join(__dirname, '../static/email/test-emails'),
            route: 'mailbox',
            handlers: defaultEmailHandlers,
            templatePath: path.join(__dirname, '../static/email/templates'),
            globalTemplateVars: {
                fromAddress: '"example" <noreply@example.com>',
                verifyEmailAddressUrl: 'http://localhost:3000/verify',
                passwordResetUrl: 'http://localhost:3000/password-reset',
                changeEmailAddressUrl: 'http://localhost:3000/verify-email-address-change'
            },
        }),
        AdminUiPlugin.init({
            route: 'admin',
            port: 3002,
            adminUiConfig: {
                apiPort: 3001,
            },
        }),
        RequestBoardPlugin,
        PaystackPlugin,
    ],
};
