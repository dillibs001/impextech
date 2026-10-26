'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BatteryCharging, Star, ShieldCheck, Search, RotateCcw, ArrowRight, SlidersHorizontal, ArrowUpDown, X, Filter } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { CatalogProduct } from '@/lib/catalog';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { CompareToggleButton } from '@/components/product/CompareToggleButton';
import { WishlistToggleButton } from '@/components/product/WishlistToggleButton';

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
    const [priceFilter, setPriceFilter] = useState<'all' | 'under400k' | '400k-800k' | '800k-1.5m' | 'above1.5m'>('all');
    const [conditionFilter, setConditionFilter] = useState<'all' | 'Pristine' | 'Excellent' | 'Good'>('all');
    const [batteryFilter, setBatteryFilter] = useState<'all' | '90' | '95'>('all');
    const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'battery-desc'>('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Keep activeTab in sync with URL changes
    useEffect(() => {
        if (currentCategoryParam) {
            setActiveTab(getMatchedCategory(currentCategoryParam));
        } else if (currentQueryParam) {
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

    const resetFilters = () => {
        setPriceFilter('all');
        setConditionFilter('all');
        setBatteryFilter('all');
        setSortBy('featured');
    };

    const activeFilterCount = (priceFilter !== 'all' ? 1 : 0) + 
                              (conditionFilter !== 'all' ? 1 : 0) + 
                              (batteryFilter !== 'all' ? 1 : 0) + 
                              (sortBy !== 'featured' ? 1 : 0);

    // 1. Filter products by Category
    let filtered = activeTab === 'All' 
        ? initialProducts 
        : initialProducts.filter(p => p.category.toLowerCase() === activeTab.toLowerCase());
        
    // 2. Filter additionally by Search Query
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

    // 3. Filter by Price Bracket
    if (priceFilter !== 'all') {
        filtered = filtered.filter(p => {
            if (priceFilter === 'under400k') return p.priceNgn < 400000;
            if (priceFilter === '400k-800k') return p.priceNgn >= 400000 && p.priceNgn <= 800000;
            if (priceFilter === '800k-1.5m') return p.priceNgn > 800000 && p.priceNgn <= 1500000;
            if (priceFilter === 'above1.5m') return p.priceNgn > 1500000;
            return true;
        });
    }

    // 4. Filter by Condition Grade
    if (conditionFilter !== 'all') {
        filtered = filtered.filter(p => p.condition === conditionFilter);
    }

    // 5. Filter by Minimum Battery Health
    if (batteryFilter !== 'all') {
        const minHealth = parseInt(batteryFilter, 10);
        filtered = filtered.filter(p => p.batteryHealth >= minHealth);
    }

    // 6. Sort
    if (sortBy === 'price-asc') {
        filtered = [...filtered].sort((a, b) => a.priceNgn - b.priceNgn);
    } else if (sortBy === 'price-desc') {
        filtered = [...filtered].sort((a, b) => b.priceNgn - a.priceNgn);
    } else if (sortBy === 'battery-desc') {
        filtered = [...filtered].sort((a, b) => b.batteryHealth - a.batteryHealth);
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
            <div className="flex items-center justify-between gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
                <div className="flex items-center gap-2 flex-nowrap">
                    {categories.map((cat) => {
                        const count = cat.id === 'All' 
                            ? initialProducts.length 
                            : initialProducts.filter(p => p.category.toLowerCase() === cat.id.toLowerCase()).length;
                        const isActive = activeTab === cat.id;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleTabChange(cat.id)}
                                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
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

                {/* Filter Toggle Button */}
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer flex-shrink-0 ${
                        activeFilterCount > 0 || isFilterOpen
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Collapsible Filter Toolbar */}
            {isFilterOpen && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-8 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Filter className="w-3.5 h-3.5 text-red-600" /> Refine Canada Inventory
                        </span>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={resetFilters}
                                className="text-xs font-semibold text-red-600 hover:text-red-700 underline flex items-center gap-1 cursor-pointer"
                            >
                                <RotateCcw className="w-3 h-3" /> Reset all
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {/* 1. Price Bracket */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Price Bracket (₦)
                            </label>
                            <select
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value as typeof priceFilter)}
                                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-red-500 cursor-pointer text-slate-800"
                            >
                                <option value="all">All Prices</option>
                                <option value="under400k">Under ₦400,000</option>
                                <option value="400k-800k">₦400k – ₦800,000</option>
                                <option value="800k-1.5m">₦800k – ₦1,500,000</option>
                                <option value="above1.5m">Above ₦1,500,000</option>
                            </select>
                        </div>

                        {/* 2. Cosmetic Grade */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Condition Grade
                            </label>
                            <select
                                value={conditionFilter}
                                onChange={(e) => setConditionFilter(e.target.value as typeof conditionFilter)}
                                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-red-500 cursor-pointer text-slate-800"
                            >
                                <option value="all">All Grades</option>
                                <option value="Pristine">Pristine (Flawless)</option>
                                <option value="Excellent">Excellent (Like New)</option>
                                <option value="Good">Good (Light marks)</option>
                            </select>
                        </div>

                        {/* 3. Battery Health */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Battery Health
                            </label>
                            <select
                                value={batteryFilter}
                                onChange={(e) => setBatteryFilter(e.target.value as typeof batteryFilter)}
                                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-red-500 cursor-pointer text-slate-800"
                            >
                                <option value="all">All (Min 85%)</option>
                                <option value="90">90%+ Battery Health</option>
                                <option value="95">95%+ Battery Health</option>
                            </select>
                        </div>

                        {/* 4. Sort By */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-red-500 cursor-pointer text-slate-800"
                            >
                                <option value="featured">Featured Drops</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="battery-desc">Battery Health: Highest First</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-2 text-right">
                        <span className="text-xs text-slate-500 font-medium">
                            Showing <strong>{filtered.length}</strong> matching Canada gadgets
                        </span>
                    </div>
                </div>
            )}

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
                                    <div className="relative my-2">
                                        <Link 
                                            href={`/products/${item.slug}`} 
                                            className="aspect-square w-full bg-white flex items-center justify-center p-4 group-hover:scale-105 transition-transform duration-300 cursor-pointer block"
                                        >
                                            <img 
                                                src={item.preview} 
                                                alt={item.name} 
                                                className="h-full w-full object-contain max-h-[190px]"
                                                loading="lazy"
                                            />
                                        </Link>
                                        <div className="absolute top-1.5 right-1.5 z-10">
                                            <WishlistToggleButton product={item} size="sm" />
                                        </div>
                                    </div>

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

                                    {/* Compare Toggle */}
                                    <div className="mt-2 pt-2 border-t border-slate-100">
                                        <CompareToggleButton product={item} className="w-full" />
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
