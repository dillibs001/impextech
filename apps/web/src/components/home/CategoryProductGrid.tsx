'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BatteryCharging, Star, ShieldCheck, Search, RotateCcw, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { CatalogProduct } from '@/lib/catalog';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

export function CategoryProductGrid({ 
    initialProducts, 
    initialCategory, 
    searchQuery 
}: { 
    initialProducts: CatalogProduct[];
    initialCategory?: string;
    searchQuery?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Prioritize URL searchParams over initial props
    const currentCategoryParam = searchParams?.get('category') ?? initialCategory ?? '';
    const currentQueryParam = searchParams?.get('q') ?? searchQuery ?? '';

    const categories = [
        { id: 'All', label: 'All Canada Drops' },
        { id: 'Phones', label: 'Phones' },
        { id: 'Laptops', label: 'Laptops' },
        { id: 'Headphones', label: 'Audio' },
        { id: 'Smartwatches', label: 'Smartwatches' },
        { id: 'Cameras', label: 'Cameras' },
        { id: 'Accessories', label: 'Accessories' },
    ];

    const getMatchedCategory = (catParam: string): string => {
        if (!catParam) return 'All';
        const lower = catParam.toLowerCase();
        // Support common aliases
        if (lower === 'laptop' || lower === 'laptops' || lower === 'macbook' || lower === 'macbooks') return 'Laptops';
        if (lower === 'phone' || lower === 'phones' || lower === 'iphone' || lower === 'iphones') return 'Phones';
        if (lower === 'audio' || lower === 'headphone' || lower === 'headphones' || lower === 'airpods') return 'Headphones';
        if (lower === 'watch' || lower === 'watches' || lower === 'smartwatch' || lower === 'smartwatches') return 'Smartwatches';
        if (lower === 'camera' || lower === 'cameras') return 'Cameras';
        if (lower === 'accessory' || lower === 'accessories') return 'Accessories';
        
        const matched = categories.find(c => c.id.toLowerCase() === lower);
        return matched?.id || 'All';
    };

    const [activeTab, setActiveTab] = useState<string>(() => getMatchedCategory(currentCategoryParam));

    // Keep activeTab in sync with URL changes
    useEffect(() => {
        if (currentCategoryParam) {
            setActiveTab(getMatchedCategory(currentCategoryParam));
        } else if (currentQueryParam) {
            // When user enters a search query without explicit category, show all categories
            setActiveTab('All');
        } else {
            setActiveTab('All');
        }
    }, [currentCategoryParam, currentQueryParam]);

    const handleTabChange = (categoryId: string) => {
        setActiveTab(categoryId);
        if (categoryId === 'All') {
            router.push('/products');
        } else {
            router.push(`/products?category=${categoryId.toLowerCase()}`);
        }
    };

    // Filter products by Category
    let filtered = activeTab === 'All' 
        ? initialProducts 
        : initialProducts.filter(p => p.category.toLowerCase() === activeTab.toLowerCase());
        
    // Filter additionally by Search Query
    if (currentQueryParam && currentQueryParam.trim() !== '') {
        const rawTerms = currentQueryParam.toLowerCase().trim().split(/\s+/);
        filtered = filtered.filter(p => {
            const searchableText = `${p.name} ${p.category} ${p.description} ${p.condition} ${p.imeiStatus}`.toLowerCase();
            return rawTerms.every(term => {
                const singular = term.endsWith('s') && term.length > 3 ? term.slice(0, -1) : term;
                return searchableText.includes(term) || searchableText.includes(singular);
            });
        });
    }

    const formatPrice = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);

    return (
        <div>
            {/* Active Search Notification Banner */}
            {currentQueryParam && (
                <div className="mb-6 p-4 bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-sm text-slate-700">
                        <Search className="w-4 h-4 text-red-600" />
                        <span>
                            Showing results for <strong className="text-slate-900">&quot;{currentQueryParam}&quot;</strong> ({filtered.length} found)
                        </span>
                    </div>
                    <Link
                        href="/products"
                        className="text-xs font-bold text-red-600 hover:text-red-700 underline flex items-center gap-1 cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Clear search
                    </Link>
                </div>
            )}

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
                            onClick={() => handleTabChange(cat.id)}
                            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                                isActive 
                                    ? 'bg-[#2B2E35] text-white shadow-sm ring-1 ring-[#3E4452]' 
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

            {/* Empty State */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No Canada drops found</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        {currentQueryParam 
                            ? `We couldn't find any devices matching "${currentQueryParam}" in ${activeTab}.`
                            : `There are currently no items in the ${activeTab} category.`}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => handleTabChange('All')}
                            className="bg-[#2B2E35] hover:bg-[#1E2127] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
                        >
                            Show All 20 In-Stock Gadgets
                        </button>
                        <Link
                            href="/request"
                            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center justify-center gap-1"
                        >
                            Request Custom Device <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            ) : (
                /* Back Market Exact Card Grid Layout */
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
                                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#2B2E35] text-white">
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
                                    <div className="flex items-center gap-1.5 mt-3.5">
                                        <Link
                                            href={`/products/${item.slug}`}
                                            className="flex-1 bg-[#2B2E35] hover:bg-[#1E2127] text-white text-xs font-bold py-2 px-2.5 rounded-xl text-center transition-colors shadow-2xs"
                                        >
                                            View
                                        </Link>
                                        <AddToCartButton product={item} variant="compact" />
                                        <a
                                            href={`https://wa.me/2349060329221?text=${encodeURIComponent(`Hello impextech, I want to purchase the Canada-imported ${item.name} (${formatPrice(item.priceNgn)}). Is it still available?`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl transition-colors shadow-2xs flex-shrink-0 flex items-center justify-center"
                                            aria-label="Order via WhatsApp"
                                            title="Order via WhatsApp"
                                        >
                                            <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
