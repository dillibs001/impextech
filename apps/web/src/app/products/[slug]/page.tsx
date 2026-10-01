import { queryVendure, GET_PRODUCT_BY_SLUG_QUERY } from '@/lib/vendure';
import { ShieldCheck, BatteryCharging, ShieldAlert, ShoppingCart, Info } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let data;
    try {
        data = await queryVendure(GET_PRODUCT_BY_SLUG_QUERY, { slug });
    } catch (e) {
        return <div className="container mx-auto p-8 text-center text-red-500">API Error.</div>;
    }

    const product = data.product;
    if (!product) return notFound();

    // Default to first variant for display
    const primaryVariant = product.variants[0];
    const formatPrice = (value: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value / 100);

    const getFallbackImage = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('macbook')) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
        if (n.includes('ipad')) return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80';
        if (n.includes('watch')) return 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80';
        if (n.includes('airpods')) return 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80';
        if (n.includes('samsung')) return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80';
        return 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80';
    };

    const displayImage = product.assets?.[0]?.preview || getFallbackImage(product.name);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                
                {/* Image Gallery */}
                <div className="md:w-1/2 bg-slate-50 p-8 flex items-center justify-center min-h-[400px]">
                    <img src={displayImage} alt={product.name} className="max-w-full max-h-[500px] object-contain rounded-2xl" />
                </div>

                {/* Details */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-max mb-4">
                        <ShieldCheck size={16} /> 
                        Imported from {product.customFields?.sourceCountry || 'Canada'}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{product.name}</h1>
                    
                    <div className="text-3xl font-bold text-emerald-600 mb-8">
                        {primaryVariant ? formatPrice(primaryVariant.priceWithTax) : 'N/A'}
                    </div>

                    {/* Trust Signals Board */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm font-medium">
                                <BatteryCharging size={16} /> Battery Health
                            </div>
                            <div className="text-xl font-bold text-slate-900">
                                {primaryVariant?.customFields?.batteryHealth ? `${primaryVariant.customFields.batteryHealth}%` : 'Not checked'}
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm font-medium">
                                <Info size={16} /> Condition
                            </div>
                            <div className="text-xl font-bold text-slate-900">
                                {product.customFields?.condition || 'Good'}
                            </div>
                        </div>
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 col-span-2 flex items-center gap-4">
                            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-emerald-800">IMEI Status</div>
                                <div className="text-lg font-bold text-emerald-900">{primaryVariant?.customFields?.imeiStatus || 'Clean & Verified'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="prose text-slate-600 mb-8 max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '' }} />

                    <button className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg">
                        <ShoppingCart size={20} /> Add to Cart
                    </button>
                    
                    <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                        <ShieldAlert size={14} /> Backed by our 7-Day Money-Back Guarantee.
                    </p>
                </div>
            </div>
        </div>
    );
}
