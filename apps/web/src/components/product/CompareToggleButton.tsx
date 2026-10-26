'use client';

import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { CatalogProduct } from '@/lib/catalog';

interface CompareToggleButtonProps {
  product: CatalogProduct;
  className?: string;
}

export function CompareToggleButton({ product, className = '' }: CompareToggleButtonProps) {
  const { isInCompare, addToCompare, removeFromCompare, canAddMore } = useCompare();
  const inCompare = isInCompare(product.id);
  const isFullAndNotInList = !inCompare && !canAddMore;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      removeFromCompare(product.id);
    } else if (canAddMore) {
      addToCompare(product);
    }
  };

  if (isFullAndNotInList) {
    return (
      <button
        type="button"
        disabled
        title="Max 3 items"
        className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg sm:rounded-xl border border-slate-200 bg-slate-100/90 text-slate-400 cursor-not-allowed opacity-75 transition-all select-none ${className}`}
      >
        <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
        <span>Compare</span>
      </button>
    );
  }

  if (inCompare) {
    return (
      <button
        type="button"
        onClick={handleClick}
        title="Remove from comparison"
        className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg sm:rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer shadow-2xs ${className}`}
      >
        <BarChart2 className="w-3.5 h-3.5 fill-current text-red-600" />
        <span>Comparing</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Add to compare list"
      className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg sm:rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[#111111] hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs ${className}`}
    >
      <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
      <span>Compare</span>
    </button>
  );
}
