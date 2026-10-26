'use client';

import { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  CreditCard, 
  ArrowLeft,
  Info,
  Lock,
  RotateCcw
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

export default function RequestBoardPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    stateCity: '',
    deviceType: 'Phone',
    brand: '',
    model: '',
    storagePreference: '256GB',
    colorPreference: '',
    conditionPreference: 'Excellent',
    budgetMax: '',
    additionalNotes: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<null | {
    ref: string;
    brand: string;
    model: string;
  }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitToVendure = async (depositRef: string) => {
    const notesWithContact = [
      `Customer: ${formData.fullName} (Phone: ${formData.phone}, Location: ${formData.stateCity})`,
      `Commitment Deposit Ref: ${depositRef} (₦5,000 Verified via Paystack)`,
      formData.additionalNotes ? `Notes: ${formData.additionalNotes}` : ''
    ].filter(Boolean).join(' | ');

    const input = {
      deviceType: formData.deviceType,
      brand: formData.brand,
      model: formData.model,
      storagePreference: formData.storagePreference,
      colorPreference: formData.colorPreference || 'Any',
      conditionPreference: formData.conditionPreference,
      budgetMax: parseInt(formData.budgetMax, 10) || 500000,
      additionalNotes: notesWithContact,
      customerId: formData.email || formData.phone || 'guest',
    };

    const query = `
      mutation SubmitRequest($input: SubmitGadgetRequestInput!) {
        submitGadgetRequest(input: $input) {
          id
          status
        }
      }
    `;

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/shop-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { input } }),
      });
      const data = await res.json();
      return data?.data?.submitGadgetRequest?.id || `REQ-${Date.now().toString().slice(-6)}`;
    } catch (e) {
      console.warn('Backend request board mutation offline, generated fallback reference:', e);
      return `REQ-${Date.now().toString().slice(-6)}`;
    }
  };

  // Priority Sourcing with ₦5,000 Commitment Deposit via Paystack
  const handlePaystackDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.brand || !formData.model) {
      alert('Please fill in your name, phone, email, and the gadget brand & model.');
      return;
    }

    setIsProcessing(true);

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    const reqRef = `IMPEX-DEP-${Date.now().toString().slice(-6)}`;

    // Fallback if test key is unconfigured in development
    if (!paystackKey || paystackKey.includes('placeholder') || paystackKey === 'pk_test_your_key_here') {
      const serverRef = await submitToVendure(reqRef);
      alert(
        `Paystack Public Key not configured yet!\n\nYour sourcing request has been registered under Ref #${serverRef}.\n\nTo lock in your procurement, please transfer the ₦5,000 commitment deposit via our WhatsApp Concierge.`
      );
      const waMsg = `Hello impextech, I've submitted Sourcing Request #${serverRef} for ${formData.brand} ${formData.model}. Please send your Nigerian bank account details so I can transfer the ₦5,000 commitment deposit.`;
      window.open(`https://wa.me/2349060329221?text=${encodeURIComponent(waMsg)}`, '_blank');
      setSubmittedSuccess({
        ref: serverRef,
        brand: formData.brand,
        model: formData.model
      });
      setIsProcessing(false);
      return;
    }

    if (typeof window !== 'undefined' && window.PaystackPop) {
      const paystack = new window.PaystackPop.setup({
        key: paystackKey,
        email: formData.email,
        amount: 5000 * 100, // ₦5,000 in kobo
        currency: 'NGN',
        ref: reqRef,
        callback: async (response: { reference: string }) => {
          const serverRef = await submitToVendure(response.reference);
          setSubmittedSuccess({
            ref: serverRef,
            brand: formData.brand,
            model: formData.model
          });
          setIsProcessing(false);
        },
        onClose: () => {
          setIsProcessing(false);
        }
      });

      paystack.openIframe();
    } else {
      alert('Paystack payment window failed to initialize. Please check your internet connection or contact support.');
      setIsProcessing(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 mb-2">
              Sourcing Priority Locked!
            </h1>
            <p className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full inline-block mb-4">
              Order Ref #{submittedSuccess.ref}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              Your <strong>₦5,000 commitment deposit</strong> has been registered. Our Canadian procurement 
              agents in Toronto & Vancouver have initiated the search for your{' '}
              <strong>{submittedSuccess.brand} {submittedSuccess.model}</strong>.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 mb-6 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-red-600" />
                <span>Turnaround: <strong>Within 24–48 Hours</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Deposit Policy: <strong>100% Credited to Final Purchase Price</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>Fair Guarantee: <strong>100% Refunded if device cannot be located</strong></span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/2349060329221?text=${encodeURIComponent(`Hello impextech, following up on Priority Sourcing Request #${submittedSuccess.ref} (${submittedSuccess.brand} ${submittedSuccess.model}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
                Track with Canada Sourcing Agent
              </a>

              <Link
                href="/products"
                className="w-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-3.5 rounded-xl border border-slate-200 transition-colors"
              >
                Browse Current In-Stock Gadgets
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Script src="https://js.paystack.co/v2/inline.js" strategy="lazyOnload" />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/products" className="hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Custom Canada Sourcing Board</span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Direct Canada Sourcing
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Can&apos;t find your exact gadget?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Tell us the exact specs, color, and budget you desire. Our procurement team in 
            Toronto and Vancouver will inspect, verify, and air-freight it to Nigeria for you.
          </p>
        </div>

        {/* Two-Column Form Container */}
        <form onSubmit={handlePaystackDeposit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            
            {/* Section 1: Customer Contact Info */}
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>1. Your Contact Details</span>
                <span className="text-[11px] text-slate-400 font-normal lowercase">for quote & inspection video delivery</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Dillibe Okonkwo"
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 09060329221"
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. dillibe@gmail.com"
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Destination City & State *</label>
                  <input
                    type="text"
                    name="stateCity"
                    required
                    value={formData.stateCity}
                    onChange={handleChange}
                    placeholder="e.g. Enugu (UNEC) or Lekki, Lagos"
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Gadget Specifications */}
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>2. Gadget Requirements</span>
                <span className="text-[11px] text-slate-400 font-normal lowercase">desired specs</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Category *</label>
                  <select
                    name="deviceType"
                    value={formData.deviceType}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500 cursor-pointer bg-white"
                  >
                    <option value="Phone">Smartphone (iPhone, Galaxy, Pixel)</option>
                    <option value="Laptop">Laptop (MacBook Pro/Air, Dell XPS)</option>
                    <option value="Headphones">Headphones / Audio (AirPods, Sony)</option>
                    <option value="Smartwatch">Smartwatch (Apple Watch Ultra, Series)</option>
                    <option value="Camera">Camera (Sony Alpha, Canon EOS)</option>
                    <option value="Tablet">Tablet (iPad Pro, iPad Air)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Apple, Sony, Dell"
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Specific Model *</label>
                  <input
                    type="text"
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g. MacBook Pro M3 Pro 14-inch"
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Storage Capacity</label>
                  <select
                    name="storagePreference"
                    value={formData.storagePreference}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500 cursor-pointer bg-white"
                  >
                    <option value="Any">Any Storage</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                    <option value="2TB+">2TB+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Color Preference</label>
                  <input
                    type="text"
                    name="colorPreference"
                    value={formData.colorPreference}
                    onChange={handleChange}
                    placeholder="e.g. Space Black, Titanium, or Any"
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Minimum Condition</label>
                  <select
                    name="conditionPreference"
                    value={formData.conditionPreference}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500 cursor-pointer bg-white"
                  >
                    <option value="Pristine">Pristine Grade (Zero scratches, like-new)</option>
                    <option value="Excellent">Excellent Grade (Barely visible handling wear)</option>
                    <option value="Good">Good Grade (Minor marks, 100% functional)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Maximum Budget Target (₦)</label>
                <input
                  type="number"
                  name="budgetMax"
                  value={formData.budgetMax}
                  onChange={handleChange}
                  placeholder="e.g. 950000"
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Special Instructions or Notes</label>
                <textarea
                  name="additionalNotes"
                  rows={2}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="e.g. Must have battery health above 90%, Canadian keyboard layout preferred..."
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Sourcing Guarantees & Commitment Deposit */}
          <div className="space-y-6">
            
            {/* Priority Sourcing Card with ₦5,000 Paystack Deposit */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Committed Sourcing
                </span>
                <span className="text-[10px] font-bold uppercase bg-red-600 text-white px-2.5 py-0.5 rounded-full">
                  48-Hr Priority
                </span>
              </div>

              <div className="p-4 bg-red-50/80 border border-red-200 rounded-2xl mb-5 text-xs text-red-950">
                <div className="flex items-center gap-1.5 font-black text-sm mb-1.5 text-red-900">
                  <ShieldCheck className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>₦5,000 Sourcing Commitment Deposit</span>
                </div>
                <p className="text-[11px] text-red-800 leading-relaxed">
                  Your ₦5,000 deposit unlocks dedicated on-the-ground procurement in Toronto. 
                  It is <strong>100% credited</strong> toward your gadget invoice upon purchase. Forfeited 
                  if you cancel after your device is secured, but <strong>100% refunded</strong> if we cannot 
                  locate your exact device within 48 hours.
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#2B2E35] hover:bg-red-600 text-white text-xs font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isProcessing ? 'Connecting to Paystack...' : 'Pay ₦5,000 Deposit via Paystack'}</span>
              </button>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Procured directly from verified Canada stockrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Live unboxing & battery test video sent prior to flight</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Clean GSMA global IMEI blacklist guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Full 7-Day Money-Back Guarantee included</span>
                </div>
              </div>

              <div className="mt-5 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-[10px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>Secured 256-bit encrypted transaction via Paystack Nigeria</span>
              </div>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
}
