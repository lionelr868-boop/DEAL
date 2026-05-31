'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Store, PackageCheck, PackageX, Heart, Zap, Flame, Share2 } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import RatingStars from './rating-stars';
import type { ProductItem } from '@/lib/data/mock';

interface ProductCardProps {
  product: ProductItem;
  index?: number;
}

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
  const { setDetailType, setSelectedItemId, setShowDetailModal } = useAppStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [heartBounce, setHeartBounce] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [glowBorder, setGlowBorder] = useState(false);
  const gradient = gradients[index % gradients.length];
  const unitLabel = unitLabels[product.unit]?.[locale] || product.unit;

  const showNewBadge = index % 4 === 0;
  const showPopularBadge = !showNewBadge && index % 7 === 0;
  const showRibbon = index < 2;

  const tooltipFavorite = locale === 'ar' ? 'إضافة للمفضلة' : 'Ajouter aux favoris';
  const tooltipShare = locale === 'ar' ? 'مشاركة' : 'Partager';

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
      boxShadow: `${(x - centerX) * -0.1}px ${(centerY - y) * -0.1}px 24px rgba(0, 0, 0, 0.12), 0 0 30px rgba(13, 148, 136, 0.08)`,
    });

    setSpotlightStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(13,148,136,0.15) 0%, transparent 60%)`,
      transition: 'opacity 0.3s ease',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
      boxShadow: '',
    });
    setSpotlightStyle({ opacity: 0, transition: 'opacity 0.5s ease' });
    setGlowBorder(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setGlowBorder(true);
  }, []);

  const toggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
    setHeartBounce(true);
    setTimeout(() => setHeartBounce(false), 400);
  }, []);

  return (
    <motion.div
      transition={{ duration: 0.3 }}
      onClick={() => {
        setDetailType('product');
        setSelectedItemId(product.id);
        setShowDetailModal(true);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="card-3d glow-effect card-depth-shadow rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl cursor-pointer group relative"
      style={tiltStyle}
    >
      {/* Spotlight overlay */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-10" style={spotlightStyle} />

      {/* Glow border on hover - teal themed */}
      <motion.div
        initial={false}
        animate={glowBorder ? { opacity: 1 } : { opacity: 0 }}
        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
        style={{
          boxShadow: glowBorder ? '0 0 0 2px rgba(13,148,136,0.4), 0 0 20px rgba(13,148,136,0.15)' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      />

      {/* Image placeholder with gradient */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center card-image-overlay overflow-hidden`}>
        <div className="absolute inset-0 hero-pattern opacity-40" />
        {/* Dot pattern overlay */}
        <div className="card-dot-pattern" />
        {/* NEW ribbon on first 2 items */}
        {showRibbon && (
          <div className="card-new-ribbon">
            {locale === 'ar' ? 'جديد' : 'NEW'}
          </div>
        )}
        {/* Floating icon */}
        <div className="relative w-16 h-16 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 card-icon-float">
          <PackageCheck className="w-8 h-8 text-deal-teal" />
        </div>

        {/* Favorites button with tooltip */}
        <motion.button
          animate={heartBounce ? { scale: [1, 1.4, 0.8, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
          data-tooltip={tooltipFavorite}
          className={`deal-tooltip absolute top-3 end-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 heart-btn ${
            isFavorite
              ? 'bg-red-500 shadow-lg shadow-red-500/30 active'
              : 'bg-white/80 backdrop-blur-sm shadow-md hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 transition-colors duration-200 ${isFavorite ? 'text-white fill-white' : 'text-deal-navy/60'}`} />
        </motion.button>

        {/* Share button with tooltip */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); }}
          data-tooltip={tooltipShare}
          className="deal-tooltip absolute bottom-3 start-3 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all duration-300"
        >
          <Share2 className="w-4 h-4 text-deal-navy/60" />
        </motion.button>

        {/* Category badge */}
        <div className="absolute top-3 start-3 z-10">
          <span className="badge-3d bg-deal-teal text-white text-[10px]">
            {getLocalizedValue(product.categoryName, product.categoryNameFr)}
          </span>
        </div>

        {/* NEW / POPULAR badge */}
        {showNewBadge && (
          <div className="absolute bottom-3 start-3">
            <span className="badge-shimmer badge-3d bg-gradient-to-r from-deal-teal to-deal-teal-light text-white text-[10px] font-black px-3 py-1 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {locale === 'ar' ? 'جديد' : 'NOUVEAU'}
            </span>
          </div>
        )}
        {showPopularBadge && (
          <div className="absolute bottom-3 start-3">
            <span className="badge-shimmer badge-3d bg-gradient-to-r from-deal-orange to-deal-gold text-white text-[10px] font-black px-3 py-1 flex items-center gap-1">
              <Flame className="w-3 h-3" />
              {locale === 'ar' ? 'الأكثر مبيعاً' : 'TOP'}
            </span>
          </div>
        )}

        {/* Stock badge */}
        <div className="absolute top-14 end-3 z-10">
          {product.stock > 0 ? (
            <span className="badge-3d bg-emerald-500/90 text-white text-[10px] flex items-center gap-1">
              <PackageCheck className="w-3 h-3" />
              {t.products.inStock}
            </span>
          ) : (
            <span className="badge-3d bg-red-500/90 text-white text-[10px] flex items-center gap-1">
              <PackageX className="w-3 h-3" />
              {t.products.outOfStock}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 relative z-[1]">
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
            <span className="price-tag text-sm" style={{ background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)', boxShadow: '0 3px 0 0 #0F766E' }}>
              {product.price.toLocaleString()} {t.common.currency}
            </span>
            <span className="text-[10px] text-muted-foreground text-center mt-0.5">
              / {unitLabel}
            </span>
          </div>
          <button className="btn-3d-sm btn-3d-teal text-white text-xs pulse-ring">
            {t.products.buyNow}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
