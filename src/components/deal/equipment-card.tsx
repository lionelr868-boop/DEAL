'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle2, Clock } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import RatingStars from './rating-stars';
import type { EquipmentItem } from '@/lib/data/mock';

interface EquipmentCardProps {
  equipment: EquipmentItem;
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const gradients = [
  'from-deal-gold/20 to-amber-100/10',
  'from-deal-orange/20 to-deal-gold/10',
  'from-deal-gold/10 to-deal-orange/10',
  'from-amber-200/20 to-deal-gold/10',
];

type PriceTab = 'daily' | 'weekly' | 'monthly';

export default function EquipmentCard({ equipment, index = 0 }: EquipmentCardProps) {
  const { getLocalizedValue, t } = useI18n();
  const { setDetailType, setSelectedItemId, setShowDetailModal } = useAppStore();
  const [priceTab, setPriceTab] = useState<PriceTab>('daily');
  const gradient = gradients[index % gradients.length];

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

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        setDetailType('equipment');
        setSelectedItemId(equipment.id);
        setShowDetailModal(true);
      }}
      className="card-3d rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl cursor-pointer"
    >
      {/* Image placeholder with gradient */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <div className="absolute inset-0 hero-pattern opacity-40" />
        <div className="relative w-16 h-16 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-lg">
          <span className="text-2xl font-black text-deal-gold">
            {getLocalizedValue(equipment.title, equipment.titleFr).charAt(0)}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 end-3">
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
      <div className="p-4 space-y-3">
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
              onClick={() => setPriceTab(tab)}
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
          <button className="btn-3d-sm btn-3d-gold text-deal-navy text-xs">
            {t.equipment.book}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
