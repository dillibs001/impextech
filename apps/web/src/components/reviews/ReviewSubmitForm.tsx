'use client';

import React, { useState } from 'react';
import { Review } from '@/lib/reviews';
import { StarRating } from './StarRating';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export interface ReviewSubmitFormProps {
  slug: string;
  productName: string;
  onReviewSubmitted?: (review: Review) => void;
  className?: string;
}

const NIGERIAN_CITIES = [
  'Lagos',
  'Abuja',
  'Port Harcourt',
  'Kano',
  'Ibadan',
  'Enugu',
  'Other',
];

const CONDITIONS: ('Pristine' | 'Excellent' | 'Good')[] = [
  'Pristine',
  'Excellent',
  'Good',
];

export function ReviewSubmitForm({
  slug,
  productName,
  onReviewSubmitted,
  className = '',
}: ReviewSubmitFormProps) {
  const [name, setName] = useState('');
  const [city, setCity] = useState(NIGERIAN_CITIES[0]);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [condition, setCondition] = useState<'Pristine' | 'Excellent' | 'Good'>('Pristine');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Please provide your name (minimum 2 characters)';
    }

    if (!city) {
      errs.city = 'Please select your city';
    }

    if (rating < 1 || rating > 5) {
      errs.rating = 'Please select a rating between 1 and 5 stars';
    }

    if (!title.trim() || title.trim().length < 3) {
      errs.title = 'Please enter a review headline (minimum 3 characters)';
    } else if (title.length > 80) {
      errs.title = 'Headline must be 80 characters or fewer';
    }

    if (rating < 3) {
      if (!body.trim() || body.trim().length < 15) {
        errs.body = 'For ratings below 3 stars, please provide details on what went wrong (min 15 characters)';
      }
    } else {
      if (!body.trim() || body.trim().length < 10) {
        errs.body = 'Please write a brief review description (min 10 characters)';
      }
    }

    if (body.length > 500) {
      errs.body = 'Review text must be 500 characters or fewer';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const storageKey = `impextech_reviews_${slug}`;
      const newReview: Review = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productSlug: slug,
        reviewerName: name.trim(),
        reviewerCity: city,
        rating,
        title: title.trim(),
        body: body.trim(),
        purchaseDate: new Date().toISOString(),
        isVerifiedBuyer: true,
        helpful: 0,
        deviceConditionActual: condition,
      };

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(storageKey);
        let existing: Review[] = [];
        if (stored) {
          try {
            existing = JSON.parse(stored) as Review[];
          } catch {
            existing = [];
          }
        }
        localStorage.setItem(storageKey, JSON.stringify([newReview, ...existing]));
      }

      onReviewSubmitted?.(newReview);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error saving review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setCity(NIGERIAN_CITIES[0]);
    setRating(5);
    setTitle('');
    setBody('');
    setCondition('Pristine');
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className={`bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center ${className}`}>
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Thank you! Your review has been submitted for verification.
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
          Your feedback helps other Nigerian shoppers find verified pre-owned Canada electronics with full confidence.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Submit another review
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Write a Customer Review
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Share your experience with this Canada-imported <span className="font-semibold text-slate-800">{productName}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Rating Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Overall Rating <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-3">
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onChange={(newRating) => {
                setRating(newRating);
                if (errors.rating) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.rating;
                    return next;
                  });
                }
              }}
            />
            <span className="text-sm font-bold text-slate-800">
              {rating} of 5 Stars
            </span>
          </div>
          {errors.rating && (
            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.rating}
            </p>
          )}
        </div>

        {/* Row: Name and City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reviewerName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Your Name <span className="text-red-600">*</span>
            </label>
            <input
              id="reviewerName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.name;
                    return next;
                  });
                }
              }}
              placeholder="e.g. Adebayo T."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                errors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="reviewerCity" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              City in Nigeria <span className="text-red-600">*</span>
            </label>
            <select
              id="reviewerCity"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              {NIGERIAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Condition Received */}
        <div>
          <label htmlFor="deviceCondition" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Device Condition As Received <span className="text-red-600">*</span>
          </label>
          <select
            id="deviceCondition"
            value={condition}
            onChange={(e) => setCondition(e.target.value as 'Pristine' | 'Excellent' | 'Good')}
            className="w-full sm:w-1/2 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          >
            {CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>
                {cond} Grade
              </option>
            ))}
          </select>
        </div>

        {/* Headline / Title */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="reviewTitle" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Review Title <span className="text-red-600">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {title.length}/80 characters
            </span>
          </div>
          <input
            id="reviewTitle"
            type="text"
            maxLength={80}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.title;
                  return next;
                });
              }
            }}
            placeholder="e.g. Pristine battery and fast delivery to Lagos"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
              errors.title ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
            }`}
          />
          {errors.title && (
            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.title}
            </p>
          )}
        </div>

        {/* Body Textarea */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="reviewBody" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Review Description <span className="text-red-600">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {body.length}/500 characters
            </span>
          </div>
          <textarea
            id="reviewBody"
            rows={4}
            maxLength={500}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              if (errors.body) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.body;
                  return next;
                });
              }
            }}
            placeholder="Tell us about the cosmetic condition, battery health, IMEI verification, delivery time, and overall Naira value..."
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
              errors.body ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
            }`}
          />
          {errors.body && (
            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.body}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm py-3 px-8 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Submitting Review...' : 'Submit Verified Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
