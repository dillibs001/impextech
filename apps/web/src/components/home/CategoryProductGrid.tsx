'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, BatteryCharging, ArrowRight, Zap, Check } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

export interface CatalogProduct {
    id: string;
    slug: string;
    name: string;
    category: 'Phones' | 'Laptops' | 'Headphones' | 'Smartwatches' | 'Cameras' | 'Accessories';
    condition: 'Pristine' | 'Excellent' | 'Good';
    batteryHealth: number;
    priceNgn: number;
    retailNgn: number;
    preview: string;
    description: string;
    imeiStatus: string;
}

export function CategoryProductGrid({ initialProducts }: { initialProducts: CatalogProduct[] }) {
    const [activeTab, setActiveTab] = useState<string>('All');

    const categories = [
        { id: 'All', label: 'All Gadgets' },
        { id: 'Phones', label: 'Phones' },
        { id: 'Laptops', label: 'Laptops' },
        { id: 'Headphones', label: 'Headphones' },
        { id: 'Smartwatches', label: 'Smartwatches' },
        { id: 'Cameras', label: 'Cameras' },
        { id: 'Accessories', label: 'Accessories' },
    ];

    const filtered = activeTab === 'All' 
        ? initialProducts 
        : initialProducts.filter(p => p.category.toLowerCase() === activeTab.toLowerCase());

    const formatPrice = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);

    return (
        <div>
            {/* Filter Tabs (Swappie / Back Market style) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
                {categories.map((cat) => {
                    const count = cat.id === 'All' 
                        ? initialProducts.length 
                        : initialProducts.filter(p => p.category.toLowerCase() === cat.id.toLowerCase()).length;
                    const isActive = activeTab === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                                isActive 
                                    ? 'bg-slate-900 text-white shadow-md' 
                                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            <span>{cat.label}</span>
                            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                                isActive ? 'bg-red-600 text-white font-bold' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((item) => {
                    const savings = item.retailNgn - item.priceNgn;
                    
                    return (
                        <div 
                            key={item.id} 
                            className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden relative"
                        >
                            {/* Card Top: Badges & Battery Tag */}
                            <div className="p-4 pb-0 flex items-center justify-between gap-2 z-10">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-900 text-white">
                                        {item.condition}
                                    </span>
                                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <BatteryCharging className="w-3 h-3 text-emerald-600" /> {item.batteryHealth}% Batt
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                                    Canada Certified
                                </span>
                            </div>

                            {/* Product Image Area */}
                            <Link href={`/products/${item.slug}`} className="p-6 flex items-center justify-center min-h-[220px] bg-white group-hover:scale-105 transition-transform duration-300">
                                <img 
                                    src={item.preview} 
                                    alt={item.name} 
                                    className="max-h-[190px] w-full object-contain"
                                    loading="lazy"
                                />
                            </Link>

                            {/* Product Info */}
                            <div className="p-5 pt-0 flex-1 flex flex-col justify-between border-t border-slate-100 bg-slate-50/50">
                                <div className="mt-3">
                                    <span className="text-xs text-slate-400 font-medium">{item.category}</span>
                                    <Link href={`/products/${item.slug}`}>
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 mt-0.5 group-hover:text-red-600 transition-colors">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    
                                    {/* IMEI / Technical trust stamp */}
                                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1.5">
                                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                        <span>{item.imeiStatus} • 7-day guarantee</span>
                                    </p>
                                </div>

                                {/* Pricing Section (Back Market / Swappie Style) */}
                                <div className="mt-4 pt-3 border-t border-slate-200/60">
                                    <div className="flex items-baseline justify-between gap-1">
                                        <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                                            {formatPrice(item.priceNgn)}
                                        </div>
                                        {savings > 0 && (
                                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                                                Save {formatPrice(savings)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-400 line-through mt-0.5">
                                        New: {formatPrice(item.retailNgn)}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 mt-4">
                                        <Link
                                            href={`/products/${item.slug}`}
                                            className="flex-1 bg-slate-900 hover:bg-red-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl text-center transition-colors shadow-sm"
                                        >
                                            View Details
                                        </Link>
                                        <a
                                            href={`https://wa.me/2349060329221?text=${encodeURIComponent(`Hello impextech, I'm interested in the Canada-imported ${item.name} (${formatPrice(item.priceNgn)}). Is this unit available?`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl transition-colors shadow-sm"
                                            aria-label="Order via WhatsApp"
                                        >
                                            <WhatsAppIcon className="w-4 h-4 fill-current" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
