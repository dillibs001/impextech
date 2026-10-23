'use client';

import Link from 'next/link';
import { User, LogOut, Package, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';

export function HeaderAuthButton() {
  const { user, isLoading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="w-20 h-7 bg-slate-100 animate-pulse rounded-full hidden sm:block"></div>
    );
  }

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:text-red-600 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">
            {user.firstName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline">Hi, {user.firstName}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-200/90 shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <span className="text-[11px] font-bold text-slate-900 block truncate">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                {user.email}
              </span>
            </div>

            <Link
              href="/account"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>My Account</span>
            </Link>

            <Link
              href="/orders"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-slate-500" />
              <span>Track Orders</span>
            </Link>

            <Link
              href="/request"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Sourcing Board</span>
            </Link>

            <div className="border-t border-slate-100 mt-1 pt-1">
              <button
                onClick={async () => {
                  setDropdownOpen(false);
                  await logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:text-red-600 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100"
    >
      <User className="w-4 h-4 text-slate-700" />
      <span className="hidden sm:inline">Sign In</span>
    </Link>
  );
}
