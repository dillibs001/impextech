'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BarChart2, 
  Trash2, 
  BatteryCharging, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { CatalogProduct } from '@/lib/catalog';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
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

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-6xl text-center">
        <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading gadget comparison...</p>
      </div>
    );
  }

  // Empty State: fewer than 2 items in compareList
  if (compareList.length < 2) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-slate-900 transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Compare</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-5 border border-red-100">
            <BarChart2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mb-2">
            Compare Devices
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
            {compareList.length === 1
              ? 'You have selected 1 device. Add at least 1 more gadget to compare specifications, battery health, and prices side-by-side.'
              : 'You haven’t selected any devices to compare yet. Select up to 3 gadgets from our Canada inventory for a side-by-side spec check.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/products"
              className="w-full sm:w-auto bg-[#2B2E35] hover:bg-[#1E2127] text-white text-xs sm:text-sm font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Browse Catalog</span>
            </Link>
            {compareList.length === 1 && (
              <button
                type="button"
                onClick={clearCompare}
                className="w-full sm:w-auto text-xs font-semibold text-slate-500 hover:text-red-600 py-3.5 px-5 transition-colors cursor-pointer"
              >
                Clear current selection
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Calculations for highlighting
  const minPrice = Math.min(...compareList.map((p) => p.priceNgn));
  const maxBattery = Math.max(...compareList.map((p) => p.batteryHealth));

  const getConditionBadge = (condition: CatalogProduct['condition']) => {
    switch (condition) {
      case 'Pristine':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#2B2E35] text-white">
            <Sparkles className="w-3 h-3 text-red-400" /> Pristine
          </span>
        );
      case 'Excellent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <Check className="w-3 h-3 text-blue-600" /> Excellent
          </span>
        );
      case 'Good':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            Good
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-slate-900 transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Compare Devices</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear All
          </button>
          <Link
            href="/products"
            className="text-xs font-bold text-[#111111] hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>
        </div>
      </div>

      {/* Page Header */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full mb-3">
              <BarChart2 className="w-3.5 h-3.5 fill-current text-red-600" /> Side-by-Side Audit
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
              Compare Devices
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Comparing <strong>{compareList.length} of 3</strong> Canada-certified gadgets. Specifications, battery health, and savings verified.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
            💡 Green highlights indicate best value or highest battery health
          </div>
        </div>
      </div>

      {/* Comparison Table Container with Mobile Horizontal Scroll */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px] sm:min-w-[840px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th scope="col" className="p-4 sm:p-5 w-44 sm:w-56 text-xs font-black uppercase tracking-wider text-slate-400">
                  Feature / Spec
                </th>
                {compareList.map((product) => (
                  <th key={product.id} scope="col" className="p-4 sm:p-5 align-top">
                    <div className="flex flex-col items-center text-center">
                      <Link
                        href={`/products/${product.slug}`}
                        className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-2xl p-3 border border-slate-200 flex items-center justify-center mb-3 group hover:border-red-300 transition-colors cursor-pointer"
                      >
                        <img
                          src={product.preview}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </Link>
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-black text-sm sm:text-base text-[#111111] hover:text-red-600 transition-colors line-clamp-2 max-w-[220px]"
                      >
                        {product.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {/* Row 1: impextech Price */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <th scope="row" className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">
                  impextech Price
                </th>
                {compareList.map((product) => {
                  const isCheapest = product.priceNgn === minPrice;
                  return (
                    <td key={product.id} className="p-4 sm:p-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`text-base sm:text-lg font-black tracking-tight ${
                            isCheapest
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl shadow-2xs'
                              : 'text-slate-900'
                          }`}
                        >
                          {formatPrice(product.priceNgn)}
                        </span>
                        {isCheapest && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <Zap className="w-2.5 h-2.5 fill-current" /> Cheapest
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 2: Brand New Retail Price */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <th scope="row" className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">
                  Retail Price (Brand New)
                </th>
                {compareList.map((product) => (
                  <td key={product.id} className="p-4 sm:p-5 text-center text-slate-500 font-semibold line-through">
                    {formatPrice(product.retailNgn)}
                  </td>
                ))}
              </tr>

              {/* Row 3: Total Savings */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <th scope="row" className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">
                  Your Savings
                </th>
                {compareList.map((product) => {
                  const savings = product.retailNgn - product.priceNgn;
                  const discountPct = Math.round((savings / product.retailNgn) * 100);
                  return (
                    <td key={product.id} className="p-4 sm:p-5 text-center">
                      {savings > 0 ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="font-extrabold text-emerald-700 text-sm">
                            Save {formatPrice(savings)}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mt-0.5">
                            -{discountPct}% vs New
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: Condition Grade */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <th scope="row" className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">
                  Cosmetic Condition
                </th>
                {compareList.map((product) => (
                  <td key={product.id} className="p-4 sm:p-5 text-center">
                    {getConditionBadge(product.condition)}
                  </td>
                ))}
              </tr>

              {/* Row 5: Battery Health */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <th scope="row" className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">
                  Battery Health
                </th>
                {compareList.map((product) => {
                  const isHighest = product.batteryHealth === maxBattery;
                  return (
                    <td key={product.id} className="p-4 sm:p-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                            isHighest
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <BatteryCharging className={`w-3.5 h-3.5 ${isHighest ? 'text-emerald-700' : 'text-slate-500'}`} />
                          <span>{product.batteryHealth}%</span>
                        </span>
                        {isHighest && (
                          <span className="text-[10px] font-bold text-emerald-700">
                            Highest Capacity
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 6: IMEI / Serial Status */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <th scope="row" className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">
                  IMEI & Carrier Status
                </th>
                {compareList.map((product) => (
                  <td key={product.id} className="p-4 sm:p-5 text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{product.imeiStatus}</span>
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 7: Category */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <th scope="row" className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">
                  Category
                </th>
                {compareList.map((product) => (
                  <td key={product.id} className="p-4 sm:p-5 text-center font-semibold text-slate-700">
                    {product.category}
                  </td>
                ))}
              </tr>

              {/* Row 8: Description */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <th scope="row" className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">
                  Overview
                </th>
                {compareList.map((product) => {
                  const truncated =
                    product.description.length > 100
                      ? product.description.slice(0, 100).trim() + '...'
                      : product.description;
                  return (
                    <td key={product.id} className="p-4 sm:p-5 text-center text-xs text-slate-600 leading-relaxed max-w-[220px]">
                      {truncated}
                    </td>
                  );
                })}
              </tr>

              {/* Row 9: Add to Cart Action */}
              <tr className="bg-slate-50/60">
                <th scope="row" className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/40">
                  Purchase
                </th>
                {compareList.map((product) => (
                  <td key={product.id} className="p-4 sm:p-5 text-center">
                    <div className="max-w-[200px] mx-auto">
                      <AddToCartButton product={product} variant="compact" className="w-full" />
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>

            {/* Below the Table: Remove Button Row */}
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50/90">
                <th scope="row" className="p-4 sm:p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Manage List
                </th>
                {compareList.map((product) => (
                  <td key={product.id} className="p-4 sm:p-5 text-center">
                    <button
                      type="button"
                      onClick={() => removeFromCompare(product.id)}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors px-3 py-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
