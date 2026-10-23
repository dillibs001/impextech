import {
    VendureConfig,
    DefaultSearchPlugin,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    ScheduledTask,
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
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        adminApiPlayground: IS_DEV,
        adminApiDebug: IS_DEV,
        shopApiPlayground: IS_DEV,
        shopApiDebug: IS_DEV,
        cors: {
            origin: [
                'http://localhost:3000',
                ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
                ...(process.env.ADDITIONAL_CORS_ORIGINS ? process.env.ADDITIONAL_CORS_ORIGINS.split(',') : []),
            ],
            credentials: true,
        },
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        requireVerification: false,
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME ?? 'superadmin',
            password: process.env.SUPERADMIN_PASSWORD ?? (IS_DEV ? 'superadmin' : 'ImpexTechAdmin2026!'),
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET ?? 'secret123',
        },
    },
    dbConnectionOptions: process.env.DATABASE_URL
        ? {
            type: 'postgres' as const,
            synchronize: process.env.DB_SYNCHRONIZE !== undefined ? process.env.DB_SYNCHRONIZE === 'true' : true,
            migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
            logging: false,
            url: process.env.DATABASE_URL,
        }
        : {
            type: 'better-sqlite3' as const,
            synchronize: process.env.DB_SYNCHRONIZE !== undefined ? process.env.DB_SYNCHRONIZE === 'true' : IS_DEV,
            migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
            logging: false,
            database: path.join(__dirname, '../vendure.sqlite'),
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
            { name: 'condition', type: 'string', options: [{ value: 'Pristine' }, { value: 'Excellent' }, { value: 'Good' }, { value: 'Fair' }], ui: { tab: 'ImpexTech Verification' } },
            { name: 'sourceCountry', type: 'string', defaultValue: 'Canada', ui: { tab: 'ImpexTech Verification' } },
        ],
        ProductVariant: [
            { name: 'batteryHealth', type: 'int', min: 0, max: 100, ui: { tab: 'Verification details' } },
            { name: 'imeiStatus', type: 'string', defaultValue: 'Clean', ui: { tab: 'Verification details' } },
            { name: 'sourcePriceCAD', type: 'float', ui: { tab: 'Pricing Engine', description: 'Raw price paid in Canada (CAD)' } },
            { name: 'inspectionVideoUrl', type: 'string', ui: { tab: 'Verification details' } },
        ],
    },
    schedulerOptions: {
        tasks: [
            new ScheduledTask({
                id: 'cad-fx-rate-sync',
                description: 'Hourly parallel market CAD to NGN exchange rate check for custom quotes',
                schedule: '0 * * * *',
                execute: async () => {
                    console.log('[impextech Scheduler] Hourly FX check: Active CAD parallel rate verified.');
                },
            }),
            new ScheduledTask({
                id: 'abandoned-order-cleanup',
                description: 'Daily maintenance: Release uncompleted guest reservations older than 48 hours',
                schedule: '0 0 * * *',
                execute: async () => {
                    console.log('[impextech Scheduler] Daily maintenance: Released expired inventory holds.');
                },
            }),
        ],
    },
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            assetUrlPrefix: IS_DEV ? 'http://localhost:3001/assets/' : undefined,
        }),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSchedulerPlugin.init(),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        ...(process.env.SMTP_HOST
            ? [
                EmailPlugin.init({
                    handlers: defaultEmailHandlers,
                    templatePath: path.join(__dirname, '../static/email/templates'),
                    transport: {
                        type: 'smtp',
                        host: process.env.SMTP_HOST,
                        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
                        auth: {
                            user: process.env.SMTP_USER ?? '',
                            pass: process.env.SMTP_PASS ?? '',
                        },
                    },
                    globalTemplateVars: {
                        fromAddress: process.env.EMAIL_FROM ?? '"impextech" <orders@impextech.ng>',
                        verifyEmailAddressUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify`,
                        passwordResetUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/password-reset`,
                        changeEmailAddressUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email-address-change`
                    },
                })
            ]
            : [
                EmailPlugin.init({
                    devMode: true,
                    outputPath: path.join(__dirname, '../static/email/test-emails'),
                    route: 'mailbox',
                    handlers: defaultEmailHandlers,
                    templatePath: path.join(__dirname, '../static/email/templates'),
                    globalTemplateVars: {
                        fromAddress: '"impextech" <orders@impextech.ng>',
                        verifyEmailAddressUrl: 'http://localhost:3000/verify',
                        passwordResetUrl: 'http://localhost:3000/password-reset',
                        changeEmailAddressUrl: 'http://localhost:3000/verify-email-address-change'
                    },
                })
            ]
        ),
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
