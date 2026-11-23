import { Injectable } from '@nestjs/common';
import {
    ActiveOrderService,
    ID,
    isGraphQlErrorResult,
    Logger,
    Order,
    OrderService,
    RequestContext,
    RequestContextService,
    TransactionalConnection,
    UserInputError,
} from '@vendure/core';
import * as crypto from 'crypto';
import { Brackets, In, LessThan, MoreThanOrEqual } from 'typeorm';
import { PaystackTransaction, PaystackTransactionStatus } from './entities/paystack-transaction.entity';
import { evaluateVerification, getSecretKey, PaystackClient } from './paystack-client';

const loggerCtx = 'PaystackService';

/** How long a settle lock may be held before another caller may take it over (crash recovery). */
const LOCK_STALE_MS = 5 * 60 * 1000;

/** Order states in which the order has already been paid for or placed. */
const PAID_STATES = [
    'PaymentAuthorized',
    'PaymentSettled',
    'PartiallyShipped',
    'Shipped',
    'PartiallyDelivered',
    'Delivered',
];

export interface PaystackCheckout {
    reference: string;
    accessCode: string;
    amount: number;
    orderCode: string;
}

export interface SettleResult {
    status: PaystackTransactionStatus | 'pending' | 'unknown';
    orderCode?: string;
    orderState?: string;
    message?: string;
}

@Injectable()
export class PaystackService {
    constructor(
        private connection: TransactionalConnection,
        private orderService: OrderService,
        private activeOrderService: ActiveOrderService,
        private requestContextService: RequestContextService,
    ) {}

    private client() {
        return new PaystackClient(getSecretKey());
    }

    private repo() {
        // Deliberately NOT bound to a request transaction: the compare-and-set lock must
        // commit immediately so concurrent callers can see it.
        return this.connection.rawConnection.getRepository(PaystackTransaction);
    }

    private adminCtx() {
        return this.requestContextService.create({ apiType: 'admin' });
    }

    /**
     * Step 1 of checkout. The amount and order binding come from the database, never
     * from the browser. Returns the access code the Paystack popup resumes.
     */
    async initForActiveOrder(ctx: RequestContext): Promise<PaystackCheckout> {
        const active = await this.activeOrderService.getActiveOrder(ctx, undefined);
        if (!active) {
            throw new UserInputError('There is no active order to pay for');
        }
        const order = await this.orderService.findOne(ctx, active.id, ['customer']);
        if (!order) {
            throw new UserInputError('Order not found');
        }
        if (order.state !== 'ArrangingPayment') {
            throw new UserInputError(`Order must be in ArrangingPayment to pay (currently ${order.state})`);
        }
        const email = order.customer?.emailAddress;
        if (!email) {
            throw new UserInputError('Set customer details on the order before paying');
        }
        if (order.totalWithTax <= 0) {
            throw new UserInputError('Order total must be greater than zero');
        }

        const reference = `${order.code}-${crypto.randomBytes(5).toString('hex')}`;
        // Record the reference first so a Paystack transaction never exists without our binding.
        await this.repo().save(
            new PaystackTransaction({
                reference,
                orderCode: order.code,
                orderId: String(order.id),
                amount: order.totalWithTax,
                status: 'initialized',
                note: null,
                lockedAt: null,
            }),
        );

        const init = await this.client().initialize({
            email,
            amount: order.totalWithTax,
            reference,
            metadata: { orderCode: order.code, orderId: String(order.id) },
        });
        return { reference, accessCode: init.accessCode, amount: order.totalWithTax, orderCode: order.code };
    }

    /**
     * Idempotently confirms a Paystack reference and settles its order. Safe to call any
     * number of times, concurrently, from the webhook, the browser and the scheduled jobs.
     */
    async settle(reference: string, source: string): Promise<SettleResult> {
        const row = await this.repo().findOne({ where: { reference } });
        if (!row) {
            Logger.warn(`[${source}] Unknown Paystack reference ${reference} — not issued by this server`, loggerCtx);
            return { status: 'unknown', message: 'Unknown payment reference' };
        }
        if (row.status === 'settled' || row.status === 'declined' || row.status === 'needs_review') {
            return this.describe(row);
        }

        // Compare-and-set: only one caller may move the row into "processing".
        const staleBefore = new Date(Date.now() - LOCK_STALE_MS);
        const claim = await this.repo()
            .createQueryBuilder()
            .update(PaystackTransaction)
            .set({ status: 'processing', lockedAt: new Date() })
            .where({ reference })
            .andWhere(
                new Brackets(qb => {
                    qb.where({ status: 'initialized' }).orWhere({
                        status: 'processing',
                        lockedAt: LessThan(staleBefore),
                    });
                }),
            )
            .execute();
        if (claim.affected !== 1) {
            return { status: 'processing', orderCode: row.orderCode, message: 'Payment is already being confirmed' };
        }

        try {
            const tx = await this.client().verify(reference);
            const outcome = evaluateVerification(tx, { amount: row.amount, orderCode: row.orderCode });

            if (outcome.decision === 'pending') {
                await this.finish(reference, 'initialized', outcome.reason);
                return { status: 'pending', orderCode: row.orderCode, message: outcome.reason };
            }
            if (outcome.decision === 'decline') {
                // A *successful* charge that fails our checks means money arrived that we cannot
                // apply automatically — flag it for a human rather than silently ignoring it.
                const status = tx.status === 'success' ? 'needs_review' : 'declined';
                await this.finish(reference, status, outcome.reason);
                Logger.warn(`[${source}] ${reference} ${status}: ${outcome.reason}`, loggerCtx);
                return { status, orderCode: row.orderCode, message: outcome.reason };
            }

            const applied = await this.applyPaymentToOrder(row.orderId, reference);
            await this.finish(reference, applied.status, applied.message ?? null);
            if (applied.status === 'needs_review') {
                Logger.error(`[${source}] ${reference} paid but not applied: ${applied.message}`, loggerCtx);
            } else {
                Logger.info(`[${source}] ${reference} settled order ${row.orderCode}`, loggerCtx);
            }
            return { ...applied, orderCode: row.orderCode };
        } catch (e: any) {
            // Release the lock so the webhook retry or the sweep can try again.
            const message = e?.response?.data?.message || e?.message || String(e);
            await this.finish(reference, 'initialized', `Retryable error: ${message}`);
            Logger.error(`[${source}] ${reference} settle failed, will retry: ${message}`, loggerCtx);
            throw e;
        }
    }

    private async applyPaymentToOrder(
        orderId: ID,
        reference: string,
    ): Promise<{ status: PaystackTransactionStatus; orderState?: string; message?: string }> {
        const ctx = await this.adminCtx();
        return this.connection.withTransaction(ctx, async txCtx => {
            const order = await this.orderService.findOne(txCtx, orderId, ['payments']);
            if (!order) {
                return { status: 'needs_review' as const, message: 'Order no longer exists' };
            }
            const alreadyApplied = order.payments?.some(
                p => p.transactionId === reference && (p.state === 'Settled' || p.state === 'Authorized'),
            );
            if (alreadyApplied || PAID_STATES.includes(order.state)) {
                return alreadyApplied
                    ? { status: 'settled' as const, orderState: order.state }
                    : {
                          status: 'needs_review' as const,
                          orderState: order.state,
                          message: `Order was already paid by another payment (${order.state}); refund this one`,
                      };
            }
            if (order.state === 'AddingItems') {
                const moved = await this.orderService.transitionToState(txCtx, order.id, 'ArrangingPayment');
                if (isGraphQlErrorResult(moved)) {
                    return { status: 'needs_review' as const, orderState: order.state, message: moved.message };
                }
            } else if (order.state !== 'ArrangingPayment') {
                return {
                    status: 'needs_review' as const,
                    orderState: order.state,
                    message: `Order is ${order.state}; payment received but cannot be applied`,
                };
            }

            const result = await this.orderService.addPaymentToOrder(txCtx, order.id, {
                method: 'paystack',
                metadata: { reference },
            });
            if (isGraphQlErrorResult(result)) {
                return { status: 'needs_review' as const, orderState: order.state, message: result.message };
            }
            if (!PAID_STATES.includes(result.state)) {
                return {
                    status: 'needs_review' as const,
                    orderState: result.state,
                    message: 'Payment was declined against the current order total',
                };
            }
            return { status: 'settled' as const, orderState: result.state };
        });
    }

    private async finish(reference: string, status: PaystackTransactionStatus, note: string | null) {
        await this.repo().update({ reference }, { status, note, lockedAt: null });
    }

    private async describe(row: PaystackTransaction): Promise<SettleResult> {
        const ctx = await this.adminCtx();
        const order = await this.orderService.findOne(ctx, row.orderId);
        return { status: row.status, orderCode: row.orderCode, orderState: order?.state, message: row.note ?? undefined };
    }

    /**
     * Releases stock held by checkouts that never completed. Before cancelling, every
     * outstanding Paystack reference for the order is re-verified so a late payment is
     * settled rather than lost.
     */
    async sweepExpiredCheckouts(holdMinutes: number) {
        const cutoff = new Date(Date.now() - holdMinutes * 60 * 1000);
        const ctx = await this.adminCtx();
        const expired = await this.connection.rawConnection.getRepository(Order).find({
            where: { state: 'ArrangingPayment', updatedAt: LessThan(cutoff) },
            select: ['id', 'code'],
        });
        let cancelled = 0;
        let settled = 0;

        for (const { id, code } of expired) {
            const refs = await this.repo().find({
                where: { orderCode: code, status: In(['initialized', 'processing']) },
            });
            for (const ref of refs) {
                try {
                    const r = await this.settle(ref.reference, 'sweep');
                    if (r.status === 'settled') settled++;
                } catch {
                    // logged in settle(); leave the order alone this round
                }
            }
            const order = await this.orderService.findOne(ctx, id);
            const stillOpen = await this.repo().count({ where: { orderCode: code, status: 'processing' } });
            if (order?.state === 'ArrangingPayment' && stillOpen === 0) {
                const result = await this.connection.withTransaction(ctx, txCtx =>
                    this.orderService.cancelOrder(txCtx, {
                        orderId: id,
                        reason: `Checkout not paid within ${holdMinutes} minutes; stock released`,
                        cancelShipping: true,
                    }),
                );
                if (isGraphQlErrorResult(result)) {
                    Logger.warn(`Could not cancel expired order ${code}: ${result.message}`, loggerCtx);
                } else {
                    cancelled++;
                }
            }
        }

        // Recover settle locks abandoned by a crash.
        const stale = await this.repo().find({
            where: { status: 'processing', lockedAt: LessThan(new Date(Date.now() - LOCK_STALE_MS)) },
        });
        for (const row of stale) {
            await this.settle(row.reference, 'sweep-stale-lock').catch(() => undefined);
        }

        if (expired.length || stale.length) {
            Logger.info(
                `Checkout sweep: ${expired.length} expired, ${settled} late payments settled, ${cancelled} cancelled, ${stale.length} stale locks retried`,
                loggerCtx,
            );
        }
        return { expired: expired.length, settled, cancelled, staleLocks: stale.length };
    }

    /**
     * Compares Paystack's successful transactions with our records and repairs or flags
     * anything that disagrees. Paystack is the source of truth for money received.
     */
    async reconcile(windowHours: number) {
        const to = new Date();
        const from = new Date(to.getTime() - windowHours * 60 * 60 * 1000);
        const remote = await this.client().listSuccessfulTransactions(from, to);
        const remoteRefs = new Set(remote.map(t => t.reference));
        const local = await this.repo().find({ where: { reference: In([...remoteRefs]) } });
        const localByRef = new Map(local.map(r => [r.reference, r]));

        const report = { checked: remote.length, settled: 0, flagged: [] as string[], unmatched: [] as string[] };

        for (const tx of remote) {
            const row = localByRef.get(tx.reference);
            if (!row) {
                report.unmatched.push(tx.reference);
                continue;
            }
            if (row.status === 'initialized' || row.status === 'processing') {
                const r = await this.settle(tx.reference, 'reconcile').catch(() => undefined);
                if (r?.status === 'settled') report.settled++;
                else report.flagged.push(`${tx.reference}: ${r?.status ?? 'error'} ${r?.message ?? ''}`.trim());
            } else if (row.status === 'declined') {
                await this.finish(tx.reference, 'needs_review', 'Paystack reports success but we declined it');
                report.flagged.push(`${tx.reference}: declined locally but paid at Paystack`);
            } else if (row.status === 'needs_review') {
                report.flagged.push(`${tx.reference}: needs review — ${row.note ?? ''}`);
            }
        }

        // Settled locally but not successful at Paystack in the same window.
        const localSettled = await this.repo().find({
            where: { status: 'settled', updatedAt: MoreThanOrEqual(from) },
        });
        for (const row of localSettled) {
            if (!remoteRefs.has(row.reference)) {
                report.flagged.push(`${row.reference}: settled locally but not successful at Paystack`);
            }
        }

        const level = report.flagged.length || report.unmatched.length ? 'warn' : 'info';
        Logger[level](
            `Reconciliation (${windowHours}h): ${report.checked} Paystack payments, ${report.settled} repaired, ` +
                `${report.flagged.length} flagged, ${report.unmatched.length} unmatched` +
                (report.flagged.length ? `\n  - ${report.flagged.join('\n  - ')}` : '') +
                (report.unmatched.length ? `\n  unmatched: ${report.unmatched.join(', ')}` : ''),
            loggerCtx,
        );
        return report;
    }
}
