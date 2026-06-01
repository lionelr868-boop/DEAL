'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle2, XCircle, Heart, Zap, Share2, MessageCircle } from 'lucide-react';
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

// SVG decorative patterns for card visuals
function ServiceVisualPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="svcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,107,53,0.08)" />
          <stop offset="100%" stopColor="rgba(13,148,136,0.08)" />
        </linearGradient>
      </defs>
      <rect fill="url(#svcGrad)" width="120" height="120" />
      <circle cx="20" cy="20" r="3" fill="rgba(255,107,53,0.06)" />
      <circle cx="100" cy="20" r="2" fill="rgba(13,148,136,0.06)" />
      <circle cx="60" cy="50" r="4" fill="rgba(245,158,11,0.04)" />
      <path d="M10,90 Q30,70 50,90 Q70,110 90,90" stroke="rgba(255,107,53,0.06)" fill="none" strokeWidth="1.5" />
      <path d="M40,40 Q60,20 80,40" stroke="rgba(13,148,136,0.06)" fill="none" strokeWidth="1.5" />
      <circle cx="110" cy="100" r="2.5" fill="rgba(245,158,11,0.06)" />
      <circle cx="15" cy="100" r="1.5" fill="rgba(255,107,53,0.08)" />
      <rect x="85" y="60" width="8" height="8" rx="2" fill="none" stroke="rgba(13,148,136,0.05)" strokeWidth="1" />
    </svg>
  );
}

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
  const showRibbon = index < 2;

  const tooltipFavorite = locale === 'ar' ? 'إضافة للمفضلة' : 'Ajouter aux favoris';
  const tooltipShare = locale === 'ar' ? 'مشاركة' : 'Partager';
  const tooltipMsg = locale === 'ar' ? 'رسالة' : 'Message';

  const providerName = getLocalizedValue(service.providerName, service.providerNameFr);
  const initials = providerName.split(' ').map((w) => w.charAt(0)).join('').slice(0, 2).toUpperCase();

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
      boxShadow: `${(x - centerX) * -0.1}px ${(centerY - y) * -0.1}px 24px rgba(0, 0, 0, 0.12), 0 0 30px rgba(255, 107, 53, 0.08)`,
    });

    setSpotlightStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,107,53,0.12) 0%, transparent 60%)`,
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
      variants={cardVariants}
      transition={{ duration: 0.3 }}
      onClick={() => { setDetailType('service'); setSelectedItemId(service.id); setShowDetailModal(true); }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="card-3d card-gradient-border card-accent-stripe rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl cursor-pointer group relative"
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

      {/* Image area with SVG pattern */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center card-image-overlay overflow-hidden`}>
        {/* SVG decorative pattern instead of plain gradient */}
        <ServiceVisualPattern />
        <div className="card-dot-pattern" />
        {showRibbon && (
          <div className="card-new-ribbon">{locale === 'ar' ? 'جديد' : 'NEW'}</div>
        )}

        {/* Floating icon */}
        <div className="relative w-16 h-16 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 card-icon-float">
          <span className="text-3xl font-black text-deal-orange">
            {getLocalizedValue(service.title, service.titleFr).charAt(0)}
          </span>
        </div>

        {/* Favorites button */}
        <motion.button
          animate={heartBounce ? { scale: [1, 1.4, 0.8, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
          data-tooltip={tooltipFavorite}
          className={`deal-tooltip absolute top-3 start-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 heart-btn ${
            isFavorite ? 'bg-red-500 shadow-lg shadow-red-500/30 active' : 'bg-white/80 backdrop-blur-sm shadow-md hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 transition-colors duration-200 ${isFavorite ? 'text-white fill-white' : 'text-deal-navy/60'}`} />
        </motion.button>

        {/* Share button */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); }}
          data-tooltip={tooltipShare}
          className="deal-tooltip absolute bottom-3 end-3 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all duration-300"
        >
          <Share2 className="w-4 h-4 text-deal-navy/60" />
        </motion.button>

        {/* Message provider button */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); }}
          data-tooltip={tooltipMsg}
          className="deal-tooltip absolute bottom-3 start-3 z-20 msg-btn"
        >
          <MessageCircle className="w-4 h-4" />
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
      <div className="p-4 space-y-3 relative z-[1]">
        {/* Title - Larger */}
        <h3 className="font-extrabold text-base leading-tight text-deal-navy line-clamp-2 min-h-[2.5rem]">
          {getLocalizedValue(service.title, service.titleFr)}
        </h3>

        {/* Provider info with colored initials avatar */}
        <div className="flex items-center gap-2">
          <div className="avatar-initials avatar-initials-orange">
            {initials}
          </div>
          <span className="text-xs text-muted-foreground truncate">{providerName}</span>
        </div>

        {/* Quick stats row */}
        <div className="card-quick-stats">
          <RatingStars rating={service.rating} size="sm" />
          <span className="text-muted-foreground">
            ({service.totalReviews} {locale === 'ar' ? 'تقييم' : 'avis'})
          </span>
          <span className="ms-auto price-tag text-xs" style={{ padding: '0.2rem 0.6rem', background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)', boxShadow: '0 2px 0 0 #CC5529' }}>
            {service.price.toLocaleString()} {t.common.currency}
          </span>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button className="btn-neon btn-wave btn-ripple rounded-xl text-xs px-4 py-2.5">
            {t.services.book}
          </button>
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 heart-btn ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              onClick={(e) => { e.stopPropagation(); }}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-deal-teal/10 hover:text-deal-teal transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
