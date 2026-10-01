'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

export function CartDrawer() {
    const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalCount } = useCart();

    if (!isCartOpen) return null;

    const formatPrice = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);

    // Build WhatsApp order message for all items in cart
    const itemsSummary = items.map(item => `• ${item.quantity}x ${item.product.name} (${formatPrice(item.product.priceNgn * item.quantity)})`).join('\n');
    const whatsappMessage = `Hello impextech, I want to checkout the following items from my cart:\n\n${itemsSummary}\n\nTotal: ${formatPrice(totalPrice)}\n\nPlease provide payment details and delivery timeframe.`;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
                onClick={() => setIsCartOpen(false)}
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
                    
                    {/* Header */}
                    <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-red-600" />
                            <h2 className="text-base font-black text-[#111111] tracking-tight">
                                Your Cart ({totalCount})
                            </h2>
                        </div>
                        <button 
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-black transition-colors"
                            aria-label="Close cart"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                                    <ShoppingBag className="w-8 h-8" />
                                </div>
                                <h3 className="font-extrabold text-base text-[#111111] mb-1">Your cart is empty</h3>
                                <p className="text-xs text-slate-500 max-w-xs mb-6">
                                    Explore our verified Canada-imported gadgets with tested batteries and 7-day guarantee.
                                </p>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="bg-[#2B2E35] hover:bg-[#1E2127] text-white text-xs font-bold px-6 py-3 rounded-full transition-colors shadow-sm"
                                >
                                    Browse Canada Stock
                                </button>
                            </div>
                        ) : (
                            items.map(({ product, quantity }) => (
                                <div key={product.id} className="py-4 flex gap-4 items-center">
                                    {/* Thumbnail */}
                                    <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 p-2 flex-shrink-0 flex items-center justify-center">
                                        <img 
                                            src={product.preview} 
                                            alt={product.name} 
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-[#111111] line-clamp-1">
                                            {product.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                                            <span className="bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-700">
                                                {product.condition}
                                            </span>
                                            <span className="text-emerald-700 font-semibold">
                                                🔋 {product.batteryHealth}% Batt
                                            </span>
                                        </div>
                                        <div className="text-sm font-black text-[#111111] mt-1.5">
                                            {formatPrice(product.priceNgn * quantity)}
                                        </div>

                                        {/* Quantity and Delete */}
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border border-slate-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity - 1)}
                                                    className="p-1 hover:bg-slate-100 text-slate-600"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="px-2.5 text-xs font-bold text-[#111111]">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity + 1)}
                                                    className="p-1 hover:bg-slate-100 text-slate-600"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(product.id)}
                                                className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer / Summary */}
                    {items.length > 0 && (
                        <div className="p-5 border-t border-slate-200 bg-slate-50">
                            {/* Perks notice */}
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                                    <Truck className="w-3.5 h-3.5" /> Insured Delivery
                                </span>
                                <span className="flex items-center gap-1 text-slate-600">
                                    <ShieldCheck className="w-3.5 h-3.5 text-red-600" /> 7-Day Guarantee
                                </span>
                            </div>

                            {/* Subtotal */}
                            <div className="flex items-baseline justify-between mb-4">
                                <span className="text-sm font-semibold text-slate-600">Subtotal</span>
                                <span className="text-2xl font-black text-[#111111] tracking-tight">
                                    {formatPrice(totalPrice)}
                                </span>
                            </div>

                            {/* Dual Checkout CTAs */}
                            <div className="flex flex-col gap-2.5">
                                <Link
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full bg-[#2B2E35] hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <a
                                    href={`https://wa.me/2349060329221?text=${encodeURIComponent(whatsappMessage)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                                    <span>Instant WhatsApp Order</span>
                                </a>
                            </div>

                            <p className="text-[10px] text-slate-400 text-center mt-3">
                                0% VAT (Nigeria Exempt) • Insured Delivery by impextech
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
