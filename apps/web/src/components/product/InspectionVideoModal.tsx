'use client';

import { useState } from 'react';
import { 
  Play, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  BatteryCharging, 
  Smartphone, 
  Volume2, 
  Camera, 
  Wifi, 
  ExternalLink 
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { CatalogProduct } from '@/lib/catalog';

interface InspectionVideoModalProps {
  product: CatalogProduct;
}

export function InspectionVideoModal({ product }: InspectionVideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const checklistItems = [
    { label: 'Screen & Touch Grid', detail: 'Zero dead pixels, full multi-touch matrix verified', icon: Smartphone },
    { label: 'Battery Capacity Test', detail: `${product.batteryHealth}% verified capacity (minimum 85% guaranteed)`, icon: BatteryCharging },
    { label: 'Camera & Sensor Array', detail: 'AutoFocus, OIS stabilization & true tone calibrated', icon: Camera },
    { label: 'Speakers & Dual Mics', detail: 'Clean sound, zero crackle at maximum volume', icon: Volume2 },
    { label: 'GSMA Blacklist Verification', detail: `${product.imeiStatus} • Factory unlocked worldwide`, icon: ShieldCheck },
    { label: 'Radio & Network Signal', detail: 'MTN, Airtel, Glo, 9mobile 4G/5G verified', icon: Wifi },
  ];

  const waMessage = `Hello impextech, I'm viewing the Canada-imported ${product.name} (₦${product.priceNgn.toLocaleString()}). Could you send me the physical unboxing and battery test video for this exact unit?`;

  return (
    <>
      {/* Trigger Button on Product Page */}
      <button
        onClick={() => {
          setIsOpen(true);
          setIsPlaying(true);
        }}
        className="w-full group bg-slate-900 hover:bg-[#1E2127] text-white p-3.5 rounded-2xl flex items-center justify-between transition-all border border-slate-700/80 shadow-xs cursor-pointer mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-sm">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                Watch Canada Inspection Video
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-red-600/30 text-red-300 border border-red-500/30 px-1.5 py-0.2 rounded-full">
                Live Audit
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block">
              50+ Point Hardware & Battery Diagnostic Proof
            </span>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400 group-hover:text-white transition-colors">
          1:20 min ➔
        </span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Physical Hardware Inspection Audit
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {product.name} • Sourced from Canada
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsPlaying(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Video Player / Visual Audit Window */}
            <div className="relative bg-slate-950 aspect-video w-full flex items-center justify-center overflow-hidden">
              <img
                src={product.preview}
                alt={product.name}
                className="w-full h-full object-contain p-8 opacity-85 transition-opacity"
              />

              {/* Diagnostic HUD Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>DIAGNOSTIC LAB TORONTO</span>
                  </div>
                  <span className="text-[11px] bg-black/60 px-2 py-0.5 rounded border border-white/10 text-white">
                    CYCLE TEST #{product.id.slice(0, 6)}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                    <span>Battery Wear Test: Passed</span>
                    <span className="text-emerald-400 font-bold">{product.batteryHealth}% HEALTH</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                    <span>IMEI Registry Status</span>
                    <span className="text-emerald-400 font-bold">GSMA CLEAN & UNLOCKED</span>
                  </div>
                  <div className="w-full bg-slate-700/80 rounded-full h-1 overflow-hidden mt-2">
                    <div className="bg-red-600 h-1 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              </div>

              {/* Center Play Indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>
            </div>

            {/* Checklist & Sign-off Details */}
            <div className="p-5 sm:p-6 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Toronto Diagnostic Center Sign-Off
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {checklistItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5">
                      <div className="text-emerald-600 flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <strong className="text-xs text-slate-900 block font-bold">
                          {item.label}
                        </strong>
                        <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                          {item.detail}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Concierge Video Request */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <strong className="text-xs font-bold text-emerald-950 block">
                    Want a live unboxing video of this exact unit?
                  </strong>
                  <span className="text-[11px] text-emerald-700 block">
                    Our team will film a high-res video showing physical edges, screen, and battery settings.
                  </span>
                </div>

                <a
                  href={`https://wa.me/2349060329221?text=${encodeURIComponent(waMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors flex-shrink-0 shadow-xs"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  Request on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
