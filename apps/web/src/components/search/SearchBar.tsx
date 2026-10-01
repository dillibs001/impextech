'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center w-full">
      <div className="w-full bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phones, MacBooks, headphones, cameras, watches..."
            className="bg-transparent border-none outline-none w-full text-slate-700 placeholder:text-slate-500"
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
            className="p-1 hover:bg-slate-200 rounded-full text-slate-500 flex-shrink-0"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}
