import Link from 'next/link';
import { Smartphone, Laptop, Tablet, Headphones, ShieldCheck, BatteryCharging, BadgeCheck, RotateCcw } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl relative z-10 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Canada-sourced, verified, and guaranteed.
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mb-10">
            Premium used gadgets directly imported from Canada. Thoroughly tested, IMEI verified, and backed by our 7-day guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products" className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Shop Now
            </Link>
            <Link href="/request" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold backdrop-blur-sm transition-colors border border-white/20">
              Request a Gadget
            </Link>
          </div>
        </div>
        {/* Background Decorative Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-800 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 -mt-12 relative z-20">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900">Canada Imported</h3>
            <p className="text-sm text-slate-500">Directly sourced</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900">IMEI Verified</h3>
            <p className="text-sm text-slate-500">Clean records</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900">Battery Checked</h3>
            <p className="text-sm text-slate-500">Optimal health</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900">7-Day Guarantee</h3>
            <p className="text-sm text-slate-500">Worry-free returns</p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/products?category=phones" className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 transition-all">
              <Smartphone className="w-8 h-8 text-slate-700 group-hover:text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">Phones</h3>
              <p className="text-sm text-slate-500">iPhones & Android</p>
            </div>
          </Link>
          
          <Link href="/products?category=tablets" className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 transition-all">
              <Tablet className="w-8 h-8 text-slate-700 group-hover:text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">Tablets</h3>
              <p className="text-sm text-slate-500">iPads & Galaxy Tabs</p>
            </div>
          </Link>

          <Link href="/products?category=laptops" className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 transition-all">
              <Laptop className="w-8 h-8 text-slate-700 group-hover:text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">Laptops</h3>
              <p className="text-sm text-slate-500">MacBooks & PCs</p>
            </div>
          </Link>

          <Link href="/products?category=accessories" className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 transition-all">
              <Headphones className="w-8 h-8 text-slate-700 group-hover:text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">Accessories</h3>
              <p className="text-sm text-slate-500">AirPods, Chargers</p>
            </div>
          </Link>
        </div>
      </section>
      {/* Trust & Testimonials (Wall of Love) */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by Gadget Lovers in Nigeria</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Don't just take our word for it. Here is what happens when you buy verified, Canada-imported devices.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative">
              <div className="flex gap-1 text-emerald-500 mb-4">
                {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
              </div>
              <p className="text-slate-700 mb-6 italic">"Requested an iPad Air M1 through the Request Board. Arrived in exactly 7 days. The battery health was exactly 98% as quoted. Impextech is the real deal."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">C</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Chinedu O.</h4>
                  <p className="text-xs text-slate-500">Bought iPad Air M1</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative">
              <div className="flex gap-1 text-emerald-500 mb-4">
                {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
              </div>
              <p className="text-slate-700 mb-6 italic">"Was skeptical about buying used electronics online, but the 'Canada Verified' badge and the inspection video gave me confidence. My iPhone 13 Pro works flawlessly."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">F</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Folake A.</h4>
                  <p className="text-xs text-slate-500">Bought iPhone 13 Pro</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative">
              <div className="flex gap-1 text-emerald-500 mb-4">
                {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
              </div>
              <p className="text-slate-700 mb-6 italic">"The AI consultant actually told me not to overspend on the M2 iPad since I only use it for reading and YouTube. Saved me ₦100k. Top tier customer service."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">T</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Tobi S.</h4>
                  <p className="text-xs text-slate-500">Used AI Consultant</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instagram Community Banner */}
          <div className="mt-16 text-center max-w-2xl mx-auto bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 p-8 rounded-3xl border border-pink-100 flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">See Unboxing & Daily Batch Drops</h3>
            <p className="text-sm text-slate-600 mb-6">Watch our live battery tests, IMEI verification proofs, and new arrival videos straight from Canada.</p>
            <a 
              href="https://www.instagram.com/impextech/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all flex items-center gap-2 shadow-sm hover:shadow"
            >
              <InstagramIcon className="w-4 h-4 text-pink-400" />
              Follow @impextech on Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
