'use client';

import React, { useState } from 'react';

export interface StarRatingProps {
  rating: number; // can be decimal like 4.7
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const STAR_PATH = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';

const SIZE_CONFIG = {
  sm: { px: 16, class: 'w-4 h-4' },
  md: { px: 20, class: 'w-5 h-5' },
  lg: { px: 28, class: 'w-7 h-7' },
};

export function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onChange,
  className = '',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;
  const config = SIZE_CONFIG[size] || SIZE_CONFIG.md;

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      onMouseLeave={() => {
        if (interactive) setHoverRating(null);
      }}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Rating selector' : `${rating} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const starValue = index + 1;
        let fillPct = 0;

        if (displayRating >= starValue) {
          fillPct = 100;
        } else if (displayRating <= index) {
          fillPct = 0;
        } else {
          fillPct = Math.max(0, Math.min(100, Math.round((displayRating - index) * 100)));
        }

        const starElement = (
          <div
            className="relative shrink-0 flex items-center justify-center select-none"
            style={{ width: config.px, height: config.px }}
          >
            {/* Background empty star */}
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full"
              style={{ fill: '#E2E8F0' }}
              aria-hidden="true"
            >
              <path d={STAR_PATH} />
            </svg>

            {/* Foreground filled star with width clip */}
            {fillPct > 0 && (
              <div
                className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
                style={{ width: `${fillPct}%` }}
              >
                <svg
                  viewBox="0 0 24 24"
                  style={{ width: config.px, height: config.px, minWidth: config.px, fill: '#DC2626' }}
                  className="h-full"
                  aria-hidden="true"
                >
                  <path d={STAR_PATH} />
                </svg>
              </div>
            )}
          </div>
        );

        if (interactive) {
          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={Math.round(rating) === starValue}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
              onClick={() => onChange?.(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              className="p-1 -m-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded transition-transform hover:scale-115 active:scale-95 cursor-pointer"
            >
              {starElement}
            </button>
          );
        }

        return <React.Fragment key={index}>{starElement}</React.Fragment>;
      })}
    </div>
  );
}
