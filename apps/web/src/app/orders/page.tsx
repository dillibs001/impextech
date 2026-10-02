'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCustomerOrders, CustomerOrder } from '@/lib/orders';
import { Package, Clock, ShieldCheck, ArrowLeft, ExternalLink, BatteryCharging } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

export default function OrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setOrders(getCustomerOrders());
    setIsLoaded(true);
  }, []);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val);

  if (!isLoaded) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center text-slate-400">
          Loading your order history...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/products" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                My Orders
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Track and inspect all your Canada-imported device orders.
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 border border-red-100 px-3.5 py-2 rounded-xl transition-colors"
          >
            Browse More Gadgets
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-xs">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No orders placed yet</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              When you order via Paystack or WhatsApp, your order reference and receipt will appear here.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#2B2E35] hover:bg-[#1E2127] text-white text-xs font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Browse Canada Inventory
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const statusColor =
                order.status === 'Paid'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : order.status === 'Confirmed'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200';

              const waMessage = `Hello impextech, I'm following up on my order ${order.id} (${order.items.map(i => i.name).join(', ')}).`;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          {order.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusColor}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(order.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span>Payment via {order.method}</span>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/2349060329221?text=${encodeURIComponent(waMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-current text-emerald-600" />
                      Track on WhatsApp
                    </a>
                  </div>

                  {/* Order Items */}
                  <div className="py-5 divide-y divide-slate-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl p-1 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={item.preview}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="bg-[#2B2E35] text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                              {item.condition}
                            </span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                              <BatteryCharging className="w-3 h-3 text-emerald-600" />
                              {item.batteryHealth}% Batt
                            </span>
                            <span>•</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs sm:text-sm font-black text-slate-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                    <div className="text-slate-500">
                      <strong>Delivery to:</strong> {order.customer.firstName} {order.customer.lastName} •{' '}
                      {order.customer.address}, {order.customer.cityState} ({order.customer.phone})
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-500">Total:</span>
                      <span className="text-base font-black text-slate-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
