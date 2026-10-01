'use client';

import { ShieldCheck, CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
    // In a fully integrated app, we would fetch the active order from Vendure here.
    
    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Secure Checkout</h1>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:w-2/3 flex flex-col gap-6">
                        {/* Delivery Info */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                Delivery Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="First Name" className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500" />
                                <input type="text" placeholder="Last Name" className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500" />
                                <input type="email" placeholder="Email Address" className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 col-span-1 md:col-span-2" />
                                <input type="text" placeholder="Phone Number (WhatsApp preferred)" className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 col-span-1 md:col-span-2" />
                                <input type="text" placeholder="Delivery Address" className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 col-span-1 md:col-span-2" />
                                <input type="text" placeholder="City / State" className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 col-span-1 md:col-span-2" />
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                Payment
                            </h2>
                            <div className="bg-slate-50 border border-emerald-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                <CreditCard size={48} className="text-emerald-600 mb-4" />
                                <h3 className="font-bold text-slate-900 mb-2">Pay securely via Paystack</h3>
                                <p className="text-sm text-slate-500 mb-6">Supports all Nigerian Bank Cards, Transfers, and USSD.</p>
                                <button className="w-full md:w-auto px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                                    <Lock size={18} /> Pay ₦0.00
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
                            
                            <div className="flex flex-col gap-4 mb-6 border-b border-slate-100 pb-6">
                                {/* Empty Cart State for now */}
                                <div className="text-slate-500 text-sm italic">Your cart is empty.</div>
                            </div>

                            <div className="flex flex-col gap-3 text-sm text-slate-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-slate-900">₦0.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-slate-900">Calculated at next step</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-lg font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100">
                                <span>Total</span>
                                <span className="text-emerald-600">₦0.00</span>
                            </div>

                            <div className="bg-emerald-50 rounded-xl p-4 flex items-start gap-3">
                                <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                                <p className="text-xs text-emerald-800">
                                    Your money is securely held. We process all orders natively through Paystack with full fraud protection.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
