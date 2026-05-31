'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle2, XCircle, Heart, Zap } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import RatingStars from './rating-stars';
import type { ServiceItem } from '@/lib/data/mock';

interface ServiceCardProps {
  service: ServiceItem;
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const gradients = [
  'from-deal-orange/20 to-deal-gold/10',
  'from-deal-teal/20 to-deal-teal-light/10',
  'from-deal-gold/20 to-deal-orange/10',
  'from-deal-orange/10 to-deal-teal/10',
];

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const { getLocalizedValue, t, locale } = useI18n();
  const { setDetailType, setSelectedItemId, setShowDetailModal } = useAppStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [heartBounce, setHeartBounce] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [glowBorder, setGlowBorder] = useState(false);
  const gradient = gradients[index % gradients.length];

  const showNewBadge = index % 3 === 0;
  const showPopularBadge = !showNewBadge && index % 5 === 0;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });

    setSpotlightStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,107,53,0.15) 0%, transparent 60%)`,
      transition: 'opacity 0.3s ease',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
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
      variants={cardVariants}
      transition={{ duration: 0.3 }}
      onClick={() => {
        setDetailType('service');
        setSelectedItemId(service.id);
        setShowDetailModal(true);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="card-3d rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl cursor-pointer group relative"
      style={tiltStyle}
    >
      {/* Spotlight overlay */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-10" style={spotlightStyle} />

      {/* Glow border on hover */}
      <motion.div
        initial={false}
        animate={glowBorder ? { opacity: 1 } : { opacity: 0 }}
        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
        style={{
          boxShadow: glowBorder ? '0 0 0 2px rgba(255,107,53,0.4), 0 0 20px rgba(255,107,53,0.15)' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      />

      {/* Image placeholder with gradient */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center card-image-overlay overflow-hidden`}>
        <div className="absolute inset-0 hero-pattern opacity-40" />
        <div className="relative w-16 h-16 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
          <span className="text-3xl font-black text-deal-orange">
            {getLocalizedValue(service.title, service.titleFr).charAt(0)}
          </span>
        </div>

        {/* Favorites button with bounce */}
        <motion.button
          animate={heartBounce ? { scale: [1, 1.4, 0.8, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
          className={`absolute top-3 start-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 heart-btn ${
            isFavorite
              ? 'bg-red-500 shadow-lg shadow-red-500/30 active'
              : 'bg-white/80 backdrop-blur-sm shadow-md hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 transition-colors duration-200 ${isFavorite ? 'text-white fill-white' : 'text-deal-navy/60'}`} />
        </motion.button>

        {/* NEW / POPULAR badge */}
        {showNewBadge && (
          <div className="absolute top-3 start-1/2 -translate-x-1/2">
            <span className="badge-shimmer badge-3d bg-gradient-to-r from-deal-orange to-deal-gold text-white text-[10px] font-black px-3 py-1 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {locale === 'ar' ? 'جديد' : 'NEW'}
            </span>
          </div>
        )}
        {showPopularBadge && (
          <div className="absolute top-3 start-1/2 -translate-x-1/2">
            <span className="badge-shimmer badge-3d bg-gradient-to-r from-deal-teal to-deal-teal-light text-white text-[10px] font-black px-3 py-1">
              🔥 {locale === 'ar' ? 'رائج' : 'POPULAR'}
            </span>
          </div>
        )}

        {/* Availability badge */}
        <div className="absolute top-3 end-3 z-10">
          {service.isAvailable ? (
            <span className="badge-3d bg-emerald-500 text-white text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {t.services.available}
            </span>
          ) : (
            <span className="badge-3d bg-red-500 text-white text-xs flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              {t.services.unavailable}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-sm leading-tight text-deal-navy line-clamp-2 min-h-[2.5rem]">
          {getLocalizedValue(service.title, service.titleFr)}
        </h3>

        {/* Provider info */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-deal-teal/10 flex items-center justify-center flex-shrink-0">
            <User className="w-3.5 h-3.5 text-deal-teal" />
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {getLocalizedValue(service.providerName, service.providerNameFr)}
          </span>
        </div>

        {/* Rating */}
        <RatingStars rating={service.rating} size="sm" reviewCount={service.totalReviews} />

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="price-tag text-sm">
            {service.price.toLocaleString()} {t.common.currency}
          </span>
          <button className="btn-3d-sm bg-deal-orange text-white text-xs pulse-ring">
            {t.services.book}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
