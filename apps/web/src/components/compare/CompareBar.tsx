'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X, BarChart2 } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isVisible = mounted && compareList.length >= 2;

  return (
    <aside
      aria-label="Gadget Comparison Bar"
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-16 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-[#1E2127] text-white border border-[#363B47] shadow-2xl rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 flex items-center gap-3 sm:gap-5 max-w-[95vw] sm:max-w-2xl backdrop-blur-md">
        
        {/* Left: Indicator & Thumbnails */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white/90">
            <BarChart2 className="w-4 h-4 text-red-500 fill-current" />
            <span>Compare ({compareList.length}/3)</span>
          </div>

          {/* Product Thumbnails (40px square) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {compareList.map((product) => (
              <div
                key={product.id}
                className="relative group w-10 h-10 rounded-lg bg-white p-1 border border-white/20 flex-shrink-0 flex items-center justify-center overflow-visible"
                title={product.name}
              >
                <img
                  src={product.preview}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => removeFromCompare(product.id)}
                  title={`Remove ${product.name}`}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#2B2E35] border border-white/30 text-white hover:bg-red-600 flex items-center justify-center text-[10px] opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                >
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                </button>
              </div>
            ))}

            {/* Empty slot indicator if < 3 */}
            {compareList.length === 2 && (
              <div className="w-10 h-10 rounded-lg border border-dashed border-white/25 flex items-center justify-center text-[10px] font-bold text-white/40 flex-shrink-0 select-none">
                +1
              </div>
            )}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="w-px h-8 bg-white/15 flex-shrink-0" />

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs font-medium text-white/70 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer select-none"
          >
            Clear
          </button>

          <Link
            href="/compare"
            className="bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </Link>
        </div>

      </div>
    </aside>
  );
}
