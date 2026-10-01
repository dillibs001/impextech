import Link from 'next/link';
import { Smartphone, Laptop, Tablet, Headphones, ShieldCheck, BatteryCharging, BadgeCheck, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { XIcon } from '@/components/icons/XIcon';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white py-20 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Hero Left Content */}
          <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              quality without breaking the bank
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1]">
              Canada-sourced, <br />
              verified & <span className="text-red-500 underline decoration-red-500/40 decoration-wavy">guaranteed</span>.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-xl mb-8 leading-relaxed">
              Premium used smartphones, MacBooks, iPads, and accessories directly imported from Canada. Thoroughly tested, IMEI verified, and backed by our 7-day guarantee.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/products" 
                className="bg-red-600 hover:bg-red-500 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                Shop Gadgets <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/request" 
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-semibold backdrop-blur-sm transition-all border border-white/15 flex items-center justify-center"
              >
                Request a Device
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-10 pt-8 border-t border-slate-800/80 flex items-center gap-8 text-xs text-slate-400">
              <div>
                <span className="block text-xl font-bold text-white">100%</span>
                <span>Clean IMEI</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="block text-xl font-bold text-white">85%+</span>
                <span>Battery Health Min.</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="block text-xl font-bold text-white">7 Days</span>
                <span>Worry-Free Return</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Featured Verified Device Card */}
          <div className="w-full lg:w-[460px] flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
                {/* Card Top: Brand Emblem + Canada Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/brand/logo.png" 
                      alt="impextech emblem" 
                      className="w-7 h-7 object-contain rounded-md" 
                    />
                    <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">Verified Canada Drop</span>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-red-500/30">
                    <ShieldCheck className="w-3 h-3" /> 100% Tested
                  </span>
                </div>

                {/* Device Image Showcase */}
                <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-950 flex items-center justify-center p-4 overflow-hidden border border-slate-800/60">
                  <img 
                    src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=700&q=80" 
                    alt="iPhone 14 Pro Max Canada Verified" 
                    className="object-contain h-full max-h-[220px] drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-slate-300 font-medium border border-slate-800 flex items-center gap-1.5">
                    <BatteryCharging className="w-3.5 h-3.5 text-red-400" />
                    <span>Battery Health: <strong className="text-white">96%</strong></span>
                  </div>
                </div>

                {/* Device Info & Specs */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-white">iPhone 14 Pro Max</h3>
                      <p className="text-xs text-slate-400">Deep Purple • 256GB • Factory Unlocked</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through block">₦980,000</span>
                      <span className="text-lg font-black text-red-500">₦920,000</span>
                    </div>
                  </div>

                  {/* Spec pills */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-[11px] text-center">
                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl py-1.5 px-2">
                      <span className="block text-slate-400 text-[10px]">IMEI Status</span>
                      <strong className="text-white">Clean / Global</strong>
                    </div>
                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl py-1.5 px-2">
                      <span className="block text-slate-400 text-[10px]">Physical Body</span>
                      <strong className="text-white">Grade A+ (9.8/10)</strong>
                    </div>
                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl py-1.5 px-2">
                      <span className="block text-slate-400 text-[10px]">Warranty</span>
                      <strong className="text-white">7-Day Return</strong>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <Link 
                    href="/products" 
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 rounded-xl text-center transition-colors border border-slate-700"
                  >
                    View Gadgets
                  </Link>
                  <a 
                    href="https://wa.me/2349060329221?text=Hello%20impextech,%20I'm%20interested%20in%20the%20Canada-imported%20iPhone%2014%20Pro%20Max%20256GB."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-current" /> Order Fast
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Trust Badges Bar */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 -mt-12 relative z-20">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900">Canada Imported</h3>
            <p className="text-xs text-slate-500">Directly sourced & verified</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900">IMEI Verified</h3>
            <p className="text-xs text-slate-500">Clean global records</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900">Battery Checked</h3>
            <p className="text-xs text-slate-500">Documented health %</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900">7-Day Guarantee</h3>
            <p className="text-xs text-slate-500">Full replacement warranty</p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Shop by Category</h2>
          <p className="text-slate-500 text-sm">Tested devices ready for immediate dispatch across Nigeria</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/products?category=phones" className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-red-50 transition-all">
              <Smartphone className="w-8 h-8 text-slate-700 group-hover:text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-red-600 transition-colors">Phones</h3>
              <p className="text-sm text-slate-500">iPhones & Galaxy flagships</p>
            </div>
          </Link>
          
          <Link href="/products?category=tablets" className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-red-50 transition-all">
              <Tablet className="w-8 h-8 text-slate-700 group-hover:text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-red-600 transition-colors">Tablets</h3>
              <p className="text-sm text-slate-500">iPads & Galaxy Tabs</p>
            </div>
          </Link>

          <Link href="/products?category=laptops" className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-red-50 transition-all">
              <Laptop className="w-8 h-8 text-slate-700 group-hover:text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-red-600 transition-colors">Laptops</h3>
              <p className="text-sm text-slate-500">Apple Silicon & PCs</p>
            </div>
          </Link>

          <Link href="/products?category=accessories" className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-red-50 transition-all">
              <Headphones className="w-8 h-8 text-slate-700 group-hover:text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-red-600 transition-colors">Accessories</h3>
              <p className="text-sm text-slate-500">AirPods, Watches & Cables</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Trust & Testimonials (Campus & City Reviews) */}
      <section className="py-20 bg-slate-900 text-white rounded-3xl mx-4">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-red-400 font-semibold text-xs tracking-wider uppercase mb-2 block">Real Customer Experiences</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Trusted Across Nigeria</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              From university campuses (UNEC, UNN, IMT) to tech professionals in Lagos and Abuja. Here is what customers say about buying from impextech.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/60 relative flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-red-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;Requested an iPad Air M1 through the custom request board. Arrived in exactly 7 days. Battery health was 98% as promised, clean IMEI. impextech never disappoints.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700/60">
                <div className="w-10 h-10 bg-red-600/20 text-red-400 rounded-full flex items-center justify-center font-bold text-sm">C</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Chinedu O.</h4>
                  <p className="text-xs text-slate-400">UNEC Campus • iPad Air M1</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/60 relative flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-red-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;Ordered an iPhone 13 Pro directly via WhatsApp. The Canada inspection video they sent before shipping was transparent. 100% genuine gadget.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700/60">
                <div className="w-10 h-10 bg-red-600/20 text-red-400 rounded-full flex items-center justify-center font-bold text-sm">F</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Folake A.</h4>
                  <p className="text-xs text-slate-400">Lagos • iPhone 13 Pro</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/60 relative flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-red-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;The built-in AI consultant suggested the right MacBook for my coding stack without overselling. Truly quality without breaking the bank.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700/60">
                <div className="w-10 h-10 bg-red-600/20 text-red-400 rounded-full flex items-center justify-center font-bold text-sm">T</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Tobi S.</h4>
                  <p className="text-xs text-slate-400">Software Developer • MacBook Pro M1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Communities Bar */}
          <div className="mt-16 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Join the impextech community</h4>
                <p className="text-xs text-slate-400">Daily unboxing videos, drop announcements, and flash deals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a 
                href="https://x.com/impextech001" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white transition-colors"
              >
                <XIcon className="w-3.5 h-3.5" /> @impextech001
              </a>
              <a 
                href="https://www.instagram.com/impextech/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
              >
                <InstagramIcon className="w-3.5 h-3.5" /> @impextech
              </a>
              <a 
                href="https://wa.me/2349060329221" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-xs font-semibold text-white transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-current" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
