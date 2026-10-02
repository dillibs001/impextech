'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, BatteryCharging, Award } from 'lucide-react';

interface ProductImageCarouselProps {
  images: string[];
  name: string;
  condition: string;
  batteryHealth: number;
}

export function ProductImageCarousel({
  images,
  name,
  condition,
  batteryHealth,
}: ProductImageCarouselProps) {
  const safeImages = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const prevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Main Image Showcase */}
      <div className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-6 overflow-hidden group select-none">
        <img
          src={safeImages[selectedIndex]}
          alt={`${name} - Photo ${selectedIndex + 1}`}
          className="max-h-[380px] w-full object-contain transition-all duration-300 group-hover:scale-105"
        />

        {/* Badges on preview */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
          <span className="bg-[#2B2E35] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-xs">
            Grade: {condition}
          </span>
          <span className="bg-red-50 text-red-600 border border-red-100 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <Award className="w-3.5 h-3.5" /> Canada Certified
          </span>
        </div>

        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 flex items-center gap-1 shadow-sm z-10 pointer-events-none">
          <BatteryCharging className="w-4 h-4 text-emerald-600" /> {batteryHealth}% Battery Health
        </div>

        {/* Photo Counter Pill */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full z-10 pointer-events-none">
            {selectedIndex + 1} / {safeImages.length}
          </div>
        )}

        {/* Carousel Arrow Controls */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
          {safeImages.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-50 border transition-all flex-shrink-0 cursor-pointer p-1.5 flex items-center justify-center ${
                  isSelected
                    ? 'border-red-600 ring-2 ring-red-500/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
