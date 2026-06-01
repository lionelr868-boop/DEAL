'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle2, Clock, Heart, Zap, TrendingUp, Share2 } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import RatingStars from './rating-stars';
import type { EquipmentItem } from '@/lib/data/mock';

interface EquipmentCardProps {
  equipment: EquipmentItem;
  index?: number;
}

const gradients = [
  'from-deal-gold/20 to-amber-100/10',
  'from-deal-orange/20 to-deal-gold/10',
  'from-deal-gold/10 to-deal-orange/10',
  'from-amber-200/20 to-deal-gold/10',
];

type PriceTab = 'daily' | 'weekly' | 'monthly';

export default function EquipmentCard({ equipment, index = 0 }: EquipmentCardProps) {
  const { getLocalizedValue, t, locale } = useI18n();
  const { setDetailType, setSelectedItemId, setShowDetailModal } = useAppStore();
  const [priceTab, setPriceTab] = useState<PriceTab>('daily');
  const [isFavorite, setIsFavorite] = useState(false);
  const [heartBounce, setHeartBounce] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [glowBorder, setGlowBorder] = useState(false);
  const gradient = gradients[index % gradients.length];

  const showNewBadge = index % 2 === 0;
  const showPopularBadge = !showNewBadge && index % 6 === 0;
  const showRibbon = index < 2;

  const tooltipFavorite = locale === 'ar' ? 'إضافة للمفضلة' : 'Ajouter aux favoris';
  const tooltipShare = locale === 'ar' ? 'مشاركة' : 'Partager';

  const priceMap: Record<PriceTab, number | undefined> = {
    daily: equipment.dailyPrice,
    weekly: equipment.weeklyPrice,
    monthly: equipment.monthlyPrice,
  };

  const periodLabel: Record<PriceTab, string> = {
    daily: t.equipment.daily,
    weekly: t.equipment.weekly,
    monthly: t.equipment.monthly,
  };

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
      boxShadow: `${(x - centerX) * -0.1}px ${(centerY - y) * -0.1}px 24px rgba(0, 0, 0, 0.12), 0 0 30px rgba(245, 158, 11, 0.08)`,
    });

    setSpotlightStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(245,158,11,0.15) 0%, transparent 60%)`,
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
        setDetailType('equipment');
        setSelectedItemId(equipment.id);
        setShowDetailModal(true);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="card-3d glow-effect card-cursor-shadow cursor-shadow-gold rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl cursor-pointer group relative"
      style={tiltStyle}
    >
      {/* Spotlight overlay */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-10" style={spotlightStyle} />

      {/* Glow border on hover - gold themed */}
      <motion.div
        initial={false}
        animate={glowBorder ? { opacity: 1 } : { opacity: 0 }}
        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
        style={{
          boxShadow: glowBorder ? '0 0 0 2px rgba(245,158,11,0.4), 0 0 20px rgba(245,158,11,0.15)' : 'none',
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
          <span className="text-2xl font-black text-deal-gold">
            {getLocalizedValue(equipment.title, equipment.titleFr).charAt(0)}
          </span>
        </div>

        {/* Favorites button with tooltip */}
        <motion.button
          animate={heartBounce ? { scale: [1, 1.4, 0.8, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
          data-tooltip={tooltipFavorite}
          className={`deal-tooltip absolute top-3 start-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 heart-btn ${
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
          className="deal-tooltip absolute bottom-3 end-3 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all duration-300"
        >
          <Share2 className="w-4 h-4 text-deal-navy/60" />
        </motion.button>

        {/* NEW / POPULAR badge */}
        {showNewBadge && (
          <div className="absolute top-3 start-1/2 -translate-x-1/2 z-10">
            <span className="badge-shimmer badge-3d bg-gradient-to-r from-deal-gold to-amber-400 text-deal-navy text-[10px] font-black px-3 py-1 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {locale === 'ar' ? 'جديد' : 'NOUVEAU'}
            </span>
          </div>
        )}
        {showPopularBadge && (
          <div className="absolute top-3 start-1/2 -translate-x-1/2 z-10">
            <span className="badge-shimmer badge-3d bg-gradient-to-r from-deal-orange to-deal-gold text-white text-[10px] font-black px-3 py-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {locale === 'ar' ? 'الأكثر طلباً' : 'POPULAIRE'}
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 end-3 z-10">
          {equipment.status === 'AVAILABLE' ? (
            <span className="badge-3d bg-emerald-500 text-white text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {t.equipment.available}
            </span>
          ) : (
            <span className="badge-3d bg-amber-500 text-white text-[10px] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {t.equipment.rented}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 relative z-[1]">
        <h3 className="font-bold text-sm leading-tight text-deal-navy line-clamp-2 min-h-[2.5rem]">
          {getLocalizedValue(equipment.title, equipment.titleFr)}
        </h3>

        {/* Owner info */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-deal-gold/10 flex items-center justify-center flex-shrink-0">
            <User className="w-3.5 h-3.5 text-deal-gold" />
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {getLocalizedValue(equipment.ownerName, equipment.ownerNameFr)}
          </span>
        </div>

        {/* Rating */}
        <RatingStars rating={equipment.rating} size="sm" reviewCount={equipment.totalReviews} />

        {/* Price tabs */}
        <div className="flex rounded-lg overflow-hidden border border-amber-200 bg-amber-50/50">
          {(Object.keys(priceMap) as PriceTab[]).map((tab) => (
            <button
              key={tab}
              onClick={(e) => { e.stopPropagation(); setPriceTab(tab); }}
              className={`flex-1 py-1.5 text-[10px] font-bold transition-all duration-200 ${
                priceTab === tab
                  ? 'bg-deal-gold text-deal-navy shadow-sm'
                  : 'text-amber-700 hover:bg-amber-100'
              }`}
            >
              {periodLabel[tab]}
            </button>
          ))}
        </div>

        {/* Price display and CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="price-tag text-sm" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', boxShadow: '0 3px 0 0 #D97706' }}>
            {priceMap[priceTab]?.toLocaleString()} {t.common.currency}
          </span>
          <button className="btn-3d-sm btn-3d-gold text-deal-navy text-xs pulse-ring">
            {t.equipment.book}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
