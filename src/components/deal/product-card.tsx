'use client';

import { motion } from 'framer-motion';
import { Store, PackageCheck, PackageX } from 'lucide-react';
import { useI18n } from '@/lib/store';
import RatingStars from './rating-stars';
import type { ProductItem } from '@/lib/data/mock';

interface ProductCardProps {
  product: ProductItem;
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const gradients = [
  'from-deal-teal/20 to-deal-teal-light/10',
  'from-deal-orange/20 to-deal-gold/10',
  'from-deal-teal/10 to-deal-gold/10',
  'from-deal-teal-light/20 to-deal-orange/10',
];

const unitLabels: Record<string, Record<string, string>> = {
  bag: { ar: 'كيس', fr: 'sac' },
  m3: { ar: 'م³', fr: 'm³' },
  bar: { ar: 'قضيب', fr: 'barre' },
  piece: { ar: 'قطعة', fr: 'pièce' },
  roll: { ar: 'لفة', fr: 'rouleau' },
  sheet: { ar: 'لوح', fr: 'panneau' },
  bucket: { ar: 'دلو', fr: 'seau' },
  set: { ar: 'طقم', fr: 'jeu' },
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { getLocalizedValue, t, locale } = useI18n();
  const gradient = gradients[index % gradients.length];
  const unitLabel = unitLabels[product.unit]?.[locale] || product.unit;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="card-3d rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl"
    >
      {/* Image placeholder with gradient */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <div className="absolute inset-0 hero-pattern opacity-40" />
        <div className="relative w-16 h-16 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-lg">
          <PackageCheck className="w-8 h-8 text-deal-teal" />
        </div>

        {/* Category badge */}
        <div className="absolute top-3 start-3">
          <span className="badge-3d bg-deal-teal text-white text-[10px]">
            {getLocalizedValue(product.categoryName, product.categoryNameFr)}
          </span>
        </div>

        {/* Stock badge */}
        <div className="absolute top-3 end-3">
          {product.stock > 0 ? (
            <span className="badge-3d bg-emerald-500 text-white text-[10px] flex items-center gap-1">
              <PackageCheck className="w-3 h-3" />
              {t.products.inStock}
            </span>
          ) : (
            <span className="badge-3d bg-red-500 text-white text-[10px] flex items-center gap-1">
              <PackageX className="w-3 h-3" />
              {t.products.outOfStock}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-sm leading-tight text-deal-navy line-clamp-2 min-h-[2.5rem]">
          {getLocalizedValue(product.title, product.titleFr)}
        </h3>

        {/* Merchant info */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-deal-orange/10 flex items-center justify-center flex-shrink-0">
            <Store className="w-3.5 h-3.5 text-deal-orange" />
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {getLocalizedValue(product.merchantName, product.merchantNameFr)}
          </span>
        </div>

        {/* Rating */}
        <RatingStars rating={product.rating} size="sm" reviewCount={product.totalReviews} />

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-sm font-black text-deal-teal">
              {product.price.toLocaleString()} {t.common.currency}
            </span>
            <span className="text-[10px] text-muted-foreground">
              / {unitLabel}
            </span>
          </div>
          <button className="btn-3d-sm btn-3d-teal text-white text-xs">
            {t.products.buyNow}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
