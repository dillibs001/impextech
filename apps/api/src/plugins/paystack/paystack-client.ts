import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';

/**
 * Thin, typed wrapper around the Paystack REST API plus the pure decision
 * functions that the payment handler, webhook and scheduled jobs share.
 * Keeping the rules here (and free of Vendure imports) lets them be unit-tested.
 */

export interface PaystackTransactionData {
    id: number;
    status: 'success' | 'failed' | 'abandoned' | 'ongoing' | 'pending' | 'processing' | 'queued' | 'reversed' | string;
    reference: string;
    amount: number; // kobo
    currency: string;
    channel?: string;
    gateway_response?: string;
    paid_at?: string | null;
    metadata?: Record<string, unknown> | string | null;
    authorization?: { authorization_code?: string; card_type?: string; last4?: string } | null;
}

export interface PaystackRefundData {
    id: number;
    amount: number; // kobo
    status: 'pending' | 'processing' | 'processed' | 'failed' | 'needs-attention' | string;
    transaction?: { id?: number; reference?: string } | number | null;
    createdAt?: string;
}

export function getSecretKey(explicit?: string): string {
    const key = explicit && !explicit.includes('placeholder') ? explicit : process.env.PAYSTACK_SECRET_KEY;
    if (!key) {
        throw new Error('PAYSTACK_SECRET_KEY is not configured');
    }
    return key;
}

export class PaystackClient {
    private http: AxiosInstance;

    constructor(secretKey: string) {
        this.http = axios.create({
            baseURL: 'https://api.paystack.co',
            timeout: 15000,
            headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' },
        });
    }

    async initialize(input: {
        email: string;
        amount: number;
        reference: string;
        metadata: Record<string, unknown>;
        callbackUrl?: string;
    }): Promise<{ accessCode: string; authorizationUrl: string; reference: string }> {
        const res = await this.http.post('/transaction/initialize', {
            email: input.email,
            amount: input.amount,
            currency: 'NGN',
            reference: input.reference,
            metadata: input.metadata,
            ...(input.callbackUrl ? { callback_url: input.callbackUrl } : {}),
        });
        const d = res.data.data;
        return { accessCode: d.access_code, authorizationUrl: d.authorization_url, reference: d.reference };
    }

    async verify(reference: string): Promise<PaystackTransactionData> {
        const res = await this.http.get(`/transaction/verify/${encodeURIComponent(reference)}`);
        return res.data.data;
    }

    async listSuccessfulTransactions(from: Date, to: Date): Promise<PaystackTransactionData[]> {
        const all: PaystackTransactionData[] = [];
        for (let page = 1; page <= 50; page++) {
            const res = await this.http.get('/transaction', {
                params: { status: 'success', from: from.toISOString(), to: to.toISOString(), perPage: 100, page },
            });
            const items: PaystackTransactionData[] = res.data.data ?? [];
            all.push(...items);
            if (page >= (res.data.meta?.pageCount ?? 1)) break;
        }
        return all;
    }

    async listRefunds(transactionId: string | number): Promise<PaystackRefundData[]> {
        const res = await this.http.get('/refund', { params: { transaction: transactionId, perPage: 100 } });
        return res.data.data ?? [];
    }

    async createRefund(transaction: string, amount: number): Promise<PaystackRefundData> {
        const res = await this.http.post('/refund', { transaction, amount });
        return res.data.data;
    }
}

/** Reads `metadata.orderCode` whether Paystack returns metadata as an object or a JSON string. */
export function metadataOrderCode(metadata: PaystackTransactionData['metadata']): string | undefined {
    if (!metadata) return undefined;
    let obj: unknown = metadata;
    if (typeof metadata === 'string') {
        try {
            obj = JSON.parse(metadata);
        } catch {
            return undefined;
        }
    }
    const code = (obj as Record<string, unknown>)?.orderCode;
    return typeof code === 'string' ? code : undefined;
}

export type VerificationOutcome =
    | { decision: 'settle' }
    | { decision: 'decline'; reason: string }
    | { decision: 'pending'; reason: string };

/**
 * The single rule for whether a Paystack transaction may pay for a Vendure order.
 * Fails closed: anything other than an exact match on status, amount, currency and
 * order code is never treated as paid.
 */
export function evaluateVerification(
    tx: Pick<PaystackTransactionData, 'status' | 'amount' | 'currency' | 'metadata' | 'gateway_response'>,
    expected: { amount: number; orderCode: string },
): VerificationOutcome {
    // Only a reversal is final. Paystack reports "abandoned" for a transaction that was
    // initialised but not paid yet, and a "failed" card attempt can be retried in the same
    // popup, so both stay pending until the checkout hold expires.
    if (tx.status === 'reversed') {
        return { decision: 'decline', reason: tx.gateway_response || 'Transaction reversed' };
    }
    if (tx.status !== 'success') {
        return { decision: 'pending', reason: `Transaction status is "${tx.status}"` };
    }
    if (tx.currency !== 'NGN') {
        return { decision: 'decline', reason: `Currency mismatch: expected NGN, got ${tx.currency}` };
    }
    if (tx.amount !== expected.amount) {
        return { decision: 'decline', reason: `Amount mismatch: expected ${expected.amount}, got ${tx.amount}` };
    }
    const code = metadataOrderCode(tx.metadata);
    if (code !== expected.orderCode) {
        return { decision: 'decline', reason: `Order mismatch: transaction belongs to ${code ?? 'no order'}` };
    }
    return { decision: 'settle' };
}

/** Constant-time HMAC-SHA512 check over the exact bytes Paystack sent. */
export function isValidWebhookSignature(rawBody: Buffer | string, signature: string | undefined, secret: string): boolean {
    if (!signature || typeof signature !== 'string') return false;
    const expected = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signature, 'utf8');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Decides what to do about a refund request given what Paystack already holds.
 * Paystack refunds that Vendure never recorded (e.g. the first attempt timed out after
 * Paystack accepted it) are "adopted" instead of issuing a second refund.
 */
export function planRefund(input: {
    requested: number;
    paymentAmount: number;
    paystackRefunds: Array<Pick<PaystackRefundData, 'id' | 'amount' | 'status'>>;
    knownRefundIds: string[];
}):
    | { action: 'adopt'; refundId: number }
    | { action: 'create'; amount: number }
    | { action: 'reject'; reason: string } {
    const live = input.paystackRefunds.filter(r => r.status !== 'failed');
    const orphan = live.find(r => !input.knownRefundIds.includes(String(r.id)) && r.amount === input.requested);
    if (orphan) {
        return { action: 'adopt', refundId: orphan.id };
    }
    const alreadyRefunded = live.reduce((sum, r) => sum + r.amount, 0);
    const remaining = input.paymentAmount - alreadyRefunded;
    if (input.requested <= 0) {
        return { action: 'reject', reason: 'Refund amount must be positive' };
    }
    if (input.requested > remaining) {
        return {
            action: 'reject',
            reason: `Refund of ${input.requested} exceeds refundable balance ${remaining} at Paystack`,
        };
    }
    return { action: 'create', amount: input.requested };
}
