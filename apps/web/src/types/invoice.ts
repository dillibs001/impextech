export interface InvoiceData {
  orderRef: string;          // e.g. "IMPEX-1234567-abc"
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deviceName: string;
  deviceSlug: string;
  condition: string;          // 'Pristine' | 'Excellent' | 'Good'
  batteryHealth: number;
  imeiStatus: string;
  priceNgn: number;           // in major Naira units
  shippingNgn: number;        // flat 5000
  totalNgn: number;
  paymentMethod: string;      // 'paystack' | 'whatsapp'
  purchaseDate: string;       // ISO date string
}
