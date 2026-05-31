'use client';

import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  reviewCount?: number;
  showCount?: boolean;
}

const sizeMap = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
};

export default function RatingStars({ rating, size = 'md', reviewCount, showCount = true }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={`${sizeMap[size]} fill-deal-gold text-deal-gold`} />
        ))}
        {hasHalf && (
          <div className="relative">
            <Star className={`${sizeMap[size]} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${sizeMap[size]} fill-deal-gold text-deal-gold`} />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${sizeMap[size]} text-gray-300`} />
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground mr-1">
          {rating} ({reviewCount})
        </span>
      )}
    </div>
  );
}
