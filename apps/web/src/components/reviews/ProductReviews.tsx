'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Review, 
  getReviewsBySlug, 
  calculateAverageRating, 
  calculateRatingBreakdown 
} from '@/lib/reviews';
import { StarRating } from './StarRating';
import { RatingBreakdown } from './RatingBreakdown';
import { ReviewCard } from './ReviewCard';
import { ReviewSubmitForm } from './ReviewSubmitForm';
import { MessageSquare, ArrowUpDown, ChevronDown } from 'lucide-react';

export interface ProductReviewsProps {
  slug: string;
  productName: string;
}

type SortOption = 'recent' | 'helpful' | 'highest';

export function ProductReviews({ slug, productName }: ProductReviewsProps) {
  const seedReviews = useMemo(() => getReviewsBySlug(slug), [slug]);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [visibleCount, setVisibleCount] = useState<number>(3);

  // Load localStorage reviews on client mount
  useEffect(() => {
    try {
      const storageKey = `impextech_reviews_${slug}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Review[];
        if (Array.isArray(parsed)) {
          setLocalReviews(parsed);
        }
      }
    } catch (err) {
      console.warn('Could not read reviews from localStorage:', err);
    }
  }, [slug]);

  // Combine local and seed reviews, deduplicating by ID
  const allReviews = useMemo(() => {
    const map = new Map<string, Review>();
    // Prepend user-submitted reviews first
    localReviews.forEach((r) => map.set(r.id, r));
    seedReviews.forEach((r) => {
      if (!map.has(r.id)) {
        map.set(r.id, r);
      }
    });
    return Array.from(map.values());
  }, [localReviews, seedReviews]);

  // Sorted reviews
  const sortedReviews = useMemo(() => {
    const list = [...allReviews];
    if (sortBy === 'recent') {
      return list.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
    }
    if (sortBy === 'helpful') {
      return list.sort((a, b) => b.helpful - a.helpful);
    }
    if (sortBy === 'highest') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [allReviews, sortBy]);

  const averageRating = useMemo(() => calculateAverageRating(allReviews), [allReviews]);
  const breakdown = useMemo(() => calculateRatingBreakdown(allReviews), [allReviews]);
  const totalCount = allReviews.length;

  const handleReviewSubmitted = (newReview: Review) => {
    setLocalReviews((prev) => [newReview, ...prev]);
  };

  const visibleReviews = sortedReviews.slice(0, visibleCount);
  const hasMore = sortedReviews.length > visibleCount;

  return (
    <div id="customer-reviews" className="w-full">
      {/* 1. Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-50 text-red-600 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Customer Reviews
            </h2>
          </div>
          <div className="flex items-center gap-2.5 mt-2 text-xs sm:text-sm text-slate-600">
            <StarRating rating={averageRating} size="sm" />
            <span className="font-extrabold text-slate-900">
              {averageRating > 0 ? averageRating.toFixed(1) : '0.0'} out of 5
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">
              {totalCount} verified {totalCount === 1 ? 'buyer review' : 'buyer reviews'}
            </span>
          </div>
        </div>

        <a
          href="#write-review"
          className="inline-flex items-center justify-center text-xs font-bold px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors cursor-pointer w-fit"
        >
          Write a Review
        </a>
      </div>

      {/* Main Grid: Breakdown on left, Reviews list on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 2. Rating Breakdown on Left */}
        <div className="lg:col-span-5 space-y-4">
          <RatingBreakdown
            averageRating={averageRating}
            totalReviews={totalCount}
            breakdown={breakdown}
          />

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 text-xs text-slate-600 space-y-2.5 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm">
              The impextech Verified Standard
            </h4>
            <p className="leading-relaxed">
              Every review displayed is gathered from real customers across Nigeria who received Canada-sourced, 50-point diagnostic tested devices.
            </p>
          </div>
        </div>

        {/* 3 & 4. Sort Controls + Review Cards */}
        <div className="lg:col-span-7 space-y-5">
          {/* Sort Controls */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 p-2 sm:p-2.5 rounded-xl">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 ml-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /> Sort Reviews:
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSortBy('recent')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  sortBy === 'recent'
                    ? 'bg-[#2B2E35] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                Most Recent
              </button>
              <button
                type="button"
                onClick={() => setSortBy('helpful')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  sortBy === 'helpful'
                    ? 'bg-[#2B2E35] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                Most Helpful
              </button>
              <button
                type="button"
                onClick={() => setSortBy('highest')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  sortBy === 'highest'
                    ? 'bg-[#2B2E35] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                Highest Rated
              </button>
            </div>
          </div>

          {/* List of ReviewCard components */}
          {visibleReviews.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <p className="text-sm font-semibold text-slate-700">No customer reviews yet for this product.</p>
              <p className="text-xs text-slate-400 mt-1">Be the first verified buyer to share your feedback below!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          {/* 5. Load More Button if > 3 reviews */}
          {hasMore && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors shadow-xs cursor-pointer"
              >
                <span>Load More Reviews ({sortedReviews.length - visibleCount} remaining)</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6. Separator and ReviewSubmitForm at the bottom */}
      <div id="write-review" className="my-10 border-t border-slate-200/80" />

      <ReviewSubmitForm
        slug={slug}
        productName={productName}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
