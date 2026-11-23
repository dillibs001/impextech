import { DeepPartial, VendureEntity } from '@vendure/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * One row per Paystack reference issued by this server. It is the idempotency
 * record for payments:
 * - The reference column is UNIQUE, so a reference can only ever map to one order.
 * - `status` moves through a compare-and-set (initialized → processing → settled/declined),
 *   so concurrent webhook + browser verification calls cannot both settle the order.
 */
export type PaystackTransactionStatus =
    | 'initialized' // issued to the browser, not yet confirmed
    | 'processing' // a worker currently holds the settle lock
    | 'settled' // payment added to the Vendure order
    | 'declined' // Paystack said failed / mismatched
    | 'needs_review'; // money received but order could not take it (e.g. cancelled) — refund manually

@Entity()
export class PaystackTransaction extends VendureEntity {
    constructor(input?: DeepPartial<PaystackTransaction>) {
        super(input);
    }

    @Index({ unique: true })
    @Column()
    reference!: string;

    @Index()
    @Column()
    orderCode!: string;

    @Column()
    orderId!: string;

    /** Amount in kobo that Paystack was told to charge (the order total at init time). */
    @Column('int')
    amount!: number;

    @Index()
    @Column('varchar')
    status!: PaystackTransactionStatus;

    @Column('varchar', { nullable: true })
    note!: string | null;

    @Column({ type: Date, nullable: true })
    lockedAt!: Date | null;
}
