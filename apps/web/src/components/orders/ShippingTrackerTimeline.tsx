'use client';

import { useState } from 'react';
import { 
  CheckCircle2, 
  Plane, 
  Truck, 
  ShieldCheck, 
  Package, 
  ClipboardCheck, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { CustomerOrder } from '@/lib/orders';

interface ShippingTrackerTimelineProps {
  order: CustomerOrder;
}

interface TrackingStep {
  step: number;
  title: string;
  subtitle: string;
  location: string;
  icon: typeof Package;
  details: string;
  estimate: string;
}

export function ShippingTrackerTimeline({ order }: ShippingTrackerTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Compute realistic shipping stage based on order status or elapsed time
  // Default to step 2 (Quality Inspected in Canada) for newly placed orders, or step 3 if paid
  const currentStep = order.status === 'Paid' ? 3 : order.status === 'Dispatched' ? 5 : 2;

  const steps: TrackingStep[] = [
    {
      step: 1,
      title: 'Order Confirmed & Logged',
      subtitle: 'Serial & IMEI reserved in Toronto stockroom',
      location: 'impextech Operations Hub, Toronto, ON',
      icon: CheckCircle2,
      details: 'Customer order confirmed, device physical serial and factory-unlocked clean IMEI locked to your invoice.',
      estimate: 'Day 1'
    },
    {
      step: 2,
      title: '50-Point Hardware Lab Check',
      subtitle: 'Battery health, touch grid, thermal & sensor audit',
      location: 'Canada Diagnostic Facility, Toronto, ON',
      icon: ClipboardCheck,
      details: 'Certified technician runs comprehensive diagnostic software: minimum 85% battery capacity confirmed, biometric FaceID/TouchID validated, clean GSMA international blacklist check passed.',
      estimate: 'Day 1–2'
    },
    {
      step: 3,
      title: 'Export Packaging & Air Cargo Booking',
      subtitle: 'Vacuum-sealed anti-static transit protection',
      location: 'Toronto Pearson International (YYZ)',
      icon: Package,
      details: 'Unit packed with shock-absorbent aerospace foam and palletized for temperature-controlled air freight.',
      estimate: 'Day 2–3'
    },
    {
      step: 4,
      title: 'Transatlantic Air Cargo In-Flight',
      subtitle: 'Air Express Cargo en route to West Africa',
      location: 'Transatlantic Flight Corridor (YYZ → LOS)',
      icon: Plane,
      details: 'Commercial cargo transit across Atlantic airspace direct to Lagos cargo terminal.',
      estimate: 'Day 3–4'
    },
    {
      step: 5,
      title: 'Lagos Customs Clearance (NAHCO)',
      subtitle: 'Cleared and duty processed through Nigerian customs',
      location: 'Murtala Muhammed Int’l Airport (LOS), Lagos',
      icon: ShieldCheck,
      details: 'Customs assessment completed, import duties stamped, and package cleared through security scanner to local intake.',
      estimate: 'Day 4–5'
    },
    {
      step: 6,
      title: 'Out for Insured Nationwide Delivery',
      subtitle: 'Handed over to priority dispatch courier',
      location: `${order.customer.cityState}, Nigeria`,
      icon: Truck,
      details: `Dispatched for last-mile delivery to ${order.customer.address}. Driver will call recipient on ${order.customer.phone}.`,
      estimate: 'Day 5–6'
    },
    {
      step: 7,
      title: 'Delivered & 7-Day Guarantee Active',
      subtitle: '7-Day Money-Back Guarantee officially starts',
      location: 'Customer Doorstep',
      icon: Sparkles,
      details: 'Package delivered intact. Your 7-Day Money-Back Guarantee and hardware warranty begins today.',
      estimate: 'Day 6–7'
    }
  ];

  const activeStepData = steps[currentStep - 1] || steps[0];
  const progressPercent = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      {/* Visual Tracking Summary Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-600/30 text-red-300 border border-red-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
              Canada ➔ Nigeria Logistics
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-mono font-medium text-slate-300">
              Flight Tracking Stage {currentStep} of {steps.length}
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors self-start sm:self-auto bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg"
          >
            <span>{isExpanded ? 'Hide Full Log' : 'View Checkpoints'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Current Active Status Callout */}
        <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-400">
            <activeStepData.icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight">
                {activeStepData.title}
              </h4>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {activeStepData.subtitle}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5">
              <MapPin className="w-3 h-3 text-red-400" />
              <span>{activeStepData.location}</span>
            </div>
          </div>
        </div>

        {/* Horizontal Mini Step Visual Indicator */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold text-slate-400">
            <span>Toronto Hub</span>
            <span className="text-red-400 font-mono">Transit Progress: {progressPercent}%</span>
            <span>{order.customer.cityState}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
            <div 
              className="bg-gradient-to-r from-red-500 via-orange-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expandable Step-by-Step Checkpoint List */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Detailed Import & Inspection Checkpoints
          </h5>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {steps.map((st) => {
              const isPast = st.step < currentStep;
              const isCurrent = st.step === currentStep;
              const isFuture = st.step > currentStep;

              const StepIcon = st.icon;

              return (
                <div key={st.step} className="relative group">
                  {/* Step Dot / Icon */}
                  <div 
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isPast 
                        ? 'bg-emerald-600 text-white' 
                        : isCurrent 
                        ? 'bg-red-600 text-white ring-4 ring-red-100 animate-pulse' 
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isPast ? '✓' : st.step}
                  </div>

                  <div className={`p-3 rounded-xl border transition-all ${
                    isCurrent 
                      ? 'bg-red-50/50 border-red-200 shadow-xs' 
                      : isPast 
                      ? 'bg-white border-slate-200/80' 
                      : 'bg-slate-50/50 border-slate-100 opacity-60'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <StepIcon className={`w-4 h-4 ${isCurrent ? 'text-red-600' : isPast ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <h6 className={`text-xs font-bold ${isCurrent ? 'text-red-950' : 'text-slate-900'}`}>
                          {st.title}
                        </h6>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-medium">
                        {st.estimate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {st.details}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{st.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
