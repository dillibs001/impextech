import Link from 'next/link';
import { queryVendure, GET_PRODUCTS_QUERY, ProductSearchItem } from '@/lib/vendure';
import { Smartphone, ShieldCheck } from 'lucide-react';

interface SearchResult {
    search: {
        items: ProductSearchItem[];
    };
}

export default async function ProductsPage() {
    let data: SearchResult | undefined;
    try {
        data = await queryVendure<SearchResult>(GET_PRODUCTS_QUERY);
    } catch {
        return <div className="container mx-auto p-8 text-center text-red-500">Failed to load products. Make sure the API is running.</div>;
    }

    const products = data?.search?.items || [];

    // Helper to format minor units (e.g., 45000000 -> ₦450,000)
    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value / 100);
    };

    const getFallbackImage = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('macbook')) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
        if (n.includes('ipad')) return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80';
        if (n.includes('watch')) return 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80';
        if (n.includes('airpods')) return 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80';
        if (n.includes('samsung')) return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80';
        return 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80';
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Verified Gadgets</h1>
                    <p className="text-slate-500 text-sm mt-1">Directly imported from Canada • 7-day money-back guarantee</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full self-start md:self-auto">
                    {products.length} Gadgets Available
                </span>
            </div>
            
            {products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <Smartphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-700">No gadgets listed yet</h2>
                    <p className="text-slate-500 mt-2">Check back soon or request a specific device.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const priceValue = product.priceWithTax?.min ?? product.priceWithTax?.value ?? 0;
                        const imgSrc = product.productAsset?.preview || getFallbackImage(product.productName);
                        
                        return (
                            <Link href={`/products/${product.slug}`} key={product.productId} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                                <div className="aspect-square bg-slate-50 relative p-6">
                                    <img src={imgSrc} alt={product.productName} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" />
                                    {/* Trust Badge overlay */}
                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-sm border border-slate-100">
                                        <ShieldCheck size={14} className="text-red-600" /> Canada Verified
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">{product.productName}</h3>
                                    <p className="text-red-600 font-bold text-lg mt-2">{formatPrice(priceValue)}</p>
                                    
                                    <button className="mt-4 w-full bg-slate-900 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors">
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
