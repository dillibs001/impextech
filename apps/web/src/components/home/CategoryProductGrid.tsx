'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BatteryCharging, Star, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { CatalogProduct } from '@/lib/catalog';

export function CategoryProductGrid({ initialProducts }: { initialProducts: CatalogProduct[] }) {
    const [activeTab, setActiveTab] = useState<string>('All');

    const categories = [
        { id: 'All', label: 'All Canada Drops' },
        { id: 'Phones', label: 'Phones' },
        { id: 'Laptops', label: 'Laptops' },
        { id: 'Headphones', label: 'Audio' },
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
            {/* Filter Tabs Bar (Back Market Pill Strip) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
                {categories.map((cat) => {
                    const count = cat.id === 'All' 
                        ? initialProducts.length 
                        : initialProducts.filter(p => p.category.toLowerCase() === cat.id.toLowerCase()).length;
                    const isActive = activeTab === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                                isActive 
                                    ? 'bg-[#111111] text-white shadow-sm' 
                                    : 'bg-white text-slate-700 hover:text-black hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            <span>{cat.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                isActive ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Back Market Exact Card Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((item) => {
                    const savings = item.retailNgn - item.priceNgn;
                    const discountPercent = Math.round((savings / item.retailNgn) * 100);

                    return (
                        <div 
                            key={item.id} 
                            className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden relative p-4"
                        >
                            {/* Card Top: Badges & Wishlist */}
                            <div>
                                <div className="flex items-center justify-between gap-1 mb-2">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#111111] text-white">
                                            {item.condition}
                                        </span>
                                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                                            <BatteryCharging className="w-3 h-3 text-emerald-600" /> {item.batteryHealth}%
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                                        Canada
                                    </span>
                                </div>

                                {/* 1:1 Clean Image Container (Back Market Style) */}
                                <Link 
                                    href={`/products/${item.slug}`} 
                                    className="aspect-square w-full bg-white flex items-center justify-center p-4 my-2 relative group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                >
                                    <img 
                                        src={item.preview} 
                                        alt={item.name} 
                                        className="h-full w-full object-contain max-h-[190px]"
                                        loading="lazy"
                                    />
                                </Link>

                                {/* Rating & Category */}
                                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                                    <span className="font-semibold text-slate-400 uppercase tracking-wider">{item.category}</span>
                                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>4.9</span>
                                        <span className="text-slate-400 font-normal">({item.id}4)</span>
                                    </div>
                                </div>

                                {/* Product Title */}
                                <Link href={`/products/${item.slug}`}>
                                    <h3 className="font-bold text-[#111111] text-sm leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                                        {item.name}
                                    </h3>
                                </Link>

                                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                    <span>{item.imeiStatus} • Unlocked</span>
                                </p>
                            </div>

                            {/* Card Bottom: Back Market Price Block & Actions */}
                            <div className="mt-4 pt-3 border-t border-slate-100">
                                <div className="flex items-baseline justify-between gap-1">
                                    <div className="text-lg font-black text-[#111111] tracking-tight">
                                        {formatPrice(item.priceNgn)}
                                    </div>
                                    {savings > 0 && (
                                        <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                            -{discountPercent}%
                                        </span>
                                    )}
                                </div>

                                <div className="text-[11px] text-slate-400 line-through mt-0.5">
                                    {formatPrice(item.retailNgn)} new
                                </div>

                                <div className="text-[10px] text-slate-500 mt-1">
                                    Free delivery • 7-day guarantee
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mt-3.5">
                                    <Link
                                        href={`/products/${item.slug}`}
                                        className="flex-1 bg-[#111111] hover:bg-red-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl text-center transition-colors shadow-2xs"
                                    >
                                        View Deal
                                    </Link>
                                    <a
                                        href={`https://wa.me/2349060329221?text=${encodeURIComponent(`Hello impextech, I want to purchase the Canada-imported ${item.name} (${formatPrice(item.priceNgn)}). Is it still available?`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl transition-colors shadow-2xs flex-shrink-0"
                                        aria-label="Order via WhatsApp"
                                    >
                                        <WhatsAppIcon className="w-4 h-4 fill-current" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
