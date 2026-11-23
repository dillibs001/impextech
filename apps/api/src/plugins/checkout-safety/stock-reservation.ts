import {
    Allocation,
    ID,
    Injector,
    Order,
    OrderProcess,
    OrderState,
    ProductVariant,
    ProductVariantService,
    Release,
    RequestContext,
    StockAllocationStrategy,
    StockLevel,
    StockMovementService,
    TransactionalConnection,
} from '@vendure/core';
import { In } from 'typeorm';

/**
 * Every device impextech sells is a single unit, so stock must be held the moment a
 * customer starts paying, not after payment succeeds (Vendure's default). Otherwise two
 * customers can both pay for the same phone.
 *
 * - Allocate when the order enters ArrangingPayment.
 * - Refuse that transition if the unit is no longer saleable (checked under a row lock on Postgres).
 * - Release the hold if the customer goes back to editing the cart, or if the unpaid
 *   checkout is cancelled (the expired-checkout sweep).
 */
export class ReserveOnCheckoutStockAllocationStrategy implements StockAllocationStrategy {
    shouldAllocateStock(ctx: RequestContext, fromState: OrderState, toState: OrderState): boolean {
        return toState === 'ArrangingPayment' && (fromState === 'AddingItems' || fromState === 'Draft');
    }
}

let connection: TransactionalConnection;
let productVariantService: ProductVariantService;
let stockMovementService: StockMovementService;

export const stockReservationProcess: OrderProcess<OrderState> = {
    init(injector: Injector) {
        connection = injector.get(TransactionalConnection);
        productVariantService = injector.get(ProductVariantService);
        stockMovementService = injector.get(StockMovementService);
    },

    async onTransitionStart(fromState, toState, { ctx, order }) {
        if (toState !== 'ArrangingPayment' || (fromState !== 'AddingItems' && fromState !== 'Draft')) {
            return;
        }
        const variantIds = order.lines.map(l => l.productVariantId);
        if (!variantIds.length) return;

        // Serialize concurrent checkouts of the same unit. The lock is held until the request's
        // transaction commits, which includes the allocation written in onTransitionEnd.
        // SQLite (local dev) has no row locks but serializes all writes anyway.
        if (connection.rawConnection.options.type === 'postgres') {
            await connection
                .getRepository(ctx, StockLevel)
                .createQueryBuilder('stockLevel')
                .setLock('pessimistic_write')
                .where('stockLevel.productVariantId IN (:...variantIds)', { variantIds })
                .getMany();
        }

        for (const line of order.lines) {
            const variant = await connection.getEntityOrThrow(ctx, ProductVariant, line.productVariantId);
            const saleable = await productVariantService.getSaleableStockLevel(ctx, variant);
            if (line.quantity > saleable) {
                return saleable <= 0
                    ? `"${variant.name}" has just been reserved by another customer and is no longer available`
                    : `Only ${saleable} of "${variant.name}" is available`;
            }
        }
    },

    async onTransitionEnd(fromState, toState, { ctx, order }) {
        // Back to the cart, or cancelled before payment (e.g. the expired-checkout sweep).
        // Vendure only releases stock when cancelling *placed* orders, so release it here.
        if (fromState === 'ArrangingPayment' && (toState === 'AddingItems' || toState === 'Cancelled')) {
            await releaseOutstandingAllocations(ctx, order);
        }
    },
};

async function releaseOutstandingAllocations(ctx: RequestContext, order: Order) {
    const lineIds = order.lines.map(l => l.id);
    if (!lineIds.length) return;
    const sumByLine = async (entity: typeof Allocation | typeof Release) => {
        const rows = await connection.getRepository(ctx, entity).find({
            where: { orderLine: { id: In(lineIds) } },
            relations: ['orderLine'],
        });
        const totals = new Map<ID, number>();
        for (const r of rows) {
            totals.set(r.orderLine.id, (totals.get(r.orderLine.id) ?? 0) + Math.abs(r.quantity));
        }
        return totals;
    };
    const allocated = await sumByLine(Allocation);
    const released = await sumByLine(Release);
    const toRelease = lineIds
        .map(id => ({ orderLineId: id, quantity: (allocated.get(id) ?? 0) - (released.get(id) ?? 0) }))
        .filter(l => l.quantity > 0);
    if (toRelease.length) {
        await stockMovementService.createReleasesForOrderLines(ctx, toRelease);
    }
}
