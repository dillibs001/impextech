'use client';

import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CatalogProduct } from '@/lib/catalog';

interface AddToCartButtonProps {
    product: CatalogProduct;
    className?: string;
    variant?: 'full' | 'compact' | 'icon';
}

export function AddToCartButton({ product, className = '', variant = 'full' }: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleAdd}
                className={`p-2.5 rounded-xl border border-slate-200 transition-colors flex items-center justify-center cursor-pointer ${
                    isAdded ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-slate-100 text-slate-800'
                } ${className}`}
                aria-label={`Add ${product.name} to cart`}
                title="Add to cart"
            >
                {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
        );
    }

    if (variant === 'compact') {
        return (
            <button
                onClick={handleAdd}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                    isAdded ? 'bg-emerald-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                } ${className}`}
            >
                {isAdded ? (
                    <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                    </>
                ) : (
                    <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add</span>
                    </>
                )}
            </button>
        );
    }

    // Default 'full' variant for PDP
    return (
        <button
            onClick={handleAdd}
            className={`w-full bg-[#2B2E35] hover:bg-red-600 text-white font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-sm cursor-pointer ${
                isAdded ? 'bg-emerald-600 hover:bg-emerald-600' : ''
            } ${className}`}
        >
            {isAdded ? (
                <>
                    <Check className="w-5 h-5 text-white" />
                    <span>Added to Cart!</span>
                </>
            ) : (
                <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                </>
            )}
        </button>
    );
}
