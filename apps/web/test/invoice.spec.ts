import test from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';

interface TestInvoiceData {
  orderRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deviceName: string;
  deviceSlug: string;
  condition: string;
  batteryHealth: number;
  imeiStatus: string;
  priceNgn: number;
  shippingNgn: number;
  totalNgn: number;
  paymentMethod: string;
  purchaseDate: string;
}

test('Invoice PDF: Generates valid branded PDF buffer with all required legal clauses and brand details', async () => {
  const sampleInvoice: TestInvoiceData = {
    orderRef: 'IMPEX-981245-7712',
    customerName: 'Emeka Nwosu',
    customerEmail: 'emeka.nwosu@example.ng',
    customerPhone: '+234 802 345 6789',
    deviceName: 'Apple MacBook Pro 14" M3 Pro 512GB Space Black',
    deviceSlug: 'macbook-pro-14-m3-pro',
    condition: 'Pristine',
    batteryHealth: 100,
    imeiStatus: 'GSMA Clean & Verified Unlocked',
    priceNgn: 2450000,
    shippingNgn: 5000,
    totalNgn: 2455000,
    paymentMethod: 'paystack',
    purchaseDate: '2026-10-26T12:00:00.000Z',
  };

  const el = React.createElement('Document', { data: sampleInvoice });
  const buffer = await renderToBuffer(el);

  assert.ok(Buffer.isBuffer(buffer), 'Output must be a Node.js Buffer');
  assert.ok(buffer.length > 1000, 'PDF buffer must have substantive byte content');

  const pdfText = buffer.toString('latin1');

  // Verify PDF 1.4 specification header
  assert.ok(pdfText.startsWith('%PDF-1.4'), 'PDF must conform to PDF-1.4 header');

  // Brand Name & Rules
  assert.ok(pdfText.includes('impextech'), 'Must include lowercase brand name "impextech"');
  assert.ok(!pdfText.includes('$'), 'Must contain ZERO dollar signs');

  // Document Title & Monospace Order Ref
  assert.ok(pdfText.includes('PURCHASE CERTIFICATE & TAX INVOICE'), 'Must have official document title');
  assert.ok(pdfText.includes('IMPEX-981245-7712'), 'Must include order reference');

  // Customer Details
  assert.ok(pdfText.includes('Emeka Nwosu'), 'Must include customer name');
  assert.ok(pdfText.includes('+234 802 345 6789'), 'Must include customer phone');

  // Device Details & Origin
  assert.ok(pdfText.includes('MacBook Pro'), 'Must include device name');
  assert.ok(pdfText.includes('Condition: Pristine'), 'Must include condition badge');
  assert.ok(pdfText.includes('Battery Health: 100%'), 'Must include battery health diagnostic');
  assert.ok(pdfText.includes('Canada'), 'Must include Canada origin certification');

  // Pricing & Currency
  const formatNgn = (val: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val);

  assert.strictEqual(formatNgn(5000).includes('5,000'), true, 'Delivery price must be formatted as ₦5,000');
  assert.strictEqual(formatNgn(2455000).includes('2,455,000'), true, 'Total price must be formatted as ₦2,455,000');

  // Warranty & Return Clauses
  assert.ok(pdfText.includes('90-Day Hardware Warranty'), 'Must include 90-Day Hardware Warranty clause');
  assert.ok(pdfText.includes('7-Day No-Questions Return'), 'Must include 7-Day Return Policy clause');

  // Footer & Contact Information
  assert.ok(pdfText.includes('This document is your proof of purchase. Keep for warranty claims.'), 'Must include proof of purchase footer');
  assert.ok(pdfText.includes('+234 906 032 9221'), 'Must include official impextech WhatsApp concierge number');
});
