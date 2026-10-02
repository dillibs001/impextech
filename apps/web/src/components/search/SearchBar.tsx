'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, ArrowRight, BatteryCharging } from 'lucide-react';
import { CATALOG_PRODUCTS, CatalogProduct } from '@/lib/catalog';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  // Find matching products
  const matchingProducts: CatalogProduct[] = query.trim()
    ? CATALOG_PRODUCTS.filter((p) => {
        const text = `${p.name} ${p.category} ${p.description} ${p.condition}`.toLowerCase();
        const rawTerms = query.toLowerCase().trim().split(/\s+/);
        return rawTerms.every((term) => {
          const singular = term.endsWith('s') && term.length > 3 ? term.slice(0, -1) : term;
          return text.includes(term) || text.includes(singular);
        });
      }).slice(0, 5)
    : [];

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative flex items-center w-full">
        <div className="w-full bg-slate-100 hover:bg-slate-200/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                if (query.trim()) setIsOpen(true);
              }}
              placeholder="Search phones, MacBooks, headphones, cameras, watches..."
              className="bg-transparent border-none outline-none w-full text-slate-800 placeholder:text-slate-500 font-medium"
            />
          </div>
          {!query ? (
            <span className="text-[11px] font-bold text-red-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs whitespace-nowrap">
              20 In Stock
            </span>
          ) : (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-slate-200 rounded-full text-slate-500 flex-shrink-0 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Live Search Suggestions Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {matchingProducts.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Matching Gadgets ({matchingProducts.length})
              </div>
              {matchingProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={p.preview}
                        alt={p.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 truncate transition-colors">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-400 uppercase">{p.category}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                          <BatteryCharging className="w-2.5 h-2.5" /> {p.batteryHealth}%
                        </span>
                        <span>•</span>
                        <span>{p.condition}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span className="text-xs font-black text-slate-900 block">
                      {formatPrice(p.priceNgn)}
                    </span>
                  </div>
                </Link>
              ))}

              <button
                onClick={handleSearch}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-red-600 flex items-center justify-center gap-1.5 border-t border-slate-100 transition-colors cursor-pointer"
              >
                <span>View all results for &quot;{query}&quot;</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-xs text-slate-500">
                No gadgets found matching &quot;{query}&quot;.
              </p>
              <button
                onClick={handleSearch}
                className="mt-2 text-xs font-bold text-red-600 hover:underline cursor-pointer"
              >
                Search all inventory
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
