import Link from 'next/link';
import { 
  ShieldCheck, BatteryCharging, RotateCcw, Award, 
  Check, Info, ShoppingCart, Truck, Shield, ArrowLeft 
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { notFound } from 'next/navigation';
import { getVendureProductBySlug } from '@/lib/vendure';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ProductImageCarousel } from '@/components/product/ProductImageCarousel';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Lookup live in Vendure (with fallback)
    const product = await getVendureProductBySlug(slug);
    if (!product) return notFound();

    const formatPrice = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
    const savings = product.retailNgn - product.priceNgn;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/products" className="hover:text-slate-900 transition-colors">Catalog</Link>
                <span>/</span>
                <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Left Column: Visuals & Inspection Report (Back Market style) */}
                    <div className="lg:w-1/2 flex flex-col gap-6">
                        {/* Image Showcase Carousel */}
                        <ProductImageCarousel
                            images={product.images && product.images.length > 0 ? product.images : [product.preview]}
                            name={product.name}
                            condition={product.condition}
                            batteryHealth={product.batteryHealth}
                        />

                        {/* 50-Point Technical Diagnostic Check (Back Market Signature) */}
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                50-Point Technical Diagnostic Report
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200/60">
                                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                    <span>Screen & Touch: <strong className="text-slate-900">100%</strong></span>
                                </div>
                                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200/60">
                                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                    <span>Sensors & FaceID: <strong className="text-slate-900">Passed</strong></span>
                                </div>
                                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200/60">
                                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                    <span>Cameras & Flash: <strong className="text-slate-900">Passed</strong></span>
                                </div>
                                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200/60">
                                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                    <span>Network & WiFi: <strong className="text-slate-900">Unlocked</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing, Specs & Conversion (Swappie style) */}
                    <div className="lg:w-1/2 flex flex-col justify-between">
                        <div>
                            {/* Category & Title */}
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{product.category}</span>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* Price Comparison Box */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6">
                                <div className="flex items-baseline justify-between gap-2">
                                    <div>
                                        <span className="text-xs font-semibold text-slate-500 block">impextech Canada Price</span>
                                        <span className="text-3xl font-black text-slate-900 tracking-tight">
                                            {formatPrice(product.priceNgn)}
                                        </span>
                                    </div>
                                    {savings > 0 && (
                                        <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full">
                                            Save {formatPrice(savings)}
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-slate-400 line-through mt-1">
                                    Brand New Retail Price: {formatPrice(product.retailNgn)}
                                </div>
                            </div>

                            {/* Hardware Specs Matrix */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                                    <span className="text-[11px] text-slate-400 font-medium block">Battery Capacity</span>
                                    <strong className="text-base text-slate-900 flex items-center gap-1.5 mt-0.5">
                                        <BatteryCharging className="w-4 h-4 text-emerald-600" />
                                        {product.batteryHealth}% Health
                                    </strong>
                                </div>
                                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                                    <span className="text-[11px] text-slate-400 font-medium block">Cosmetic Tier</span>
                                    <strong className="text-base text-slate-900 flex items-center gap-1.5 mt-0.5">
                                        <ShieldCheck className="w-4 h-4 text-red-600" />
                                        {product.condition} Grade
                                    </strong>
                                </div>
                                <div className="p-3.5 rounded-xl border border-slate-200 bg-white col-span-2">
                                    <span className="text-[11px] text-slate-400 font-medium block">Global IMEI / Carrier Status</span>
                                    <strong className="text-sm text-slate-900 flex items-center gap-1.5 mt-0.5">
                                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                                        {product.imeiStatus} • Factory Unlocked for MTN, Airtel, Glo, 9mobile
                                    </strong>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                                {product.description}
                            </p>
                        </div>

                        {/* Conversion CTAs */}
                        <div>
                            <div className="flex flex-col gap-3">
                                {/* Primary Back Market Add to Cart Button */}
                                <AddToCartButton product={product} variant="full" />

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        href="/checkout"
                                        className="flex-1 bg-white hover:bg-slate-50 text-[#111111] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-300 text-xs sm:text-sm"
                                    >
                                        Direct Checkout
                                    </Link>

                                    <a
                                        href={`https://wa.me/2349060329221?text=${encodeURIComponent(`Hello impextech, I want to purchase the Canada-imported ${product.name} (${formatPrice(product.priceNgn)}). Please send the physical inspection proof video and account details.`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm text-xs sm:text-sm"
                                    >
                                        <WhatsAppIcon className="w-4 h-4 fill-current" /> Order via WhatsApp
                                    </a>
                                </div>
                            </div>

                            {/* Reassurance notes */}
                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Truck className="w-3.5 h-3.5 text-slate-400" /> Express Dispatch
                                </span>
                                <span className="flex items-center gap-1">
                                    <RotateCcw className="w-3.5 h-3.5 text-emerald-600" /> 7-Day Money-Back Guarantee
                                </span>
                                <span className="flex items-center gap-1">
                                    <Shield className="w-3.5 h-3.5 text-red-600" /> Direct Canada Sourcing
                                </span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
