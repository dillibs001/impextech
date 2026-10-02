import { Suspense } from 'react';
import { CategoryProductGrid } from '@/components/home/CategoryProductGrid';
import { CATALOG_PRODUCTS } from '@/lib/catalog';
import { ShieldCheck, BatteryCharging, RotateCcw, Award } from 'lucide-react';

export default async function ProductsPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ category?: string; q?: string }> 
}) {
    const params = await searchParams;
    const category = params.category;
    const q = params.q;

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Header */}
            <div className="mb-8 border-b border-slate-200 pb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full mb-3">
                            <Award className="w-3.5 h-3.5" /> Canada Certified Inventory
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Verified Gadget Catalog</h1>
                        <p className="text-slate-600 text-sm mt-1 max-w-xl">
                            All units are imported directly from Canada, rigorously bench-tested across 50+ points, and backed by a 7-day money-back guarantee.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-1 font-semibold text-slate-900">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Clean IMEI
                        </div>
                        <div className="w-px h-4 bg-slate-200" />
                        <div className="flex items-center gap-1 font-semibold text-slate-900">
                            <BatteryCharging className="w-4 h-4 text-emerald-600" /> 85%+ Batt
                        </div>
                        <div className="w-px h-4 bg-slate-200" />
                        <div className="flex items-center gap-1 font-semibold text-slate-900">
                            <RotateCcw className="w-4 h-4 text-red-600" /> 7-Day Swap
                        </div>
                    </div>
                </div>
            </div>

            {/* Filterable Products Grid wrapped in Suspense */}
            <Suspense fallback={<div className="py-12 text-center text-sm text-slate-400">Loading Canada inventory...</div>}>
                <CategoryProductGrid 
                    initialProducts={CATALOG_PRODUCTS} 
                    initialCategory={category}
                    searchQuery={q}
                />
            </Suspense>
        </div>
    );
}
