import Link from 'next/link';
import { queryVendure, GET_PRODUCTS_QUERY } from '@/lib/vendure';
import { Smartphone, BatteryCharging, ShieldCheck } from 'lucide-react';

export default async function ProductsPage() {
    let data;
    try {
        data = await queryVendure(GET_PRODUCTS_QUERY);
    } catch (e) {
        return <div className="container mx-auto p-8 text-center text-red-500">Failed to load products. Make sure the API is running.</div>;
    }

    const products = data.search.items;

    // Helper to format minor units (e.g., 45000000 -> ₦450,000)
    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value / 100);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">All Verified Gadgets</h1>
            
            {products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <Smartphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-700">No gadgets listed yet</h2>
                    <p className="text-slate-500 mt-2">Check back soon or request a specific device.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => {
                        const priceValue = product.priceWithTax.min || product.priceWithTax.value;
                        
                        return (
                            <Link href={`/products/${product.slug}`} key={product.productId} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                                <div className="aspect-square bg-slate-50 relative p-6">
                                    {product.productAsset ? (
                                        <img src={product.productAsset.preview} alt={product.productName} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Smartphone size={64} />
                                        </div>
                                    )}
                                    {/* Trust Badge overlay */}
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-emerald-700 flex items-center gap-1 shadow-sm border border-emerald-100">
                                        <ShieldCheck size={14} /> Canada Verified
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-semibold text-slate-900 line-clamp-1">{product.productName}</h3>
                                    <p className="text-emerald-600 font-bold text-lg mt-2">{formatPrice(priceValue)}</p>
                                    
                                    <button className="mt-4 w-full bg-slate-900 hover:bg-emerald-600 text-white font-medium py-2 rounded-lg transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
