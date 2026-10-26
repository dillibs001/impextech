import React from 'react';
import { StarRating } from './StarRating';
import { ShieldCheck } from 'lucide-react';

export interface RatingBreakdownProps {
  averageRating: number;
  totalReviews: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  className?: string;
}

export function RatingBreakdown({
  averageRating,
  totalReviews,
  breakdown,
  className = '',
}: RatingBreakdownProps) {
  const stars: (1 | 2 | 3 | 4 | 5)[] = [5, 4, 3, 2, 1];

  return (
    <div className={`bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 sm:p-7 ${className}`}>
      {/* Average Rating Big Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Overall Rating
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
            </span>
            <div className="flex flex-col">
              <StarRating rating={averageRating} size="md" />
              <span className="text-xs text-slate-500 font-medium mt-1">
                {totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/60 shadow-xs text-xs text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-800">100% Real Buyer Verified</span>
        </div>
      </div>

      {/* 5-Star to 1-Star Distribution Bars */}
      <div className="space-y-3 mt-6">
        {stars.map((star) => {
          const count = breakdown[star] || 0;
          const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

          return (
            <div key={star} className="flex items-center gap-3 text-xs">
              {/* Star Label */}
              <span className="w-12 text-slate-700 font-semibold shrink-0">
                {star} star
              </span>

              {/* Progress Bar Track */}
              <div className="flex-1 h-2 bg-slate-200/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Count and Percentage */}
              <div className="w-14 text-right text-slate-500 font-medium shrink-0">
                <span>{count}</span>
                <span className="text-[10px] text-slate-400 ml-1">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
