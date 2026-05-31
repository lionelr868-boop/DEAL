'use client';

import { motion } from 'framer-motion';
import { User, CheckCircle2, XCircle } from 'lucide-react';
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
  const { getLocalizedValue, t } = useI18n();
  const { setDetailType, setSelectedItemId, setShowDetailModal } = useAppStore();
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        setDetailType('service');
        setSelectedItemId(service.id);
        setShowDetailModal(true);
      }}
      className="card-3d rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl cursor-pointer"
    >
      {/* Image placeholder with gradient */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <div className="absolute inset-0 hero-pattern opacity-40" />
        <div className="relative w-16 h-16 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-lg">
          <span className="text-3xl font-black text-deal-orange">
            {getLocalizedValue(service.title, service.titleFr).charAt(0)}
          </span>
        </div>

        {/* Availability badge */}
        <div className="absolute top-3 end-3">
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
          <button className="btn-3d-sm bg-deal-orange text-white text-xs">
            {t.services.book}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
