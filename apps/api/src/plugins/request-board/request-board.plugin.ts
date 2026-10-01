import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { GadgetRequest } from './entities/gadget-request.entity';
import { RequestBoardService } from './services/request-board.service';
import { RequestBoardResolver } from './api/request-board.resolver';
import { shopApiExtensions } from './api/api-extensions';

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [GadgetRequest],
    providers: [RequestBoardService],
    shopApiExtensions: {
        schema: shopApiExtensions,
        resolvers: [RequestBoardResolver],
    },
    configuration: config => {
        return config;
    },
})
export class RequestBoardPlugin {}
