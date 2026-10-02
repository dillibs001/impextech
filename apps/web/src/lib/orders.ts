'use client';

export interface CustomerOrder {
  id: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    preview: string;
    condition: string;
    batteryHealth: number;
  }>;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    cityState: string;
  };
  subtotal: number;
  shipping: number;
  total: number;
  method: 'WhatsApp' | 'Paystack';
  status: 'Pending Confirmation' | 'Confirmed' | 'Paid' | 'Dispatched';
  reference?: string;
}

const STORAGE_KEY = 'impextech_customer_orders';

export function getCustomerOrders(): CustomerOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to load orders from localStorage:', e);
    return [];
  }
}

export function saveCustomerOrder(order: CustomerOrder): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCustomerOrders();
    // Prepend new order so newest appears first
    const updated = [order, ...current.filter(o => o.id !== order.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save order to localStorage:', e);
  }
}
