'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  BatteryCharging,
} from 'lucide-react';

interface DeliveryForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  cityState: string;
}

const initialForm: DeliveryForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  cityState: '',
};

export default function CheckoutPage() {
  const { items, totalPrice, totalCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const [form, setForm] = useState<DeliveryForm>(initialForm);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof DeliveryForm, string>>>({});

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val);

  const shipping = totalPrice > 0 ? 5000 : 0;
  const grandTotal = totalPrice + shipping;

  const handleChange = (field: keyof DeliveryForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof DeliveryForm, string>> = {};
    if (!form.firstName.trim()) errors.firstName = 'Required';
    if (!form.lastName.trim()) errors.lastName = 'Required';
    if (!form.email.trim() || !form.email.includes('@')) errors.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.trim().length < 10) errors.phone = 'Valid phone required';
    if (!form.address.trim()) errors.address = 'Required';
    if (!form.cityState.trim()) errors.cityState = 'Required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildOrderSummaryText = () => {
    const itemLines = items.map(
      (ci) => `• ${ci.product.name} x${ci.quantity} — ${formatPrice(ci.product.priceNgn * ci.quantity)}`
    );
    return [
      `🛒 *New impextech Order*`,
      ``,
      `*Customer:* ${form.firstName} ${form.lastName}`,
      `*Phone:* ${form.phone}`,
      `*Email:* ${form.email}`,
      `*Address:* ${form.address}, ${form.cityState}`,
      ``,
      `*Items (${totalCount}):*`,
      ...itemLines,
      ``,
      `*Subtotal:* ${formatPrice(totalPrice)}`,
      `*Shipping:* ${formatPrice(shipping)}`,
      `*Total:* ${formatPrice(grandTotal)}`,
    ].join('\n');
  };

  const handleWhatsAppOrder = () => {
    if (!validate()) return;
    const text = buildOrderSummaryText();
    window.open(
      `https://wa.me/2349060329221?text=${encodeURIComponent(text)}`,
      '_blank'
    );
    setOrderPlaced(true);
    clearCart();
  };

  const handlePaystackOrder = () => {
    if (!validate()) return;
    // Paystack integration placeholder — in production this would:
    // 1. Create a Vendure order via addItemToOrder mutations
    // 2. Set customer details via setCustomerForOrder
    // 3. Initialize Paystack inline popup with the order total
    // 4. On success, call addPaymentToOrder with the Paystack reference
    // For now, show a confirmation and submit via WhatsApp as fallback
    alert(
      `Paystack integration coming soon!\n\nFor now, your order of ${formatPrice(grandTotal)} will be processed via WhatsApp.`
    );
    handleWhatsAppOrder();
  };

  // Order confirmation screen
  if (orderPlaced) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-3">Order Submitted!</h1>
            <p className="text-slate-600 text-sm mb-8">
              Your order has been sent to our team via WhatsApp. We&apos;ll confirm
              availability and arrange delivery within 2 hours during business
              hours (9 AM – 7 PM WAT).
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="bg-[#2B2E35] hover:bg-[#1E2127] text-white text-sm font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Continue Shopping
              </Link>
              <a
                href="https://wa.me/2349060329221"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" /> Chat With Us
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
            <p className="text-slate-500 text-sm mb-6">
              Add some Canada-imported gadgets to get started.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#2B2E35] hover:bg-[#1E2127] text-white text-sm font-bold py-3 px-6 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = (field: keyof DeliveryForm) =>
    `w-full border rounded-xl p-3 outline-none transition-colors text-sm ${
      formErrors[field]
        ? 'border-red-400 bg-red-50 focus:border-red-500'
        : 'border-slate-200 focus:border-[#2B2E35]'
    }`;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Secure Checkout</h1>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {totalCount} {totalCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Forms */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            {/* Delivery Info */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="bg-[#2B2E35] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                Delivery Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={inputClass('firstName')}
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={inputClass('lastName')}
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={inputClass('email')}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <input
                    type="tel"
                    placeholder="Phone Number (WhatsApp preferred)"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={inputClass('phone')}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Delivery Address"
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className={inputClass('address')}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="City / State"
                    value={form.cityState}
                    onChange={(e) => handleChange('cityState', e.target.value)}
                    className={inputClass('cityState')}
                  />
                  {formErrors.cityState && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.cityState}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="bg-[#2B2E35] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                Payment
              </h2>

              <div className="flex flex-col gap-3">
                {/* Paystack Button */}
                <button
                  onClick={handlePaystackOrder}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Pay {formatPrice(grandTotal)} via Paystack</span>
                </button>
                <p className="text-xs text-slate-400 text-center">
                  Supports all Nigerian Bank Cards, Transfers, and USSD
                </p>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* WhatsApp Order Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                  <span>Instant WhatsApp Order</span>
                </button>
                <p className="text-xs text-slate-400 text-center">
                  Send your order directly — pay on delivery or via transfer
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Order Summary ({totalCount})
              </h2>

              {/* Cart Items */}
              <div className="flex flex-col gap-4 mb-6 border-b border-slate-100 pb-6 max-h-[400px] overflow-y-auto">
                {items.map((ci) => (
                  <div key={ci.product.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center p-1 border border-slate-100">
                      <img
                        src={ci.product.preview}
                        alt={ci.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                        {ci.product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold uppercase bg-[#2B2E35] text-white px-1.5 py-0.5 rounded">
                          {ci.product.condition}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                          <BatteryCharging className="w-2.5 h-2.5" />
                          {ci.product.batteryHealth}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center border border-slate-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(ci.product.id, ci.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 rounded-l-lg"
                          >
                            −
                          </button>
                          <span className="px-2 py-0.5 text-xs font-bold text-slate-900 border-x border-slate-200">
                            {ci.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(ci.product.id, ci.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {formatPrice(ci.product.priceNgn * ci.quantity)}
                          </span>
                          <button
                            onClick={() => removeFromCart(ci.product.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="flex flex-col gap-2.5 text-sm text-slate-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-black text-slate-900 mb-6 pt-4 border-t border-slate-100">
                <span>Total</span>
                <span className="text-emerald-600">{formatPrice(grandTotal)}</span>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-emerald-800">
                  Your money is securely held. All orders are verified with a 7-day money-back guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
