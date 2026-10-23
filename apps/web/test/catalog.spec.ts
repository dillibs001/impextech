import test from 'node:test';
import assert from 'node:assert';

test('Storefront Currency Formatting: Strict Nigerian Naira (₦)', () => {
    const formatPrice = (val: number) =>
        new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0,
        }).format(val);

    const price1 = 1250000;
    const formatted1 = formatPrice(price1);
    
    // Must contain Naira symbol (₦ or NGN) and Nigerian thousands separator
    assert.match(formatted1, /₦|NGN/, 'Price must be formatted in Nigerian Naira');
    assert.doesNotMatch(formatted1, /\$/, 'Price must never contain USD dollar sign ($)');
    assert.strictEqual(formatted1.includes('1,250,000'), true, 'Price must have comma separators (1,250,000)');

    const price2 = 5000;
    const formatted2 = formatPrice(price2);
    assert.strictEqual(formatted2.includes('5,000'), true, 'Delivery price must be ₦5,000');
});

test('Category Auto-Detection Logic', () => {
    function detectCategory(name: string): 'Phones' | 'Laptops' | 'Headphones' | 'Smartwatches' | 'Cameras' | 'Accessories' {
        const lower = name.toLowerCase();
        if (lower.includes('iphone') || lower.includes('galaxy') || lower.includes('pixel') || lower.includes('phone')) return 'Phones';
        if (lower.includes('macbook') || lower.includes('xps') || lower.includes('laptop')) return 'Laptops';
        if (lower.includes('airpod') || lower.includes('wh-1000') || lower.includes('headphone') || lower.includes('sound')) return 'Headphones';
        if (lower.includes('watch')) return 'Smartwatches';
        if (lower.includes('alpha') || lower.includes('eos') || lower.includes('camera') || lower.includes('lens')) return 'Cameras';
        return 'Accessories';
    }

    assert.strictEqual(detectCategory('Apple iPhone 15 Pro Max 256GB'), 'Phones');
    assert.strictEqual(detectCategory('Samsung Galaxy S24 Ultra 512GB'), 'Phones');
    assert.strictEqual(detectCategory('Apple MacBook Pro 14" M3 Pro'), 'Laptops');
    assert.strictEqual(detectCategory('Dell XPS 15 9530 Core i7'), 'Laptops');
    assert.strictEqual(detectCategory('Sony WH-1000XM5 Noise-Canceling'), 'Headphones');
    assert.strictEqual(detectCategory('Apple Watch Ultra 2 GPS + Cellular'), 'Smartwatches');
    assert.strictEqual(detectCategory('Sony Alpha A7 IV Mirrorless Camera'), 'Cameras');
    assert.strictEqual(detectCategory('Anker 65W GaN Fast Charger'), 'Accessories');
});

test('Checkout Order Math: Subtotal, Shipping, and Commitment Deposit Credit', () => {
    const cartItems = [
        { priceNgn: 1250000, quantity: 1 }, // iPhone 15 Pro Max
        { priceNgn: 65000, quantity: 2 },   // 2x Fast Chargers
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + item.priceNgn * item.quantity, 0);
    assert.strictEqual(subtotal, 1380000, 'Subtotal must sum items correctly');

    const shippingFee = 5000;
    const grandTotal = subtotal + shippingFee;
    assert.strictEqual(grandTotal, 1385000, 'Grand total must include ₦5,000 insured shipping');

    // Deposit credit scenario
    const depositAmount = 5000;
    const remainingBalance = grandTotal - depositAmount;
    assert.strictEqual(remainingBalance, 1380000, 'Commitment deposit must deduct exactly ₦5,000 from final balance');
});
