'use client';

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import { saveCustomerOrder, CustomerOrder } from '@/lib/orders';
import {
  syncCartToVendure,
  setCustomerForOrder,
  setOrderShippingAddress,
  setOrderShippingMethod,
  transitionOrderToArrangingPayment,
  addPaymentToOrder,
} from '@/lib/cart';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import {
  ShieldCheck,
  CreditCard,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  BatteryCharging,
  MessageCircle,
  AlertCircle,
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
  const [lastOrderId, setLastOrderId] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof DeliveryForm, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [whatsAppPromptOpen, setWhatsAppPromptOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<CustomerOrder | null>(null);

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
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
    if (!form.email.trim() || !form.email.includes('@')) errors.email = 'Valid email is required';
    if (!form.phone.trim() || form.phone.trim().length < 10) errors.phone = 'Valid phone number is required';
    if (!form.address.trim()) errors.address = 'Delivery address is required';
    if (!form.cityState.trim()) errors.cityState = 'City / State is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createCustomerOrderObject = (method: 'WhatsApp' | 'Paystack', orderId: string): CustomerOrder => ({
    id: orderId,
    date: new Date().toISOString(),
    items: items.map(ci => ({
      id: ci.product.id,
      name: ci.product.name,
      quantity: ci.quantity,
      price: ci.product.priceNgn,
      preview: ci.product.preview,
      condition: ci.product.condition,
      batteryHealth: ci.product.batteryHealth,
    })),
    customer: { ...form },
    subtotal: totalPrice,
    shipping,
    total: grandTotal,
    method,
    status: method === 'Paystack' ? 'Paid' : 'Pending Confirmation',
  });

  const buildOrderSummaryText = (orderId: string) => {
    const itemLines = items.map(
      (ci) => `• ${ci.product.name} (x${ci.quantity}) — ${formatPrice(ci.product.priceNgn * ci.quantity)}`
    );
    return [
      `*New impextech Order*`,
      `Order Ref: ${orderId}`,
      ``,
      `*Customer Details:*`,
      `• Name: ${form.firstName} ${form.lastName}`,
      `• Phone: ${form.phone}`,
      `• Email: ${form.email}`,
      `• Address: ${form.address}, ${form.cityState}`,
      ``,
      `*Ordered Gadgets (${totalCount}):*`,
      ...itemLines,
      ``,
      `*Price Breakdown:*`,
      `• Subtotal: ${formatPrice(totalPrice)}`,
      `• Insured Delivery: ${formatPrice(shipping)}`,
      `• Grand Total: ${formatPrice(grandTotal)}`,
    ].join('\n');
  };

  const handleWhatsAppOrder = () => {
    if (!validate()) return;
    const orderId = `IMPEX-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = createCustomerOrderObject('WhatsApp', orderId);

    // Save order record
    saveCustomerOrder(newOrder);
    setPendingOrder(newOrder);
    setLastOrderId(orderId);

    // Open WhatsApp
    const text = buildOrderSummaryText(orderId);
    window.open(
      `https://wa.me/2349060329221?text=${encodeURIComponent(text)}`,
      '_blank'
    );

    // Show interactive confirmation modal instead of prematurely wiping cart
    setWhatsAppPromptOpen(true);
  };

  const handleConfirmWhatsAppSent = () => {
    if (pendingOrder) {
      saveCustomerOrder({ ...pendingOrder, status: 'Confirmed' });
    }
    clearCart();
    setWhatsAppPromptOpen(false);
    setOrderPlaced(true);
  };

  const handlePaystackOrder = async () => {
    if (!validate()) return;
    
    setIsProcessing(true);
    
    try {
      const orderRes = await syncCartToVendure(
        items.map((ci) => ({ slug: ci.product.slug, quantity: ci.quantity }))
      );
      
      if (!orderRes) {
        throw new Error('Vendure backend server is currently offline or unreachable. Please start the backend with "pnpm dev" or use Instant WhatsApp Order.');
      }

      await setCustomerForOrder({
        firstName: form.firstName,
        lastName: form.lastName,
        emailAddress: form.email,
        phoneNumber: form.phone,
      });

      await setOrderShippingAddress({
        fullName: `${form.firstName} ${form.lastName}`,
        streetLine1: form.address,
        city: form.cityState,
        province: form.cityState,
        countryCode: 'NG',
      });

      await setOrderShippingMethod();
      await transitionOrderToArrangingPayment();

      const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!paystackKey || paystackKey.includes('placeholder') || paystackKey === 'pk_test_your_key_here') {
        alert(
          `Paystack Public Key not configured yet!\n\nSet NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in apps/web/.env.local with your Paystack key to activate live payments.\n\nYour order has been compiled in Vendure (Ref: ${orderRes.orderCode}). We'll now transfer you to WhatsApp to complete your order.`
        );
        handleWhatsAppOrder();
        setIsProcessing(false);
        return;
      }

      const orderRef = `IMPEX-${orderRes.orderCode}-${Date.now().toString().slice(-4)}`;

      if (typeof window !== 'undefined' && window.PaystackPop) {
        const paystack = new window.PaystackPop.setup({
          key: paystackKey,
          email: form.email,
          amount: grandTotal * 100, // minor units (kobo)
          currency: 'NGN',
          ref: orderRef,
          callback: async (response: { reference: string }) => {
            const result = await addPaymentToOrder(response.reference);
            if (result) {
              const completedOrder = createCustomerOrderObject('Paystack', orderRes.orderCode);
              completedOrder.status = 'Paid';
              completedOrder.reference = response.reference;
              saveCustomerOrder(completedOrder);
              setLastOrderId(orderRes.orderCode);
              clearCart();
              setOrderPlaced(true);
            } else {
              alert('Payment processing error on backend. Please contact support on WhatsApp.');
            }
            setIsProcessing(false);
          },
          onClose: () => {
            setIsProcessing(false);
          },
        });

        paystack.openIframe();
      } else {
        throw new Error('Paystack inline SDK failed to load. Please try again or use WhatsApp.');
      }
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const message = err instanceof Error ? err.message : 'An error occurred during checkout. Please try again.';
      alert(message);
      setIsProcessing(false);
    }
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
            <h1 className="text-2xl font-black text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full inline-block mb-4">
              Ref: {lastOrderId}
            </p>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              Your Canada device order has been recorded. Our verification and dispatch team will confirm and arrange delivery within 2 hours during WAT business hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/orders"
                className="bg-[#2B2E35] hover:bg-[#1E2127] text-white text-xs font-bold py-3 px-6 rounded-xl transition-colors"
              >
                View in My Orders
              </Link>
              <a
                href={`https://wa.me/2349060329221?text=${encodeURIComponent(`Hello impextech, following up on confirmed order ${lastOrderId}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" /> Chat With Support
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
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-[#2B2E35] hover:bg-[#1E2127] text-white text-xs font-bold py-3 px-6 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Browse Catalog
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Check Past Orders
              </Link>
            </div>
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
    <>
      <Script src="https://js.paystack.co/v2/inline.js" strategy="lazyOnload" />

      {/* WhatsApp Sent Verification Modal */}
      {whatsAppPromptOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-2">
              WhatsApp Chat Opened!
            </h3>
            <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
              We&apos;ve prepared your order message on WhatsApp. Did you hit <strong>Send</strong> in your WhatsApp chat with impextech?
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleConfirmWhatsAppSent}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> Yes, I&apos;ve Sent It (Confirm Order)
              </button>
              <button
                onClick={() => setWhatsAppPromptOpen(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Keep in Cart / Return to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl flex items-center gap-4 shadow-xl">
            <div className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-bold text-slate-800">
              Synchronizing Order with Vendure...
            </span>
          </div>
        </div>
      )}

      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <Link href="/products" className="text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Secure Checkout</h1>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {totalCount} {totalCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            <Link
              href="/orders"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs"
            >
              My Orders
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Forms */}
            <div className="lg:w-2/3 flex flex-col gap-6">
              {/* Delivery Info */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="bg-[#2B2E35] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
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
                      placeholder="Phone Number (WhatsApp preferred for delivery updates)"
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
                      placeholder="Delivery Street Address"
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
                      placeholder="City & State (e.g. Ikeja, Lagos or Independence Layout, Enugu)"
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

              {/* Payment Method Selection */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="bg-[#2B2E35] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    2
                  </span>
                  Choose Payment & Order Method
                </h2>

                <div className="flex flex-col gap-4">
                  {/* Option A: WhatsApp Direct Order */}
                  <div className="border-2 border-emerald-500/40 rounded-2xl p-5 bg-emerald-50/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <WhatsAppIcon className="w-5 h-5 text-emerald-600 fill-current" />
                        <h3 className="text-sm font-bold text-slate-900">
                          Instant WhatsApp Concierge Order
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      Pre-fills your exact device specs, serial number, and delivery details into a WhatsApp chat. Request a live video inspection of the unit before paying.
                    </p>
                    <button
                      onClick={handleWhatsAppOrder}
                      className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer text-xs sm:text-sm"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-current" />
                      <span>Order on WhatsApp ({formatPrice(grandTotal)})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400 font-medium">or pay online</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  {/* Option B: Paystack Payment Gateway */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-white hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-slate-700" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Pay Online via Paystack
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Instant settlement with Nigerian debit cards, bank transfer, or USSD via Vendure backend.
                    </p>
                    <button
                      onClick={handlePaystackOrder}
                      className="w-full bg-[#2B2E35] hover:bg-[#1E2127] text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer text-xs sm:text-sm"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay {formatPrice(grandTotal)} via Paystack</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
                  Order Summary ({totalCount})
                </h2>

                {/* Cart Items */}
                <div className="flex flex-col gap-4 mb-6 border-b border-slate-100 pb-6 max-h-[380px] overflow-y-auto no-scrollbar">
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
                          <span className="text-[10px] font-bold uppercase bg-[#2B2E35] text-white px-1.5 py-0.2 rounded">
                            {ci.product.condition}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                            <BatteryCharging className="w-2.5 h-2.5" />
                            {ci.product.batteryHealth}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(ci.product.id, ci.quantity - 1)}
                              className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 rounded-l-lg cursor-pointer"
                            >
                              −
                            </button>
                            <span className="px-2 py-0.5 text-xs font-bold text-slate-900 border-x border-slate-200">
                              {ci.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(ci.product.id, ci.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 rounded-r-lg cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">
                              {formatPrice(ci.product.priceNgn * ci.quantity)}
                            </span>
                            <button
                              onClick={() => removeFromCart(ci.product.id)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
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
                    <span>Insured Shipping</span>
                    <span className="font-semibold text-slate-900">
                      {formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-black text-slate-900 mb-6 pt-4 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-red-600">{formatPrice(grandTotal)}</span>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-4 flex items-start gap-3 border border-emerald-100">
                  <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    7-Day Money-Back Guarantee. Clean IMEI and minimum 85% battery health verified before shipment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
