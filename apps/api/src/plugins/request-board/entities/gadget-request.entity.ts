import { DeepPartial, VendureEntity } from '@vendure/core';
import { Column, Entity } from 'typeorm';

@Entity()
export class GadgetRequest extends VendureEntity {
    constructor(input?: DeepPartial<GadgetRequest>) {
        super(input);
    }

    @Column()
    deviceType: string;

    @Column()
    brand: string;

    @Column()
    model: string;

    @Column()
    storagePreference: string;

    @Column()
    colorPreference: string;

    @Column()
    conditionPreference: string;

    @Column('int')
    budgetMax: number;

    @Column('text')
    additionalNotes: string;

    @Column({ default: 'pending' })
    status: string; // pending, sourcing, quoted, accepted, declined

    @Column()
    customerId: string;

    @Column('int', { nullable: true })
    sourcePriceCAD: number;

    @Column('int', { nullable: true })
    quotedPriceNGN: number;
}
