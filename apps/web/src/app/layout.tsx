import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, Heart, HelpCircle, ShieldCheck } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { XIcon } from '@/components/icons/XIcon';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { AiConsultant } from '@/components/chat/AiConsultant';
import { WhatsAppButton } from '@/components/chat/WhatsAppButton';
import { HeaderCartButton } from '@/components/cart/HeaderCartButton';

export const metadata: Metadata = {
  title: 'impextech | Canada-Certified Refurbished & Used Gadgets',
  description: 'Canada-sourced, verified, and guaranteed pre-owned gadgets. Phones, MacBooks, audio, smartwatches, and cameras.',
  icons: {
    icon: '/brand/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FBFBFB] text-[#111111]">
        <Providers>
          {/* Top Announcement Bar (Back Market Style with Logo Ash Color) */}
          <div className="bg-[#24272E] text-white text-xs py-2 px-4 border-b border-[#363B47]">
            <div className="container mx-auto max-w-7xl flex items-center justify-between">
              <div className="flex items-center gap-3 mx-auto sm:mx-0">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Fresh Canada Drops Landed
                </span>
                <span className="text-white/30 hidden md:inline">•</span>
                <span className="hidden md:inline text-white/90">50+ Hardware Checkpoints</span>
                <span className="text-white/30 hidden lg:inline">•</span>
                <span className="hidden lg:inline text-white/90">7-Day Money-Back Guarantee</span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-white/80">
                <a 
                  href="https://wa.me/2349060329221" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-semibold"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current text-emerald-400" /> WhatsApp Concierge: +234 906 032 9221
                </a>
              </div>
            </div>
          </div>

          {/* Main Header (Back Market Exact Div Layout) */}
          <header className="bg-white border-b border-slate-200/90 sticky top-0 z-50">
            <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4 md:gap-8">
              
              {/* 1. Logo */}
              <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                <img 
                  src="/brand/logo.png" 
                  alt="impextech logo" 
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg group-hover:scale-105 transition-transform" 
                />
                <span className="text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">
                  impex<span className="text-red-600">tech</span>
                </span>
              </Link>

              {/* 2. Back Market Search Bar */}
              <div className="flex-1 max-w-2xl hidden md:block">
                <Link href="/products" className="relative flex items-center w-full">
                  <div className="w-full bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-xs text-slate-500 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <span>Search phones, MacBooks, headphones, cameras, watches...</span>
                    </div>
                    <span className="text-[11px] font-bold text-red-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                      20 In Stock
                    </span>
                  </div>
                </Link>
              </div>

              {/* 3. Header Action Links */}
              <div className="flex items-center gap-2 sm:gap-4">
                <Link 
                  href="/request" 
                  className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:text-red-600 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100"
                >
                  <HelpCircle className="w-4 h-4 text-red-600" />
                  <span>Request Custom Device</span>
                </Link>

                <div className="hidden xl:flex items-center gap-1.5 border-l border-slate-200 pl-3">
                  <a 
                    href="https://x.com/impextech001" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="X Account"
                    className="p-2 text-slate-500 hover:text-black hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://www.instagram.com/impextech/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Instagram Profile"
                    className="p-2 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://wa.me/2349060329221" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="WhatsApp"
                    className="p-2 text-slate-500 hover:text-[#25D366] hover:bg-emerald-50 rounded-full transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                  </a>
                </div>

                {/* Cart Button */}
                <HeaderCartButton />

                <Link href="/products" className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Menu">
                  <Menu className="w-5 h-5 text-[#111111]" />
                </Link>
              </div>

            </div>

            {/* Back Market Sub-Nav Categories Strip */}
            <div className="border-t border-slate-100 bg-white">
              <div className="container mx-auto max-w-7xl px-4 flex items-center gap-6 overflow-x-auto no-scrollbar py-2.5 text-xs font-bold text-slate-700">
                <Link href="/products" className="hover:text-red-600 whitespace-nowrap text-red-600 font-extrabold flex items-center gap-1">
                  <span>⚡ All Canada Drops</span>
                </Link>
                <Link href="/products?category=phones" className="hover:text-red-600 whitespace-nowrap transition-colors">
                  iPhones & Phones
                </Link>
                <Link href="/products?category=laptops" className="hover:text-red-600 whitespace-nowrap transition-colors">
                  MacBooks & Laptops
                </Link>
                <Link href="/products?category=headphones" className="hover:text-red-600 whitespace-nowrap transition-colors">
                  AirPods & Audio
                </Link>
                <Link href="/products?category=smartwatches" className="hover:text-red-600 whitespace-nowrap transition-colors">
                  Apple Watch & Watches
                </Link>
                <Link href="/products?category=cameras" className="hover:text-red-600 whitespace-nowrap transition-colors">
                  Cameras & Lenses
                </Link>
                <Link href="/products?category=accessories" className="hover:text-red-600 whitespace-nowrap transition-colors">
                  Chargers & MagSafe
                </Link>
                <Link href="/request" className="hover:text-red-600 whitespace-nowrap transition-colors text-slate-400">
                  Custom Request
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Back Market Style Footer (Styled with Brand Logo Ash Slate) */}
          <footer className="bg-[#1E2127] text-white pt-16 pb-12 mt-20 border-t border-[#2F343F]">
            <div className="container mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
              
              {/* Brand Column */}
              <div>
                <Link href="/" className="flex items-center gap-2.5 mb-4">
                  <img src="/brand/logo.png" alt="impextech logo" className="w-8 h-8 object-contain bg-white rounded-md p-0.5" />
                  <span className="text-2xl font-black text-white tracking-tight">
                    impex<span className="text-red-600">tech</span>
                  </span>
                </Link>
                <p className="text-xs text-white/70 leading-relaxed mb-6">
                  Canada-certified refurbished and pre-owned gadgets. Thoroughly tested with 50+ diagnostic checks, documented battery health, and clean global IMEIs.
                </p>
                <div className="flex items-center gap-3">
                  <a 
                    href="https://x.com/impextech001" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="X"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href="https://www.instagram.com/impextech/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center text-white transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href="https://wa.me/2349060329221" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="WhatsApp"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center text-white transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  </a>
                </div>
              </div>

              {/* Shop Categories */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Shop Verified Tech</h4>
                <ul className="space-y-2.5 text-xs text-white/70">
                  <li><Link href="/products?category=phones" className="hover:text-white transition-colors">Phones & iPhones</Link></li>
                  <li><Link href="/products?category=laptops" className="hover:text-white transition-colors">MacBooks & PCs</Link></li>
                  <li><Link href="/products?category=headphones" className="hover:text-white transition-colors">AirPods & Headphones</Link></li>
                  <li><Link href="/products?category=smartwatches" className="hover:text-white transition-colors">Apple Watch & Smartwatches</Link></li>
                  <li><Link href="/products?category=cameras" className="hover:text-white transition-colors">Mirrorless Cameras</Link></li>
                  <li><Link href="/products?category=accessories" className="hover:text-white transition-colors">Chargers & Accessories</Link></li>
                </ul>
              </div>

              {/* The impextech Guarantee */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quality & Trust</h4>
                <ul className="space-y-2.5 text-xs text-white/70">
                  <li><Link href="/products" className="hover:text-white transition-colors">50+ Point Diagnostic Check</Link></li>
                  <li><Link href="/products" className="hover:text-white transition-colors">7-Day Money-Back Guarantee</Link></li>
                  <li><Link href="/products" className="hover:text-white transition-colors">Battery Health Standard (85%+)</Link></li>
                  <li><Link href="/products" className="hover:text-white transition-colors">Clean Global IMEI Verification</Link></li>
                  <li><Link href="/request" className="hover:text-white transition-colors">Custom Device Sourcing</Link></li>
                </ul>
              </div>

              {/* Direct Support & Location */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Direct Contact</h4>
                <ul className="space-y-3 text-xs text-white/70">
                  <li>Direct Canada Imports • Sourced from Toronto & Vancouver</li>
                  <li>
                    <a 
                      href="https://wa.me/2349060329221" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-emerald-400 font-bold hover:underline flex items-center gap-1.5"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-current" /> +234 906 032 9221
                    </a>
                  </li>
                  <li>Lagos, Nigeria • Nationwide Insured Delivery</li>
                  <li className="text-[11px] text-white/50 pt-2 border-t border-white/10">
                    Trusted across UNEC, UNN, IMT campuses & Nigerian tech professionals.
                  </li>
                </ul>
              </div>

            </div>

            <div className="container mx-auto max-w-7xl px-4 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
              <div>
                &copy; {new Date().getFullYear()} impextech. All rights reserved. Quality without breaking the bank.
              </div>
              <div className="flex items-center gap-4">
                <span>0% VAT (Nigeria Exempt)</span>
                <span>•</span>
                <span>Insured Nationwide Delivery</span>
              </div>
            </div>
          </footer>

          <WhatsAppButton />
          <AiConsultant />
        </Providers>
      </body>
    </html>
  );
}
