import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { AiConsultant } from '@/components/chat/AiConsultant';

export const metadata: Metadata = {
  title: 'impextech | Canada-sourced Gadgets',
  description: 'Canada-sourced, verified, and guaranteed used gadgets.',
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
              {/* Logo */}
              <Link href="/" className="text-2xl font-bold text-emerald-600 tracking-tight">
                impextech
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
                <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                <Link href="/products" className="hover:text-emerald-600 transition-colors">Products</Link>
                <Link href="/request" className="hover:text-emerald-600 transition-colors">Request a Gadget</Link>
                <Link href="/about" className="hover:text-emerald-600 transition-colors">About</Link>
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://www.instagram.com/impextech/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-full"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-600" />
                  <span>@impextech</span>
                </a>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                </button>
                <button className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
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
                <Link href="/" className="text-2xl font-bold text-white tracking-tight mb-4 inline-block">
                  impextech
                </Link>
                <p className="text-sm text-slate-400 mb-4">
                  Canada-sourced, verified, and guaranteed used gadgets. Quality you can trust, right here in Nigeria.
                </p>
                <a 
                  href="https://www.instagram.com/impextech/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors font-medium"
                >
                  <InstagramIcon className="w-5 h-5" />
                  <span>Follow @impextech</span>
                </a>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/products" className="hover:text-emerald-400 transition-colors">All Products</Link></li>
                  <li><Link href="/request" className="hover:text-emerald-400 transition-colors">Request a Gadget</Link></li>
                  <li><Link href="/track" className="hover:text-emerald-400 transition-colors">Track Order</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
                  <li><Link href="/guarantee" className="hover:text-emerald-400 transition-colors">Our Guarantee</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Contact & Social</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>Lagos, Nigeria</li>
                  <li>hello@impextech.com</li>
                  <li>+234 123 456 7890</li>
                  <li className="pt-2">
                    <a 
                      href="https://www.instagram.com/impextech/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-emerald-400 hover:underline flex items-center gap-1.5"
                    >
                      <InstagramIcon className="w-4 h-4" /> instagram.com/impextech
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-sm text-slate-500 text-center">
              &copy; {new Date().getFullYear()} impextech. All rights reserved.
            </div>
          </footer>
          <AiConsultant />
        </Providers>
      </body>
    </html>
  );
}
