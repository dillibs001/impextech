'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Package, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Clock, 
  LogOut, 
  ExternalLink, 
  BatteryCharging, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Plane,
  Save,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getCustomerOrders, CustomerOrder } from '@/lib/orders';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, updateProfile, logout } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Address form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cityState, setCityState] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCityState(user.cityState || '');
    }
    setOrders(getCustomerOrders());
  }, [user]);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      cityState: cityState.trim(),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          <p className="text-xs font-semibold">Loading your impextech dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Sign in to view your account</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Please log in or create an account to view your Canada order history, track shipments in real time, and manage delivery addresses.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/login?redirect=/account"
              className="w-full py-3 px-4 bg-[#2B2E35] hover:bg-[#1E2127] text-white rounded-xl text-xs font-bold transition-colors text-center"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/login?mode=register&redirect=/account"
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors text-center"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-[#2B2E35] text-white flex items-center justify-center text-xl font-black shadow-sm flex-shrink-0">
                {user.firstName.charAt(0).toUpperCase()}{user.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {user.firstName} {user.lastName}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/80">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Member
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={async () => {
                await logout();
                router.push('/');
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
                <Package className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xl font-black text-slate-900">{orders.length}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Shipments</span>
                <Plane className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-xl font-black text-slate-900">
                {orders.filter(o => o.status === 'Paid' || o.status === 'Confirmed').length}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Coverage</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xs font-bold text-emerald-700 mt-1">7-Day Warranty Active</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sourcing Board</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <Link href="/request" className="text-xs font-bold text-red-600 hover:underline mt-1 block">
                Option A Eligible →
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Recent Orders & Canada Shipments (2 cols on large) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Orders & Shipments</h2>
                <p className="text-xs text-slate-500">Live progress tracking from Canada to your Nigerian address</p>
              </div>
              <Link
                href="/orders"
                className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors"
              >
                View Full Timeline
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xs">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">No orders yet</h3>
                <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                  When you order via Paystack or WhatsApp, your order will automatically appear here with live tracking.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[#2B2E35] hover:bg-[#1E2127] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors"
                >
                  Browse Canada Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusColor =
                    order.status === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : order.status === 'Confirmed'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200';

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900">{order.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                              {order.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{order.date}</span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-sm font-black text-slate-900">{formatPrice(order.total)}</span>
                          <span className="block text-[10px] text-slate-400 capitalize">{order.method} checkout</span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="py-4 space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.preview}
                                alt={item.name}
                                className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 p-1"
                              />
                              <div>
                                <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                  <span>Qty: {item.quantity}</span>
                                  <span>•</span>
                                  <span className="text-emerald-700 font-semibold">{item.condition}</span>
                                  {item.batteryHealth > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-0.5 font-bold text-emerald-600">
                                        <BatteryCharging className="w-3 h-3" />
                                        {item.batteryHealth}%
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-700">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <Link
                          href="/orders"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-red-600 transition-colors"
                        >
                          <Plane className="w-3.5 h-3.5 text-red-600" />
                          <span>Track Canada Transit</span>
                        </Link>

                        <a
                          href={`https://wa.me/2349060329221?text=Hello%20impextech,%20I'm%20inquiring%20about%20my%20order%20${order.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                        >
                          <WhatsAppIcon className="w-3 h-3 fill-current" />
                          <span>WhatsApp Update</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Saved Delivery Details & Sourcing Info */}
          <div className="space-y-6">
            
            {/* Saved Delivery Address Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-black text-slate-900">Saved Delivery Details</h3>
              </div>
              <p className="text-[11px] text-slate-500 mb-4">
                These details will automatically pre-fill on checkout for rapid 1-click orders.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0801 234 5678"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Delivery Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 15 Admiralty Way, Lekki Phase 1"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">City & State</label>
                  <input
                    type="text"
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    placeholder="e.g. Lagos, Lagos State"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-2.5 px-4 bg-[#2B2E35] hover:bg-[#1E2127] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'Address Saved Successfully!' : 'Save Delivery Address'}</span>
                </button>
              </form>
            </div>

            {/* Custom Sourcing Callout */}
            <div className="bg-gradient-to-br from-[#2B2E35] to-[#1E2127] text-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Custom Sourcing Board</span>
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">
                Can&apos;t find your exact spec?
              </h4>
              <p className="text-xs text-white/70 mb-4 leading-relaxed">
                Commit a ₦5,000 deposit and our Canada sourcing desk will personally hunt down your specific MacBook, iPhone, or camera within 48 hours. 100% credited to your purchase.
              </p>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl transition-colors w-full justify-center"
              >
                <span>Request Custom Device</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Direct WhatsApp Concierge Support */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 mb-1">Direct WhatsApp Support</h4>
              <p className="text-[11px] text-slate-500 mb-4">
                Have questions regarding IMEI checks, battery health reports, or delivery timings?
              </p>
              <a
                href="https://wa.me/2349060329221"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                <span>Chat with Specialist</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
