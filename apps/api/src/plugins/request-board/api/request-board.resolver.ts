import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext, Transaction } from '@vendure/core';
import { RequestBoardService } from '../services/request-board.service';

@Resolver()
export class RequestBoardResolver {
    constructor(private requestBoardService: RequestBoardService) {}

    @Transaction()
    @Mutation()
    submitGadgetRequest(@Ctx() ctx: RequestContext, @Args('input') input: any) {
        return this.requestBoardService.submitRequest(ctx, input);
    }
}
