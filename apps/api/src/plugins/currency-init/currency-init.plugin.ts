import { PluginCommonModule, VendurePlugin, ChannelService, RequestContextService, CurrencyCode } from '@vendure/core';
import { OnApplicationBootstrap } from '@nestjs/common';

@VendurePlugin({
    imports: [PluginCommonModule],
})
export class CurrencyInitPlugin implements OnApplicationBootstrap {
    constructor(
        private channelService: ChannelService,
        private requestContextService: RequestContextService,
    ) {}

    async onApplicationBootstrap() {
        try {
            const ctx = await this.requestContextService.create({ apiType: 'admin' });
            const defaultChannel = await this.channelService.getDefaultChannel(ctx);
            if (
                defaultChannel &&
                (defaultChannel.defaultCurrencyCode !== CurrencyCode.NGN ||
                 !defaultChannel.availableCurrencyCodes?.includes(CurrencyCode.NGN))
            ) {
                await this.channelService.update(ctx, {
                    id: defaultChannel.id,
                    defaultCurrencyCode: CurrencyCode.NGN,
                    availableCurrencyCodes: [CurrencyCode.NGN],
                });
                console.log('✅ CurrencyInitPlugin: Default channel currency set to NGN (₦)');
            }
        } catch (err) {
            console.warn('CurrencyInitPlugin notice:', err instanceof Error ? err.message : err);
        }
    }
}
