import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { InvoiceData } from '@/types/invoice';

const formatNgn = (val: number): string =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(val);

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1E2127',
  },
  header: {
    backgroundColor: '#1E2127',
    padding: 16,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderLeftWidth: 6,
    borderLeftColor: '#DC2626',
  },
  brandName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  brandTagline: {
    fontSize: 8,
    color: '#94A3B8',
    marginTop: 4,
  },
  docTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  orderRef: {
    fontSize: 9,
    fontFamily: 'Courier',
    color: '#E2E8F0',
    marginTop: 4,
    textAlign: 'right',
  },
  docDate: {
    fontSize: 8,
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'right',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  panel: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 12,
  },
  panelTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  panelValueBold: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    marginBottom: 3,
  },
  panelValue: {
    fontSize: 8.5,
    color: '#334155',
    marginBottom: 2,
  },
  deviceBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  deviceHeader: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deviceHeaderTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#334155',
  },
  deviceBody: {
    padding: 12,
  },
  deviceName: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  badgePristine: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  badgePristineText: {
    color: '#15803D',
    fontSize: 7.8,
    fontFamily: 'Helvetica-Bold',
  },
  badgeExcellent: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#93C5FD',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeExcellentText: {
    color: '#1D4ED8',
    fontSize: 7.8,
    fontFamily: 'Helvetica-Bold',
  },
  badgeGood: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeGoodText: {
    color: '#B45309',
    fontSize: 7.8,
    fontFamily: 'Helvetica-Bold',
  },
  badgeNeutral: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeNeutralText: {
    color: '#334155',
    fontSize: 7.8,
    fontFamily: 'Helvetica-Bold',
  },
  originNote: {
    fontSize: 8,
    color: '#475569',
    marginTop: 2,
    lineHeight: 1.3,
  },
  table: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#1E2127',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeaderCol: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  tableRowTotal: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  tableCellDesc: {
    flex: 3,
    fontSize: 8.5,
    color: '#0F172A',
  },
  tableCellOrigin: {
    flex: 1.5,
    fontSize: 8,
    color: '#64748B',
  },
  tableCellQty: {
    flex: 0.8,
    fontSize: 8.5,
    color: '#0F172A',
    textAlign: 'center',
  },
  tableCellPrice: {
    flex: 1.5,
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    textAlign: 'right',
  },
  tableCellTotalLabel: {
    flex: 5.3,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    textAlign: 'right',
    paddingRight: 12,
  },
  tableCellTotalPrice: {
    flex: 1.5,
    fontSize: 11.5,
    fontFamily: 'Helvetica-Bold',
    color: '#DC2626',
    textAlign: 'right',
  },
  warrantyBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  warrantyHeader: {
    backgroundColor: '#2B2E35',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  warrantyHeaderTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  warrantyBody: {
    padding: 10,
  },
  clauseTitle: {
    fontSize: 8.8,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    marginBottom: 2,
    marginTop: 4,
  },
  clauseText: {
    fontSize: 7.8,
    color: '#475569',
    lineHeight: 1.35,
    marginBottom: 6,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 3,
  },
  footerContact: {
    fontSize: 8,
    color: '#64748B',
    textAlign: 'center',
  },
});

export function InvoiceDocument({ data }: { data: InvoiceData }) {
  let formattedDate = 'Recent';
  try {
    formattedDate = new Date(data.purchaseDate || Date.now()).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    formattedDate = 'Recent';
  }

  const conditionLower = data.condition?.toLowerCase() || '';
  const isPristine = conditionLower.includes('pristine');
  const isGood = conditionLower.includes('good');
  const conditionBadgeStyle = isPristine
    ? styles.badgePristine
    : isGood
    ? styles.badgeGood
    : styles.badgeExcellent;
  const conditionTextStyle = isPristine
    ? styles.badgePristineText
    : isGood
    ? styles.badgeGoodText
    : styles.badgeExcellentText;
  const conditionLabel = isPristine
    ? 'Condition: Pristine (10/10 Like-New)'
    : isGood
    ? 'Condition: Good (Tested Working)'
    : 'Condition: Excellent (9/10)';

  const paymentLabel =
    data.paymentMethod === 'whatsapp'
      ? 'WhatsApp Direct Order'
      : 'Paystack Verified Online';

  return (
    <Document data={data} title={`impextech-invoice-${data.orderRef}`}>
      <Page size="A4" style={styles.page}>
        {/* Brand Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>impextech</Text>
            <Text style={styles.brandTagline}>
              Canada-Sourced Pre-Owned Gadgets • Authentic & Guaranteed
            </Text>
          </View>
          <View>
            <Text style={styles.docTitle}>Purchase Certificate & Tax Invoice</Text>
            <Text style={styles.orderRef}>Ref: {data.orderRef}</Text>
            <Text style={styles.docDate}>Date: {formattedDate}</Text>
          </View>
        </View>

        {/* Customer & Order Details */}
        <View style={styles.grid}>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Customer Details</Text>
            <Text style={styles.panelValueBold}>{data.customerName}</Text>
            <Text style={styles.panelValue}>Phone: {data.customerPhone}</Text>
            <Text style={styles.panelValue}>Email: {data.customerEmail}</Text>
          </View>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Order & Payment Details</Text>
            <Text style={styles.panelValue}>Payment: {paymentLabel}</Text>
            <Text style={styles.panelValue}>Status: Payment Confirmed / Recorded</Text>
            <Text style={styles.panelValue}>Dispatch: Insured Nationwide Delivery</Text>
          </View>
        </View>

        {/* Certified Device Details */}
        <View style={styles.deviceBox}>
          <View style={styles.deviceHeader}>
            <Text style={styles.deviceHeaderTitle}>
              CERTIFIED DEVICE SPECIFICATIONS & VERIFICATION
            </Text>
          </View>
          <View style={styles.deviceBody}>
            <Text style={styles.deviceName}>{data.deviceName}</Text>
            <View style={styles.badgeRow}>
              <View style={conditionBadgeStyle}>
                <Text style={conditionTextStyle}>{conditionLabel}</Text>
              </View>
              <View style={styles.badgeNeutral}>
                <Text style={styles.badgeNeutralText}>
                  Battery Health: {data.batteryHealth}% Diagnostic Passed
                </Text>
              </View>
              <View style={styles.badgeNeutral}>
                <Text style={styles.badgeNeutralText}>
                  IMEI: {data.imeiStatus}
                </Text>
              </View>
            </View>
            <Text style={styles.originNote}>
              • Sourced from Canada: Imported directly from Canadian enterprise surplus and certified carrier fleets.
            </Text>
            <Text style={styles.originNote}>
              • Diagnostic Verification: Complete 32-point hardware, screen, thermal, and network tests passed prior to dispatch.
            </Text>
          </View>
        </View>

        {/* Pricing Breakdown Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCol, { flex: 3 }]}>Item Description</Text>
            <Text style={[styles.tableHeaderCol, { flex: 1.5 }]}>Origin</Text>
            <Text style={[styles.tableHeaderCol, { flex: 0.8, textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.tableHeaderCol, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDesc}>{data.deviceName}</Text>
            <Text style={styles.tableCellOrigin}>Canada Certified</Text>
            <Text style={styles.tableCellQty}>1</Text>
            <Text style={styles.tableCellPrice}>{formatNgn(data.priceNgn)}</Text>
          </View>

          <View style={styles.tableRowAlt}>
            <Text style={styles.tableCellDesc}>
              Insured Nationwide Delivery (Tracked Express Courier)
            </Text>
            <Text style={styles.tableCellOrigin}>Nigeria Tracked</Text>
            <Text style={styles.tableCellQty}>1</Text>
            <Text style={styles.tableCellPrice}>{formatNgn(data.shippingNgn)}</Text>
          </View>

          <View style={styles.tableRowTotal}>
            <Text style={styles.tableCellTotalLabel}>Total Paid (NGN):</Text>
            <Text style={styles.tableCellTotalPrice}>{formatNgn(data.totalNgn)}</Text>
          </View>
        </View>

        {/* Warranty & Return Policy Clauses */}
        <View style={styles.warrantyBox}>
          <View style={styles.warrantyHeader}>
            <Text style={styles.warrantyHeaderTitle}>
              OFFICIAL WARRANTY COVERAGE & RETURN POLICY
            </Text>
          </View>
          <View style={styles.warrantyBody}>
            <Text style={styles.clauseTitle}>• 90-Day Hardware Warranty</Text>
            <Text style={styles.clauseText}>
              impextech covers this device against internal hardware failures, logic board malfunctions, display hardware defects, and battery anomalies for 90 calendar days from the purchase date. Any defect will be repaired or replaced free of charge.
            </Text>
            <Text style={styles.clauseTitle}>• 7-Day No-Questions Return Policy</Text>
            <Text style={styles.clauseText}>
              If your gadget has any undisclosed hardware issue or fails to meet your expectations upon delivery, impextech guarantees an immediate unit replacement or 100% full refund within 7 days. Zero restocking fees.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This document is your proof of purchase. Keep for warranty claims.
          </Text>
          <Text style={styles.footerContact}>
            impextech Concierge & Warranty Support: WhatsApp +234 906 032 9221 | www.impextech.ng
          </Text>
        </View>
      </Page>
    </Document>
  );
}
