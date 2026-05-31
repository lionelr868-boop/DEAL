'use client';

import { motion } from 'framer-motion';

/**
 * SkeletonCard - Reusable skeleton loading card with 3 variants.
 * Uses GPU-accelerated gradient shimmer animation.
 */
export function SkeletonCard({
  variant = 'service',
  count = 4,
}: {
  variant?: 'service' | 'product' | 'equipment';
  count?: number;
}) {
  const cards = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {cards.map((i) => (
        <motion.div
          key={`skeleton-${variant}-${i}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="card-3d rounded-2xl overflow-hidden bg-white shadow-sm"
        >
          {/* Image area skeleton */}
          <div className="relative h-40 bg-gray-100 skeleton-shimmer overflow-hidden">
            {/* Dot pattern overlay */}
            <div className="card-dot-pattern" />
            {/* Center icon placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-200/60 skeleton-shimmer" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="h-4 rounded-full bg-gray-100 skeleton-shimmer w-full" />
            <div className="h-4 rounded-full bg-gray-100 skeleton-shimmer w-3/4" />

            {/* Provider/merchant info */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-100 skeleton-shimmer flex-shrink-0" />
              <div className="h-3 rounded-full bg-gray-100 skeleton-shimmer w-24" />
            </div>

            {/* Rating stars */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="w-4 h-4 rounded-full bg-gray-100 skeleton-shimmer" />
              ))}
              <div className="w-8 h-3 rounded-full bg-gray-100 skeleton-shimmer ms-1" />
            </div>

            {/* Variant-specific extras */}
            {variant === 'equipment' && (
              <div className="flex rounded-lg overflow-hidden h-7">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex-1 bg-gray-100 skeleton-shimmer" />
                ))}
              </div>
            )}

            {/* Price and CTA */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <div className="h-8 w-20 rounded-lg bg-gray-100 skeleton-shimmer" />
              <div className="h-8 w-16 rounded-lg bg-gray-100 skeleton-shimmer" />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}
