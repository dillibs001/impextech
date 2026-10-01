import { queryVendure, GET_PRODUCT_BY_SLUG_QUERY } from '@/lib/vendure';
import { ShieldCheck, BatteryCharging, ShieldAlert, ShoppingCart, Info, Award } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { notFound } from 'next/navigation';

interface ProductVariant {
    id: string;
    name: string;
    priceWithTax: number;
    stockLevel: string;
    customFields?: {
        batteryHealth?: number | null;
        imeiStatus?: string | null;
        inspectionVideoUrl?: string | null;
    } | null;
}

interface ProductDetail {
    id: string;
    name: string;
    description: string;
    customFields?: {
        condition?: string | null;
        sourceCountry?: string | null;
    } | null;
    assets?: Array<{ preview: string }> | null;
    variants: ProductVariant[];
}

interface ProductDetailResponse {
    product: ProductDetail | null;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let data: ProductDetailResponse | undefined;
    try {
        data = await queryVendure<ProductDetailResponse>(GET_PRODUCT_BY_SLUG_QUERY, { slug });
    } catch {
        return <div className="container mx-auto p-8 text-center text-red-500">API Error. Make sure the API server is reachable.</div>;
    }

    const product = data?.product;
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
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full w-max mb-4">
                        <Award size={15} /> 
                        Directly Imported from {product.customFields?.sourceCountry || 'Canada'}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{product.name}</h1>
                    
                    <div className="text-3xl font-extrabold text-red-600 mb-8">
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
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 col-span-2 flex items-center gap-4">
                            <div className="bg-red-50 p-3 rounded-full text-red-600">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">IMEI Status</div>
                                <div className="text-base font-bold text-slate-900">{primaryVariant?.customFields?.imeiStatus || 'Clean & Verified'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="prose text-slate-600 mb-8 max-w-none text-sm" dangerouslySetInnerHTML={{ __html: product.description || '' }} />

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 bg-slate-900 hover:bg-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg">
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                        
                        <a 
                            href={`https://wa.me/2349060329221?text=${encodeURIComponent(`Hello impextech, I'm interested in buying ${product.name} (${primaryVariant ? formatPrice(primaryVariant.priceWithTax) : ''}). Is this unit still available?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                        >
                            <WhatsAppIcon className="w-5 h-5 fill-current" /> Order via WhatsApp
                        </a>
                    </div>
                    
                    <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                        <ShieldAlert size={14} className="text-red-500" /> Backed by our 7-Day Money-Back Guarantee.
                    </p>
                </div>
            </div>
        </div>
    );
}
