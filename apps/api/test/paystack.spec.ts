import test from 'node:test';
import assert from 'node:assert';
import * as crypto from 'crypto';

test('Paystack Security: HMAC SHA-512 Webhook Signature Validation', () => {
    const mockSecret = 'sk_live_secret_key_12345';
    const payload = JSON.stringify({
        event: 'charge.success',
        data: {
            reference: 'IMPEX-10023-9941',
            amount: 125000000, // ₦1,250,000 in Kobo
            status: 'success'
        }
    });

    // Valid signature computation
    const validSignature = crypto.createHmac('sha512', mockSecret)
        .update(payload)
        .digest('hex');

    // Simulate verification check
    const checkSignature = (incomingSignature: string, secret: string, bodyString: string) => {
        const hash = crypto.createHmac('sha512', secret).update(bodyString).digest('hex');
        return hash === incomingSignature;
    };

    assert.strictEqual(
        checkSignature(validSignature, mockSecret, payload),
        true,
        'Valid signature must be verified as true'
    );

    assert.strictEqual(
        checkSignature('tampered_signature_xyz', mockSecret, payload),
        false,
        'Tampered signature must be rejected'
    );

    assert.strictEqual(
        checkSignature(validSignature, 'wrong_secret_key', payload),
        false,
        'Signature verified with wrong secret must be rejected'
    );
});

test('Paystack Minor Unit Math (Kobo Rule)', () => {
    const priceNgn = 1250000; // ₦1,250,000 Naira
    const expectedKobo = 125000000; // 125M Kobo

    // Major to minor units
    const calculatedKobo = priceNgn * 100;
    assert.strictEqual(calculatedKobo, expectedKobo, 'Naira to Kobo conversion must multiply by exactly 100');

    // Minor to major units (Vendure rawPrice)
    const convertedNaira = Math.round(calculatedKobo / 100);
    assert.strictEqual(convertedNaira, priceNgn, 'Kobo to Naira must divide by exactly 100');
});

test('Paystack Security: Anti-Tampering Exact Amount Matching', () => {
    const orderTotalWithTaxKobo = 80000000; // ₦800,000

    const verifyTransaction = (data: { status: string; amount: number }, requiredAmount: number) => {
        if (data.status === 'success' && data.amount === requiredAmount) {
            return { state: 'Settled' };
        } else if (data.status === 'failed' || data.status === 'abandoned') {
            return { state: 'Declined' };
        }
        return { state: 'Declined', reason: 'Amount mismatch or payment unverified' };
    };

    // Case 1: Exact match
    const legitResult = verifyTransaction({ status: 'success', amount: 80000000 }, orderTotalWithTaxKobo);
    assert.strictEqual(legitResult.state, 'Settled', 'Legitimate payment with matching amount must be Settled');

    // Case 2: Tampered amount (e.g. malicious user paid ₦100 instead of ₦800,000)
    const tamperedResult = verifyTransaction({ status: 'success', amount: 10000 }, orderTotalWithTaxKobo);
    assert.strictEqual(tamperedResult.state, 'Declined', 'Tampered amount payment must be Declined');

    // Case 3: Failed transaction
    const failedResult = verifyTransaction({ status: 'failed', amount: 80000000 }, orderTotalWithTaxKobo);
    assert.strictEqual(failedResult.state, 'Declined', 'Failed transaction must be Declined');
});
