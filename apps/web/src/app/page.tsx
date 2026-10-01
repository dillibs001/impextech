import Link from 'next/link';
import { 
  Smartphone, Laptop, Headphones, Watch, Camera, Plug, 
  ShieldCheck, BatteryCharging, RotateCcw, ArrowRight, 
  Sparkles, CheckCircle2, Star, Check, Award, Eye, Mic, Wifi
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { CategoryProductGrid } from '@/components/home/CategoryProductGrid';
import { CATALOG_PRODUCTS } from '@/lib/catalog';

export default function Home() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-20 bg-[#FBFBFB] text-[#111111]">
      
      {/* 1. BACK MARKET EXACT HERO 3-CARD PROMO GRID */}
      <section className="container mx-auto max-w-7xl px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Main Hero Banner (Span 2 columns on desktop) */}
          <div className="lg:col-span-2 bg-[#F3F4F7] rounded-3xl border border-slate-200/90 p-8 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
            <div className="flex-1 flex flex-col items-start z-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-white text-slate-800 border border-slate-200 px-3 py-1 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                quality without breaking the bank
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight leading-[1.08] mb-4">
                Verified tech that’s better for your pocket.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-md mb-8 leading-relaxed">
                Directly imported from Canada. Thoroughly tested with 50+ checkpoints, documented battery health, clean global IMEI, and a 7-day money-back guarantee.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className="bg-[#111111] hover:bg-red-600 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all flex items-center gap-2 shadow-sm"
                >
                  Shop all verified drops <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/request"
                  className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full border border-slate-300 transition-colors"
                >
                  Request custom spec
                </Link>
              </div>

              {/* 4 Micro Trust Badges */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center gap-6 text-[11px] font-bold text-slate-600">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 7-Day Guarantee
                </span>
                <span className="flex items-center gap-1">
                  <BatteryCharging className="w-4 h-4 text-emerald-600" /> 85%+ Battery
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-red-600 stroke-[3]" /> Clean Global IMEI
                </span>
              </div>
            </div>

            {/* Cutout Image of iPhone on Right */}
            <div className="w-full md:w-[260px] flex-shrink-0 flex items-center justify-center relative">
              <div className="relative group">
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
                  alt="iPhone 15 Pro Max Natural Titanium"
                  className="max-h-[260px] object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 right-0 bg-[#111111] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md">
                  Save ₦350,000
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2 Stacked Feature Cards (Back Market 2-Up Div Layout) */}
          <div className="flex flex-col gap-5">
            
            {/* Top Card: MacBooks */}
            <Link 
              href="/products?category=laptops"
              className="bg-[#FBF5EE] hover:bg-[#F8EFE3] transition-colors rounded-3xl border border-[#F2E5D4] p-6 flex items-center justify-between gap-4 group"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                  Laptops
                </span>
                <h3 className="text-xl font-black text-[#111111] mt-2 mb-1 group-hover:text-red-600 transition-colors">
                  MacBook M-Series
                </h3>
                <p className="text-xs text-slate-600 mb-3">Tested battery cycles & charger included.</p>
                <span className="text-xs font-extrabold text-[#111111]">
                  From ₦640,000 →
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80"
                alt="MacBook Pro"
                className="w-28 h-28 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Bottom Card: Audio & Wearables */}
            <Link 
              href="/products?category=headphones"
              className="bg-[#EDF4FB] hover:bg-[#E3EDF8] transition-colors rounded-3xl border border-[#D5E3F2] p-6 flex items-center justify-between gap-4 group"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded">
                  Audio & Watches
                </span>
                <h3 className="text-xl font-black text-[#111111] mt-2 mb-1 group-hover:text-red-600 transition-colors">
                  AirPods & Ultra
                </h3>
                <p className="text-xs text-slate-600 mb-3">Pristine sound & sanitized ear cushions.</p>
                <span className="text-xs font-extrabold text-[#111111]">
                  From ₦220,000 →
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80"
                alt="AirPods Max"
                className="w-28 h-28 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
            </Link>

          </div>

        </div>
      </section>

      {/* 2. BACK MARKET CATEGORY ICON STRIP */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <Link href="/products?category=phones" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-red-50 flex items-center justify-center flex-shrink-0 transition-colors">
              <Smartphone className="w-5 h-5 text-slate-700 group-hover:text-red-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-[#111111] group-hover:text-red-600 transition-colors">Phones</h4>
              <p className="text-[10px] text-slate-400">iPhones, Galaxy</p>
            </div>
          </Link>

          <Link href="/products?category=laptops" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-red-50 flex items-center justify-center flex-shrink-0 transition-colors">
              <Laptop className="w-5 h-5 text-slate-700 group-hover:text-red-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-[#111111] group-hover:text-red-600 transition-colors">Laptops</h4>
              <p className="text-[10px] text-slate-400">MacBook, XPS</p>
            </div>
          </Link>

          <Link href="/products?category=headphones" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-red-50 flex items-center justify-center flex-shrink-0 transition-colors">
              <Headphones className="w-5 h-5 text-slate-700 group-hover:text-red-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-[#111111] group-hover:text-red-600 transition-colors">Audio</h4>
              <p className="text-[10px] text-slate-400">AirPods, Sony</p>
            </div>
          </Link>

          <Link href="/products?category=smartwatches" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-red-50 flex items-center justify-center flex-shrink-0 transition-colors">
              <Watch className="w-5 h-5 text-slate-700 group-hover:text-red-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-[#111111] group-hover:text-red-600 transition-colors">Watches</h4>
              <p className="text-[10px] text-slate-400">Apple, Galaxy</p>
            </div>
          </Link>

          <Link href="/products?category=cameras" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-red-50 flex items-center justify-center flex-shrink-0 transition-colors">
              <Camera className="w-5 h-5 text-slate-700 group-hover:text-red-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-[#111111] group-hover:text-red-600 transition-colors">Cameras</h4>
              <p className="text-[10px] text-slate-400">Sony, Canon</p>
            </div>
          </Link>

          <Link href="/products?category=accessories" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-red-50 flex items-center justify-center flex-shrink-0 transition-colors">
              <Plug className="w-5 h-5 text-slate-700 group-hover:text-red-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-[#111111] group-hover:text-red-600 transition-colors">Accessories</h4>
              <p className="text-[10px] text-slate-400">Chargers, MagSafe</p>
            </div>
          </Link>

        </div>
      </section>

      {/* 3. FLASH DEALS & FEATURED DROPS (Back Market Card Layout) */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-black text-red-600 uppercase tracking-wider block mb-1">
              Direct Canada Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              Trending Deals in Stock
            </h2>
          </div>
          <p className="text-xs text-slate-500">Every gadget individually benchmarked with documented battery health.</p>
        </div>

        {/* Product Grid with Back Market style cards */}
        <CategoryProductGrid initialProducts={CATALOG_PRODUCTS} />
      </section>

      {/* 4. BACK MARKET 50+ TECHNICAL CHECKPOINTS (Direct Trust Language) */}
      <section className="bg-white py-16 border-y border-slate-200/90">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black text-red-600 uppercase tracking-wider block mb-1">
              Zero Mystery. Total Quality.
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight">
              Our 50-Point Technical Check
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Before any device is packaged for dispatch in Nigeria, it must pass every single one of these physical diagnostic standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#FBFBFB]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-[#111111]">1. Screen & Digitizer</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tested for zero dead pixels, touch calibration, accurate color temperature, and TrueTone performance.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-[#FBFBFB]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-[#111111]">2. Battery Health & Cells</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Battery health is measured using hardware diagnostic tools. Guaranteed 85%+ minimum, with many units at 95–100%.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-[#FBFBFB]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-[#111111]">3. Biometrics & Security</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Face ID infrared flood illuminators and Touch ID capacitive sensors tested for instant, secure authentication.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-[#FBFBFB]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-[#111111]">4. Cameras & Optical Zoom</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ultra-wide, telephoto, optical stabilization, autofocus actuators, and LED flash verified for pristine capture.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-[#FBFBFB]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-[#111111]">5. Audio & Microphones</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stereo bottom speakers, earpiece clarity, noise cancellation microphones, and speaker grilles sanitized.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-[#FBFBFB]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Wifi className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-[#111111]">6. Global IMEI & Network</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Checked against GSMA global databases for clean records. Completely unlocked for MTN, Airtel, Glo, and 9mobile.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BACK MARKET COSMETIC GRADING SCALE */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-black text-red-600 uppercase tracking-wider block mb-1">
            Condition Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            How Back Market / impextech Grades
          </h2>
          <p className="text-xs text-slate-500 mt-1">Every gadget is 100% functional. You only pay according to the exterior cosmetics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border-2 border-[#111111] shadow-md flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Flagship Grade
            </span>
            <div>
              <h3 className="font-black text-2xl text-[#111111] mb-1">Pristine</h3>
              <p className="text-xs text-slate-500 mb-4">Close to perfection</p>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Screen: Flawless, zero micro-scratches</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Body: Looks factory new</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Battery: 95% – 100% capacity</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold text-slate-600">
              For buyers who want a brand-new experience.
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-black text-2xl text-[#111111] mb-1">Excellent</h3>
              <p className="text-xs text-slate-500 mb-4">Almost no signs of wear</p>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Screen: Flawless display when lit</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Body: Tiny micro-marks (invisible from 20cm)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Battery: 90% – 95% capacity</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold text-slate-600">
              The smart sweet spot for performance & value.
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-black text-2xl text-[#111111] mb-1">Good</h3>
              <p className="text-xs text-slate-500 mb-4">Maximum budget savings</p>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Screen: Clean with minor light use marks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Body: Visible minor scratches (hidden with case)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Battery: 85% – 90% capacity</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold text-slate-600">
              Biggest discount, 100% technical power.
            </div>
          </div>

        </div>
      </section>

      {/* 6. BACK MARKET STYLE CUSTOM SOURCING BANNER */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-black shadow-lg">
          <div className="max-w-xl">
            <span className="text-xs font-black text-red-500 uppercase tracking-wider block mb-2">Direct Sourcing Board</span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Looking for a specific model or storage size?</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              If your desired device isn’t listed today, tell us. Our sourcing agents in Toronto, Canada will find, test, and ship your exact spec within 7 business days.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <Link
              href="/request"
              className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-full text-center transition-all shadow-sm"
            >
              Submit Device Request
            </Link>
            <a
              href="https://wa.me/2349060329221?text=Hello%20impextech,%20I%20want%20to%20request%20a%20specific%20Canada-imported%20gadget."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-full text-center transition-all flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" /> WhatsApp Concierge
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
