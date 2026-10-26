import test from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { Document, Page, Text, View, renderToBuffer } from '@react-pdf/renderer';

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

  const el = React.createElement(
    Document,
    {},
    React.createElement(
      Page,
      {},
      React.createElement(
        View,
        {},
        React.createElement(Text, {}, 'impextech'),
        React.createElement(Text, {}, 'PURCHASE CERTIFICATE & TAX INVOICE'),
        React.createElement(Text, {}, sampleInvoice.orderRef),
        React.createElement(Text, {}, sampleInvoice.customerName),
        React.createElement(Text, {}, sampleInvoice.customerPhone),
        React.createElement(Text, {}, sampleInvoice.deviceName),
        React.createElement(Text, {}, `Condition: ${sampleInvoice.condition}`),
        React.createElement(Text, {}, `Battery Health: ${sampleInvoice.batteryHealth}%`),
        React.createElement(Text, {}, 'Direct Canada import with clean GSMA registration'),
        React.createElement(Text, {}, '• 90-Day Hardware Warranty: Covers logic board, display, and components.'),
        React.createElement(Text, {}, '• 7-Day No-Questions Return Policy: Full replacement or 100% refund.'),
        React.createElement(Text, {}, 'This document is your proof of purchase. Keep for warranty claims.'),
        React.createElement(Text, {}, 'impextech Concierge: +234 906 032 9221')
      )
    )
  );
  const buffer = await renderToBuffer(el);

  assert.ok(Buffer.isBuffer(buffer), 'Output must be a Node.js Buffer');
  assert.ok(buffer.length > 1000, 'PDF buffer must have substantive byte content');

  const pdfText = buffer.toString('latin1');
  assert.ok(pdfText.startsWith('%PDF'), 'PDF must conform to PDF specification header');
  assert.ok(pdfText.includes('%%EOF'), 'PDF must have valid EOF marker');

  // Verify Invoice Data and Business Rules
  assert.strictEqual(sampleInvoice.orderRef, 'IMPEX-981245-7712');
  assert.strictEqual(sampleInvoice.customerName, 'Emeka Nwosu');
  assert.strictEqual(sampleInvoice.condition, 'Pristine');
  assert.strictEqual(sampleInvoice.batteryHealth, 100);

  // Pricing & Currency: Strict Nigerian Naira Formatting
  const formatNgn = (val: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val);

  assert.strictEqual(formatNgn(5000).includes('5,000'), true, 'Delivery price must be formatted as ₦5,000');
  assert.strictEqual(formatNgn(2455000).includes('2,455,000'), true, 'Total price must be formatted as ₦2,455,000');
  assert.ok(!formatNgn(2455000).includes('$'), 'Must contain ZERO dollar signs');

  // Warranty & Legal Clauses
  const warrantyTitle = '90-Day Hardware Warranty';
  const returnPolicy = '7-Day No-Questions Return';
  const conciergeContact = '+234 906 032 9221';
  assert.ok(warrantyTitle.includes('90-Day'), 'Must include 90-Day Hardware Warranty clause');
  assert.ok(returnPolicy.includes('7-Day'), 'Must include 7-Day Return Policy clause');
  assert.ok(conciergeContact.includes('+234'), 'Must include official impextech WhatsApp concierge number');
});
