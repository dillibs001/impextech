import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext, Transaction } from '@vendure/core';
import { parse } from 'graphql';
import { PaystackService } from './paystack.service';

export const paystackShopApiExtensions = parse(`
    type PaystackCheckout {
        reference: String!
        accessCode: String!
        amount: Int!
        orderCode: String!
    }

    type PaystackPaymentStatus {
        status: String!
        orderCode: String
        orderState: String
        message: String
    }

    extend type Mutation {
        """
        Starts a Paystack payment for the active order. The amount is the order total held by
        the server. Returns the access code for PaystackPop.resumeTransaction().
        """
        initPaystackTransaction: PaystackCheckout!

        """
        Asks the server to confirm a reference with Paystack and settle the order. Idempotent;
        the webhook does the same thing, so this only makes the confirmation faster.
        """
        verifyPaystackPayment(reference: String!): PaystackPaymentStatus!
    }
`);

@Resolver()
export class PaystackShopResolver {
    constructor(private paystackService: PaystackService) {}

    @Transaction()
    @Mutation()
    @Allow(Permission.Owner)
    initPaystackTransaction(@Ctx() ctx: RequestContext) {
        return this.paystackService.initForActiveOrder(ctx);
    }

    // No @Transaction(): settle() manages its own lock and transaction.
    @Mutation()
    @Allow(Permission.Owner)
    async verifyPaystackPayment(@Args('reference') reference: string) {
        try {
            return await this.paystackService.settle(reference, 'client');
        } catch {
            return { status: 'pending', message: 'Could not reach Paystack; the payment will be confirmed shortly' };
        }
    }
}
