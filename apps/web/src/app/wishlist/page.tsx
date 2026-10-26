'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  BatteryCharging, 
  Star, 
  ShieldCheck, 
  Package, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { CatalogProduct } from '@/lib/catalog';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val);

  const handleMoveToCart = (product: CatalogProduct) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
    clearWishlist();
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 sm:py-12">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-red-600 transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Saved Devices</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-2xs">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-red-600 text-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
                  Saved Devices
                </h1>
                {mounted && wishlistCount > 0 && (
                  <span className="bg-red-100 text-red-700 text-xs font-black px-2.5 py-0.5 rounded-full">
                    {wishlistCount} {wishlistCount === 1 ? 'device' : 'devices'}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Canada-imported gadgets you have bookmarked for quick inspection and checkout.
              </p>
            </div>
          </div>

          {/* Action buttons at top right */}
          {mounted && wishlistCount > 0 && (
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Move All to Cart</span>
              </button>
              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        {!mounted ? (
          /* Initial loading skeleton to prevent flash during localStorage hydration */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 h-[440px] animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between mb-4">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-12"></div>
                  </div>
                  <div className="aspect-square bg-slate-100 rounded-xl my-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="h-6 bg-slate-200 rounded w-1/2 mb-3"></div>
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          /* Illustrated Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center max-w-lg mx-auto my-8 sm:my-16 shadow-xs">
            <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-5 text-red-600 shadow-inner">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
              No saved devices yet
            </h2>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
              Tap the ♥ heart on any device to save it for later. Your bookmarked Canada drops will stay saved right here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/request"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold py-3.5 px-5 rounded-xl transition-colors"
              >
                <span>Request Custom Device</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlist.map((item) => {
              const savings = item.retailNgn - item.priceNgn;
              const discountPercent = Math.round((savings / item.retailNgn) * 100);

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden relative p-4"
                >
                  {/* Card Top: Badges & Remove Icon */}
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
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                          Canada
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                          aria-label={`Remove ${item.name} from wishlist`}
                          title="Remove from saved devices"
                        >
                          <Heart className="w-4 h-4 fill-red-600 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* 1:1 Product Image Container */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="aspect-square w-full bg-white flex items-center justify-center p-4 my-2 relative group-hover:scale-105 transition-transform duration-300 cursor-pointer block"
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

                  {/* Card Bottom: Price, Savings & Move to Cart */}
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

                    {savings > 0 && (
                      <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                        Save {formatPrice(savings)} vs retail
                      </div>
                    )}

                    <div className="text-[10px] text-slate-500 mt-1">
                      Free delivery • 7-day guarantee
                    </div>

                    {/* Actions: Move to Cart, Remove Heart Button, WhatsApp */}
                    <div className="flex items-center gap-1.5 mt-3.5">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors cursor-pointer flex-shrink-0 flex items-center justify-center"
                        aria-label="Remove from saved devices"
                        title="Remove from saved devices"
                      >
                        <Heart className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                      </button>

                      <a
                        href={`https://wa.me/2349060329221?text=${encodeURIComponent(
                          `Hello impextech, I want to purchase the Canada-imported ${item.name} (${formatPrice(item.priceNgn)}). Is it still available?`
                        )}`}
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
    </div>
  );
}
