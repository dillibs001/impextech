'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { CatalogProduct } from '@/lib/catalog';
import { useWishlist } from '@/context/WishlistContext';

interface WishlistToggleButtonProps {
  product: CatalogProduct;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  toastPosition?: 'top' | 'bottom';
}

export function WishlistToggleButton({
  product,
  className = '',
  size = 'md',
  toastPosition = 'bottom',
}: WishlistToggleButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isScaling, setIsScaling] = useState(false);

  const inWishlist = isInWishlist(product.id);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsScaling(true);
    setTimeout(() => setIsScaling(false), 200);

    if (inWishlist) {
      removeFromWishlist(product.id);
      setToastMessage('Removed from wishlist');
    } else {
      addToWishlist(product);
      setToastMessage('Added to wishlist ♥');
    }
  };

  const sizeClasses = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8 rounded-full',
    md: 'w-8 h-8 sm:w-9 sm:h-9 rounded-full',
    lg: 'h-[52px] sm:h-[54px] w-[52px] sm:w-[54px] rounded-xl',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
    md: 'w-4 h-4 sm:w-4.5 sm:h-4.5',
    lg: 'w-5 h-5 sm:w-6 sm:h-6',
  }[size];

  return (
    <div className="relative inline-flex items-center justify-center">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        className={`relative z-10 flex items-center justify-center border border-slate-200/90 bg-white/95 hover:bg-white shadow-xs transition-transform duration-200 cursor-pointer active:scale-90 ${sizeClasses} ${
          isScaling ? 'scale-125' : 'scale-100'
        } ${className}`}
      >
        <Heart
          className={`transition-colors duration-200 ${iconSizes} ${
            inWishlist
              ? 'fill-red-600 text-red-600'
              : 'text-slate-400 hover:text-red-500'
          }`}
        />
      </button>

      {/* Brief toast-style notification */}
      {toastMessage && (
        <div
          role="status"
          className={`absolute pointer-events-none z-50 whitespace-nowrap bg-[#1E2127] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-lg transition-opacity duration-300 ${
            toastPosition === 'top'
              ? 'bottom-full mb-2 right-0'
              : 'top-full mt-2 right-0'
          }`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
