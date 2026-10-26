'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export function HeaderWishlistButton() {
  const { wishlistCount } = useWishlist();

  return (
    <Link
      href="/wishlist"
      className="p-2.5 hover:bg-slate-100 rounded-full transition-colors relative flex items-center justify-center border border-slate-200 cursor-pointer"
      aria-label={`Saved Devices (${wishlistCount})`}
      title="Saved Devices"
    >
      <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111]" />
      {wishlistCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
          {wishlistCount}
        </span>
      )}
    </Link>
  );
}
