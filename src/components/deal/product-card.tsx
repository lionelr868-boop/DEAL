'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Store, PackageCheck, PackageX, Heart, Zap, Flame, Share2, Truck, MessageCircle } from 'lucide-react';
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

function ProductVisualPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="prodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(13,148,136,0.1)" />
          <stop offset="100%" stopColor="rgba(255,107,53,0.1)" />
        </linearGradient>
      </defs>
      <rect fill="url(#prodGrad)" width="120" height="120" />
      <rect x="20" y="30" width="30" height="20" rx="4" fill="none" stroke="rgba(13,148,136,0.08)" strokeWidth="1" />
      <rect x="70" y="60" width="25" height="15" rx="3" fill="none" stroke="rgba(255,107,53,0.08)" strokeWidth="1" />
      <circle cx="60" cy="30" r="5" fill="none" stroke="rgba(245,158,11,0.06)" strokeWidth="1" />
      <path d="M15,80 L25,70 L35,85" stroke="rgba(255,107,53,0.06)" fill="none" strokeWidth="1.5" />
      <path d="M85,40 L95,30 L105,45" stroke="rgba(13,148,136,0.06)" fill="none" strokeWidth="1.5" />
    </svg>
  );
}

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
  const tooltipMsg = locale === 'ar' ? 'رسالة' : 'Message';

  const merchantName = getLocalizedValue(product.merchantName, product.merchantNameFr);
  const initials = merchantName.split(' ').map((w) => w.charAt(0)).join('').slice(0, 2).toUpperCase();
  const stockPercent = Math.min((product.stock / 50) * 100, 100);
  const stockColor = product.stock > 20 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500';

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
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
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(13,148,136,0.12) 0%, transparent 60%)`,
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

  const handleMouseEnter = useCallback(() => setGlowBorder(true), []);

  const toggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
    setHeartBounce(true);
    setTimeout(() => setHeartBounce(false), 400);
  }, []);

  return (
    <motion.div
      transition={{ duration: 0.3 }}
      onClick={() => { setDetailType('product'); setSelectedItemId(product.id); setShowDetailModal(true); }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="card-3d card-gradient-border card-accent-stripe rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl cursor-pointer group relative"
      style={tiltStyle}
    >
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-10" style={spotlightStyle} />

      <motion.div
        initial={false}
        animate={glowBorder ? { opacity: 1 } : { opacity: 0 }}
        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
        style={{
          boxShadow: glowBorder ? '0 0 0 2px rgba(13,148,136,0.4), 0 0 20px rgba(13,148,136,0.15)' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      />

      {/* Image area */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center card-image-overlay overflow-hidden`}>
        <ProductVisualPattern />
        <div className="card-dot-pattern" />
        {showRibbon && (
          <div className="card-new-ribbon">{locale === 'ar' ? 'جديد' : 'NEW'}</div>
        )}
        <div className="relative w-16 h-16 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 card-icon-float">
          <PackageCheck className="w-8 h-8 text-deal-teal" />
        </div>

        {/* Favorites */}
        <motion.button
          animate={heartBounce ? { scale: [1, 1.4, 0.8, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
          data-tooltip={tooltipFavorite}
          className={`deal-tooltip absolute top-3 end-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 heart-btn ${
            isFavorite ? 'bg-red-500 shadow-lg shadow-red-500/30 active' : 'bg-white/80 backdrop-blur-sm shadow-md hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 transition-colors duration-200 ${isFavorite ? 'text-white fill-white' : 'text-deal-navy/60'}`} />
        </motion.button>

        {/* Share */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); }}
          data-tooltip={tooltipShare}
          className="deal-tooltip absolute bottom-3 start-3 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all duration-300"
        >
          <Share2 className="w-4 h-4 text-deal-navy/60" />
        </motion.button>

        {/* Message */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); }}
          data-tooltip={tooltipMsg}
          className="deal-tooltip absolute bottom-3 end-3 z-20 msg-btn"
        >
          <MessageCircle className="w-4 h-4" />
        </motion.button>

        {/* Category badge */}
        <div className="absolute top-3 start-3 z-10">
          <span className="badge-3d bg-deal-teal text-white text-[10px]">
            {getLocalizedValue(product.categoryName, product.categoryNameFr)}
          </span>
        </div>

        {/* NEW / POPULAR */}
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
        <h3 className="font-extrabold text-base leading-tight text-deal-navy line-clamp-2 min-h-[2.5rem]">
          {getLocalizedValue(product.title, product.titleFr)}
        </h3>

        {/* Merchant with colored initials */}
        <div className="flex items-center gap-2">
          <div className="avatar-initials avatar-initials-teal">
            {initials}
          </div>
          <span className="text-xs text-muted-foreground truncate">{merchantName}</span>
        </div>

        {/* Quick stats + price */}
        <div className="card-quick-stats">
          <RatingStars rating={product.rating} size="sm" />
          <span className="text-muted-foreground">
            ({product.totalReviews})
          </span>
        </div>

        {/* Stock bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground font-medium">
              {locale === 'ar' ? 'المخزون' : 'Stock'}: {product.stock}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">{stockPercent}%</span>
          </div>
          <div className="stock-bar">
            <div className={`stock-bar-fill ${stockColor}`} style={{ width: `${stockPercent}%` }} />
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="price-tag text-xs" style={{ padding: '0.2rem 0.6rem', background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)', boxShadow: '0 2px 0 0 #0F766E' }}>
              {product.price.toLocaleString()} {t.common.currency}
            </span>
            <span className="text-[10px] text-muted-foreground text-center mt-0.5">
              / {unitLabel}
            </span>
          </div>
          <button className="btn-glass btn-ripple rounded-xl text-deal-teal text-xs px-4 py-2.5 border-deal-teal/30 hover:bg-deal-teal/10">
            {t.products.buyNow}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
