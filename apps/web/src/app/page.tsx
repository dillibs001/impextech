import Link from 'next/link';
import { 
  Smartphone, Laptop, Headphones, Watch, Camera, Plug, 
  ShieldCheck, BatteryCharging, RotateCcw, ArrowRight, 
  Sparkles, CheckCircle2, Star, Check, Award
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { CategoryProductGrid } from '@/components/home/CategoryProductGrid';
import { CATALOG_PRODUCTS } from '@/lib/catalog';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16 bg-slate-50 text-slate-900">
      
      {/* 1. HERO SECTION (Swappie / Back Market style with impextech branding) */}
      <section className="bg-white border-b border-slate-200/80 pt-12 pb-16 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Hero Left Content */}
            <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                quality without breaking the bank
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.08] mb-6">
                Like new. <br />
                Without the <span className="text-red-600 underline decoration-red-200 decoration-wavy">retail markup</span>.
              </h1>

              {/* Subhead */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mb-8 leading-relaxed">
                Directly imported from Canada. Thoroughly tested with 50+ checkpoints, documented battery health, clean global IMEI, and backed by our 7-day money-back guarantee.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  href="/products"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Shop Canada Drops <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/request"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center"
                >
                  Request a Custom Spec
                </Link>
              </div>

              {/* Trust Indicators Bar */}
              <div className="mt-10 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-left">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current" /> 4.9/5
                  </div>
                  <span className="text-[11px] text-slate-500">800+ Nigerian Buyers</span>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" /> 7 Days
                  </div>
                  <span className="text-[11px] text-slate-500">Money-Back Guarantee</span>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-slate-900 font-bold text-sm">
                    <BatteryCharging className="w-4 h-4 text-emerald-600" /> 85%+
                  </div>
                  <span className="text-[11px] text-slate-500">Min. Battery Health</span>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-red-600 font-bold text-sm">
                    <Award className="w-4 h-4" /> 100%
                  </div>
                  <span className="text-[11px] text-slate-500">Direct Canada Import</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Swappie Style Price Comparison Card */}
            <div className="w-full lg:w-[440px] flex-shrink-0">
              <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200 shadow-xl p-6 relative overflow-hidden">
                {/* Save Pill */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Save ₦350,000
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" /> 99% Battery
                  </span>
                </div>

                {/* Device Cutout Image */}
                <div className="aspect-[4/3] rounded-2xl bg-white flex items-center justify-center p-4 border border-slate-100 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80"
                    alt="iPhone 15 Pro Max Natural Titanium"
                    className="max-h-[200px] object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">
                    Grade A+ Pristine
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white/95 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-red-600" /> Clean IMEI
                  </div>
                </div>

                {/* Comparison Breakdown */}
                <div className="mt-5">
                  <h3 className="font-bold text-slate-900 text-base">iPhone 15 Pro Max 256GB</h3>
                  <p className="text-xs text-slate-500">Natural Titanium • Unlocked for all networks</p>

                  <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block line-through">Brand New Retail</span>
                      <span className="text-sm font-bold text-slate-400">₦1,600,000</span>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-red-600 block">impextech Certified</span>
                      <span className="text-xl font-extrabold text-slate-900">₦1,250,000</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      href="/products/iphone-15-pro-max-256gb-natural-titanium"
                      className="flex-1 bg-slate-900 hover:bg-red-600 text-white text-xs font-bold py-3 rounded-xl text-center transition-colors shadow-sm"
                    >
                      View Inspection & Buy
                    </Link>
                    <a
                      href="https://wa.me/2349060329221?text=Hello%20impextech,%20I'm%20interested%20in%20the%20iPhone%2015%20Pro%20Max%20Natural%20Titanium%20(₦1,250,000)."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl transition-colors shadow-sm"
                      aria-label="Order on WhatsApp"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-current" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY TILES (Swappie Quick Category Selector) */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <Link href="/products?category=phones" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col items-center text-center gap-2.5 group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-red-50 group-hover:scale-110 transition-all">
              <Smartphone className="w-6 h-6 text-slate-700 group-hover:text-red-600" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-red-600 transition-colors">Phones</span>
            <span className="text-[11px] text-slate-400">iPhones & Galaxy</span>
          </Link>

          <Link href="/products?category=laptops" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col items-center text-center gap-2.5 group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-red-50 group-hover:scale-110 transition-all">
              <Laptop className="w-6 h-6 text-slate-700 group-hover:text-red-600" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-red-600 transition-colors">Laptops</span>
            <span className="text-[11px] text-slate-400">MacBooks & XPS</span>
          </Link>

          <Link href="/products?category=headphones" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col items-center text-center gap-2.5 group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-red-50 group-hover:scale-110 transition-all">
              <Headphones className="w-6 h-6 text-slate-700 group-hover:text-red-600" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-red-600 transition-colors">Headphones</span>
            <span className="text-[11px] text-slate-400">AirPods & Sony</span>
          </Link>

          <Link href="/products?category=smartwatches" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col items-center text-center gap-2.5 group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-red-50 group-hover:scale-110 transition-all">
              <Watch className="w-6 h-6 text-slate-700 group-hover:text-red-600" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-red-600 transition-colors">Smartwatches</span>
            <span className="text-[11px] text-slate-400">Apple & Galaxy</span>
          </Link>

          <Link href="/products?category=cameras" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col items-center text-center gap-2.5 group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-red-50 group-hover:scale-110 transition-all">
              <Camera className="w-6 h-6 text-slate-700 group-hover:text-red-600" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-red-600 transition-colors">Cameras</span>
            <span className="text-[11px] text-slate-400">Sony & Canon</span>
          </Link>

          <Link href="/products?category=accessories" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col items-center text-center gap-2.5 group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-red-50 group-hover:scale-110 transition-all">
              <Plug className="w-6 h-6 text-slate-700 group-hover:text-red-600" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-red-600 transition-colors">Accessories</span>
            <span className="text-[11px] text-slate-400">Chargers & MagSafe</span>
          </Link>

        </div>
      </section>

      {/* 3. FEATURED PRODUCTS CATALOG (Back Market / Swappie Dynamic Grid) */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">Direct Canada Batch</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Verified In-Stock Devices</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">Every unit individually inspected with battery and IMEI report</p>
        </div>

        {/* Client-side filterable grid */}
        <CategoryProductGrid initialProducts={CATALOG_PRODUCTS} />
      </section>

      {/* 4. THE IMPEXTECH DIFFERENCE (Back Market Style 4-Pillars) */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">Zero Mystery. Pure Quality.</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Why Buy from impextech?</h2>
            <p className="text-sm text-slate-500 mt-2">We eliminate the fear of buying used electronics in Nigeria by holding every device to international standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Direct Canada Import</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sourced from certified corporate off-leases in Toronto and Vancouver. Never opened or repaired with cheap local spare parts.
                </p>
              </div>
              <span className="text-[11px] font-bold text-red-600 mt-4 block">100% Genuine Internals →</span>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">50+ Point Inspection</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every screen digitizer, camera lens, TrueTone, FaceID, microphone, and charging port passes multi-step diagnostic benchmarks.
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 mt-4 block">Tested Before Dispatch →</span>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-900 flex items-center justify-center mb-4">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">7-Day Guarantee</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Take your gadget home and test it under real conditions. If any hardware defect appears, get an immediate unit swap or full refund.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-900 mt-4 block">Zero Risk Purchase →</span>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Clean Global IMEI</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Permanently unlocked for MTN, Airtel, Glo, and 9mobile. Zero carrier blacklist or iCloud lock, verified on global GSMA databases.
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-700 mt-4 block">Worldwide Unlocked →</span>
            </div>

          </div>
        </div>
      </section>

      {/* 5. COSMETIC GRADING GUIDE (Back Market Signature Feature) */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">Total Transparency</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Our Cosmetic Grading Scale</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Every device is technically 100% functional. You only choose the exterior cosmetic tier you prefer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border-2 border-red-500 shadow-sm relative flex flex-col justify-between">
            <span className="absolute -top-3 right-6 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </span>
            <div>
              <h3 className="font-black text-xl text-slate-900 mb-1">Pristine</h3>
              <p className="text-xs text-slate-500 mb-4">Like new out of the box</p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Screen: 100% flawless, zero micro-scratches</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Body: Factory-fresh look, no dents</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Battery: 95% – 100% health</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
              Ideal for gifts and flagship lovers.
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-black text-xl text-slate-900 mb-1">Excellent</h3>
              <p className="text-xs text-slate-500 mb-4">Near mint condition</p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Screen: 100% flawless when turned on</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Body: May have 1-2 faint micro-marks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Battery: 90% – 95% health</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
              The sweet spot for performance vs price.
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-black text-xl text-slate-900 mb-1">Good</h3>
              <p className="text-xs text-slate-500 mb-4">Maximum budget savings</p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Screen: Clean with normal light handling marks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Body: Visible minor scuffs (hidden with a case)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Battery: 85% – 90% health</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
              Maximum savings, 100% technical power.
            </div>
          </div>

        </div>
      </section>

      {/* 6. CUSTOM GADGET REQUEST BANNER (Sourcing Concierge) */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2">Direct Sourcing Concierge</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">Looking for a specific model or storage size?</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              If your desired device isn&apos;t in stock today, tell us what you need. Our team in Toronto, Canada will handpick and inspect it directly for you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <Link
              href="/request"
              className="bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full text-center transition-all shadow-md"
            >
              Submit Device Request
            </Link>
            <a
              href="https://wa.me/2349060329221?text=Hello%20impextech,%20I%20would%20like%20to%20request%20a%20specific%20Canada-imported%20gadget."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full text-center transition-all flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 7. VERIFIED CUSTOMER REVIEWS (Swappie Wall of Love) */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">Campus & City Feedback</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Verified Buyer Experiences</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Trusted across Nigerian university campuses (UNEC, UNN, IMT) and tech hubs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                &ldquo;Ordered an iPhone 14 Pro directly via WhatsApp. They sent the Canada battery check video before I sent payment. Delivered to Enugu within 48 hours. Battery was exactly 95%.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center">C</div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Chinedu O.</h4>
                <p className="text-[10px] text-slate-400">UNEC Campus • iPhone 14 Pro</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                &ldquo;Requested a MacBook Pro 14 M2 Pro through the Request Board. Saved over ₦600k compared to brand new retail and the battery cycle count was only 34 cycles. 10/10 service.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">T</div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Tobi S.</h4>
                <p className="text-[10px] text-slate-400">Software Engineer (Lagos) • MacBook Pro</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                &ldquo;Got the Sony WH-1000XM5. Sound is pristine, noise cancellation is brand new, and the ear pads were completely clean. impextech really is quality without breaking the bank.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">F</div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Folake A.</h4>
                <p className="text-[10px] text-slate-400">Content Creator (Abuja) • Sony WH-1000XM5</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
