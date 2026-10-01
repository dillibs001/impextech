'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function HeaderCartButton() {
    const { totalCount, setIsCartOpen } = useCart();

    return (
        <button
            onClick={() => setIsCartOpen(true)}
            className="p-2.5 hover:bg-slate-100 rounded-full transition-colors relative flex items-center justify-center border border-slate-200 cursor-pointer"
            aria-label="Open Cart"
        >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111]" />
            {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                    {totalCount}
                </span>
            )}
        </button>
    );
}
