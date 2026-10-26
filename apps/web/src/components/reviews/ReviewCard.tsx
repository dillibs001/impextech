'use client';

import React, { useState } from 'react';
import { Review } from '@/lib/reviews';
import { StarRating } from './StarRating';
import { Check, ThumbsUp } from 'lucide-react';

export interface ReviewCardProps {
  review: Review;
  className?: string;
}

function formatPurchaseDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d);
  } catch {
    return dateString;
  }
}

export function ReviewCard({ review, className = '' }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);

  const formattedDate = formatPurchaseDate(review.purchaseDate);

  const mentionsCanada = 
    review.body.toLowerCase().includes('canada') || 
    review.title.toLowerCase().includes('canada') ||
    review.body.toLowerCase().includes('toronto');

  const handleHelpfulClick = () => {
    if (hasVoted) {
      setHelpfulCount((prev) => Math.max(0, prev - 1));
      setHasVoted(false);
    } else {
      setHelpfulCount((prev) => prev + 1);
      setHasVoted(true);
    }
  };

  const conditionColors = {
    Pristine: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    Excellent: 'bg-blue-50 text-blue-800 border-blue-200/80',
    Good: 'bg-amber-50 text-amber-800 border-amber-200/80',
  };

  return (
    <article className={`bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 ${className}`}>
      <div>
        {/* Header: User Info, Verified Badge, Date */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Reviewer Avatar initials */}
            <div className="w-8 h-8 rounded-full bg-[#2B2E35] text-white flex items-center justify-center font-bold text-xs uppercase select-none">
              {review.reviewerName.charAt(0)}
            </div>

            {/* Name + City */}
            <span className="font-bold text-slate-900 text-sm">
              {review.reviewerName} — {review.reviewerCity}
            </span>

            {/* Verified Buyer Badge */}
            {review.isVerifiedBuyer && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3 stroke-[3]" /> Verified Buyer
              </span>
            )}
          </div>

          {/* Formatted Date */}
          <time dateTime={review.purchaseDate} className="text-xs text-slate-400 font-medium">
            {formattedDate}
          </time>
        </div>

        {/* Stars and Condition Badge */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <StarRating rating={review.rating} size="sm" />
          
          <span className={`text-[11px] font-semibold border px-2 py-0.5 rounded-md ${conditionColors[review.deviceConditionActual] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
            As Received: {review.deviceConditionActual}
          </span>

          {/* Canada origin note if mentioned */}
          {mentionsCanada && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200/70 px-2 py-0.5 rounded-md">
              <span className="text-red-600">🍁</span> Canada origin
            </span>
          )}
        </div>

        {/* Title in bold */}
        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-2">
          {review.title}
        </h4>

        {/* Body text */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {review.body}
        </p>
      </div>

      {/* Footer: Helpful button */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Was this review helpful to you?
        </span>

        <button
          type="button"
          onClick={handleHelpfulClick}
          aria-label={`Mark as helpful. Currently ${helpfulCount} votes`}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            hasVoted
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-red-600' : ''}`} />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </article>
  );
}
