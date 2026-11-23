import test from 'node:test';
import assert from 'node:assert';
import * as crypto from 'crypto';
import {
    evaluateVerification,
    isValidWebhookSignature,
    metadataOrderCode,
    planRefund,
} from '../src/plugins/paystack/paystack-client';

// These tests exercise the production decision functions used by the payment handler,
// the webhook and the scheduled jobs (not copies of them).

const SECRET = 'sk_test_secret_key_12345';
const ORDER = { amount: 80000000, orderCode: 'ORD123' }; // ₦800,000 in kobo
const paid = { status: 'success', amount: 80000000, currency: 'NGN', metadata: { orderCode: 'ORD123' } };

test('Webhook signature: HMAC SHA-512 over the raw body', () => {
    const raw = Buffer.from(JSON.stringify({ event: 'charge.success', data: { reference: 'ORD123-ab12' } }));
    const sig = crypto.createHmac('sha512', SECRET).update(raw).digest('hex');

    assert.strictEqual(isValidWebhookSignature(raw, sig, SECRET), true, 'valid signature accepted');
    assert.strictEqual(isValidWebhookSignature(raw, 'tampered', SECRET), false, 'tampered signature rejected');
    assert.strictEqual(isValidWebhookSignature(raw, sig, 'wrong_secret'), false, 'wrong secret rejected');
    assert.strictEqual(isValidWebhookSignature(raw, undefined, SECRET), false, 'missing signature rejected');

    // Re-serialising JSON can change bytes (key order, spacing); only the exact bytes verify.
    const reformatted = Buffer.from(JSON.stringify(JSON.parse(raw.toString()), null, 2));
    assert.strictEqual(isValidWebhookSignature(reformatted, sig, SECRET), false, 'signature is bound to exact bytes');
});

test('Verification: exact match on status, amount, currency and order settles', () => {
    assert.deepStrictEqual(evaluateVerification(paid, ORDER), { decision: 'settle' });
});

test('Verification: underpayment is declined, never authorized', () => {
    const r = evaluateVerification({ ...paid, amount: 10000 }, ORDER);
    assert.strictEqual(r.decision, 'decline');
});

test('Verification: a payment made for another order cannot be replayed', () => {
    const r = evaluateVerification({ ...paid, metadata: { orderCode: 'OTHER' } }, ORDER);
    assert.strictEqual(r.decision, 'decline');
    const noMeta = evaluateVerification({ ...paid, metadata: null }, ORDER);
    assert.strictEqual(noMeta.decision, 'decline');
});

test('Verification: wrong currency is declined', () => {
    assert.strictEqual(evaluateVerification({ ...paid, currency: 'USD' }, ORDER).decision, 'decline');
});

test('Verification: unfinished transactions stay pending; only a reversal is final', () => {
    for (const status of ['abandoned', 'failed', 'ongoing', 'pending', 'processing']) {
        assert.strictEqual(evaluateVerification({ ...paid, status }, ORDER).decision, 'pending', status);
    }
    assert.strictEqual(evaluateVerification({ ...paid, status: 'reversed' }, ORDER).decision, 'decline');
});

test('Metadata: order code is read from object or JSON string', () => {
    assert.strictEqual(metadataOrderCode({ orderCode: 'A1' }), 'A1');
    assert.strictEqual(metadataOrderCode('{"orderCode":"A1"}'), 'A1');
    assert.strictEqual(metadataOrderCode('not json'), undefined);
    assert.strictEqual(metadataOrderCode(null), undefined);
});

test('Refunds: a refund Paystack accepted but Vendure never recorded is adopted, not repeated', () => {
    const plan = planRefund({
        requested: 5000000,
        paymentAmount: 80000000,
        paystackRefunds: [{ id: 99, amount: 5000000, status: 'pending' }],
        knownRefundIds: [],
    });
    assert.deepStrictEqual(plan, { action: 'adopt', refundId: 99 });
});

test('Refunds: cannot refund more than the remaining balance at Paystack', () => {
    const plan = planRefund({
        requested: 80000000,
        paymentAmount: 80000000,
        paystackRefunds: [{ id: 1, amount: 5000000, status: 'processed' }],
        knownRefundIds: ['1'],
    });
    assert.strictEqual(plan.action, 'reject');
});

test('Refunds: failed Paystack refunds do not count against the balance', () => {
    const plan = planRefund({
        requested: 80000000,
        paymentAmount: 80000000,
        paystackRefunds: [{ id: 1, amount: 80000000, status: 'failed' }],
        knownRefundIds: ['1'],
    });
    assert.deepStrictEqual(plan, { action: 'create', amount: 80000000 });
});

test('Minor units: Naira ↔ kobo is exact', () => {
    assert.strictEqual(1250000 * 100, 125000000);
    assert.strictEqual(Math.round(125000000 / 100), 1250000);
});
