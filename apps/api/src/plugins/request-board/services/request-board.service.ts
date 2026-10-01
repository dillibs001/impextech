import { Injectable } from '@nestjs/common';
import { RequestContext, TransactionalConnection } from '@vendure/core';
import { GadgetRequest } from '../entities/gadget-request.entity';

@Injectable()
export class RequestBoardService {
    constructor(private connection: TransactionalConnection) {}

    async submitRequest(ctx: RequestContext, input: any) {
        const newRequest = new GadgetRequest({
            ...input,
            status: 'pending'
        });
        return this.connection.getRepository(ctx, GadgetRequest).save(newRequest);
    }
}
