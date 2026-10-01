import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { XIcon } from '@/components/icons/XIcon';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { AiConsultant } from '@/components/chat/AiConsultant';
import { WhatsAppButton } from '@/components/chat/WhatsAppButton';

export const metadata: Metadata = {
  title: 'impextech | Canada-sourced Gadgets',
  description: 'Canada-sourced, verified, and guaranteed used gadgets.',
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
      <body className={`min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <Providers>
          {/* Top Announcement Bar (Swappie / Back Market style) */}
          <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3 mx-auto sm:mx-0">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Fresh Canada Batch Landed
                </span>
                <span className="hidden md:inline text-slate-600">•</span>
                <span className="hidden md:inline text-slate-300">50+ Hardware Inspection</span>
                <span className="hidden lg:inline text-slate-600">•</span>
                <span className="hidden lg:inline text-slate-300">7-Day Money-Back Guarantee</span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-400">
                <a href="https://wa.me/2349060329221" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current text-emerald-400" /> WhatsApp Concierge: +234 906 032 9221
                </a>
              </div>
            </div>
          </div>

          {/* Header */}
          <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                <img 
                  src="/brand/logo.png" 
                  alt="impextech logo" 
                  className="w-9 h-9 object-contain rounded-lg group-hover:scale-105 transition-transform" 
                />
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  impex<span className="text-red-600">tech</span>
                </span>
              </Link>
              
              {/* Desktop Nav Pills */}
              <nav className="hidden lg:flex gap-6 items-center text-sm font-semibold text-slate-700">
                <Link href="/products?category=phones" className="hover:text-red-600 transition-colors">Phones</Link>
                <Link href="/products?category=laptops" className="hover:text-red-600 transition-colors">Laptops</Link>
                <Link href="/products?category=headphones" className="hover:text-red-600 transition-colors">Headphones</Link>
                <Link href="/products?category=smartwatches" className="hover:text-red-600 transition-colors">Smartwatches</Link>
                <Link href="/products?category=cameras" className="hover:text-red-600 transition-colors">Cameras</Link>
                <Link href="/products?category=accessories" className="hover:text-red-600 transition-colors">Accessories</Link>
                <Link href="/request" className="text-red-600 hover:text-red-700 transition-colors font-bold pl-2 border-l border-slate-200">
                  Request Device
                </Link>
              </nav>

              {/* Actions & Social Badges */}
              <div className="flex items-center gap-3">
                {/* Social links (Desktop) */}
                <div className="hidden xl:flex items-center gap-2 border-r border-slate-200 pr-3">
                  <a 
                    href="https://x.com/impextech001" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Follow us on X"
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://www.instagram.com/impextech/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Follow us on Instagram"
                    className="p-2 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://wa.me/2349060329221" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Chat on WhatsApp"
                    className="p-2 text-slate-500 hover:text-[#25D366] hover:bg-emerald-50 rounded-full transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                  </a>
                </div>

                <Link href="/products" className="p-2 hover:bg-slate-100 rounded-full transition-colors relative" aria-label="Cart">
                  <ShoppingCart className="w-5 h-5 text-slate-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                </Link>
                <Link href="/products" className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Menu">
                  <Menu className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <Link href="/" className="flex items-center gap-2.5 mb-4">
                  <img src="/brand/logo.png" alt="impextech logo" className="w-8 h-8 object-contain bg-white rounded-md p-0.5" />
                  <span className="text-2xl font-bold text-white tracking-tight">
                    impex<span className="text-red-500">tech</span>
                  </span>
                </Link>
                <p className="text-sm text-slate-400 mb-6">
                  Canada-sourced, verified, and guaranteed used gadgets. Quality you can trust, right here in Nigeria.
                </p>
                {/* Social Buttons */}
                <div className="flex items-center gap-3">
                  <a 
                    href="https://x.com/impextech001" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="X Account"
                    className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://www.instagram.com/impextech/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Instagram Profile"
                    className="w-9 h-9 rounded-full bg-slate-800 hover:bg-pink-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://wa.me/2349060329221" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="WhatsApp"
                    className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#25D366] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/products" className="hover:text-red-400 transition-colors">All Products</Link></li>
                  <li><Link href="/request" className="hover:text-red-400 transition-colors">Request a Gadget</Link></li>
                  <li><Link href="/track" className="hover:text-red-400 transition-colors">Track Order</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="hover:text-red-400 transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-red-400 transition-colors">Contact</Link></li>
                  <li><Link href="/guarantee" className="hover:text-red-400 transition-colors">Our Guarantee</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Contact & Support</h3>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li>Lagos, Nigeria</li>
                  <li>
                    <a href="mailto:hello@impextech.com" className="hover:text-white transition-colors">
                      hello@impextech.com
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://wa.me/2349060329221" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#25D366] hover:underline flex items-center gap-1.5 font-medium"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-current" />
                      +234 906 032 9221
                    </a>
                  </li>
                  <li className="text-xs text-slate-500 pt-1">
                    Direct Canada Import Sourcing & Verification
                  </li>
                </ul>
              </div>
            </div>
            <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-sm text-slate-500 text-center">
              &copy; {new Date().getFullYear()} impextech. All rights reserved.
            </div>
          </footer>
          <WhatsAppButton />
          <AiConsultant />
        </Providers>
      </body>
    </html>
  );
}
