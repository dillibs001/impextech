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
          {/* Header */}
          <header className="bg-white border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <img 
                  src="/brand/logo.png" 
                  alt="impextech logo" 
                  className="w-9 h-9 object-contain rounded-lg group-hover:scale-105 transition-transform" 
                />
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  impex<span className="text-red-600">tech</span>
                </span>
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
                <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
                <Link href="/products" className="hover:text-red-600 transition-colors">Products</Link>
                <Link href="/request" className="hover:text-red-600 transition-colors">Request a Gadget</Link>
                <Link href="/about" className="hover:text-red-600 transition-colors">About</Link>
              </nav>

              {/* Actions & Social Badges */}
              <div className="flex items-center gap-3">
                {/* Social links (Desktop) */}
                <div className="hidden lg:flex items-center gap-2 border-r border-slate-200 pr-3">
                  <a 
                    href="https://x.com/impextech001" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Follow us on X"
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://www.instagram.com/impextech/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Follow us on Instagram"
                    className="p-2 text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://wa.me/2349060329221" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Chat on WhatsApp"
                    className="p-2 text-slate-600 hover:text-[#25D366] hover:bg-emerald-50 rounded-full transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                  </a>
                </div>

                <Link href="/products" className="p-2 hover:bg-slate-100 rounded-full transition-colors relative" aria-label="Cart">
                  <ShoppingCart className="w-5 h-5 text-slate-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                </Link>
                <Link href="/products" className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Menu">
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
