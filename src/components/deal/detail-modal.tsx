'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  User, Store, PackageCheck, CheckCircle2, XCircle, Clock,
  Wrench, Zap, Droplets, HardHat, Hammer, Wind, PaintBucket, Home,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import { services, products, equipmentList } from '@/lib/data/mock';
import RatingStars from './rating-stars';

const categoryIconMap: Record<string, React.ElementType> = {
  elec: Zap,
  plumb: Droplets,
  build: HardHat,
  carp: Hammer,
  hvac: Wind,
  metal: Wrench,
  paint: PaintBucket,
  clean: Home,
};

const serviceGradients = [
  'from-deal-orange to-amber-500',
  'from-deal-orange to-red-500',
  'from-amber-500 to-deal-orange',
  'from-red-500 to-deal-orange',
];

const productGradients = [
  'from-deal-teal to-emerald-500',
  'from-emerald-500 to-deal-teal',
  'from-deal-teal to-teal-600',
  'from-teal-600 to-deal-teal',
];

const equipmentGradients = [
  'from-deal-gold to-amber-600',
  'from-amber-500 to-deal-gold',
  'from-deal-gold to-yellow-500',
  'from-yellow-600 to-deal-gold',
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

type PriceTab = 'daily' | 'weekly' | 'monthly';

export default function DetailModal() {
  const { t, locale, getLocalizedValue } = useI18n();
  const {
    showDetailModal, setShowDetailModal, detailType, selectedItemId,
  } = useAppStore();

  const [priceTab, setPriceTab] = useState<PriceTab>('daily');

  // Find the item based on type and ID
  const service = detailType === 'service' ? services.find(s => s.id === selectedItemId) : null;
  const product = detailType === 'product' ? products.find(p => p.id === selectedItemId) : null;
  const equipment = detailType === 'equipment' ? equipmentList.find(e => e.id === selectedItemId) : null;

  const item = service || product || equipment;
  if (!item || !detailType) return null;

  const gradient = detailType === 'service'
    ? serviceGradients[parseInt(item.id.replace(/\D/g, '') || '0', 10) % serviceGradients.length]
    : detailType === 'product'
      ? productGradients[parseInt(item.id.replace(/\D/g, '') || '0', 10) % productGradients.length]
      : equipmentGradients[parseInt(item.id.replace(/\D/g, '') || '0', 10) % equipmentGradients.length];

  const title = getLocalizedValue(item.title, item.titleFr);
  const description = getLocalizedValue(item.description, item.descriptionFr);
  const rating = 'rating' in item ? item.rating : 0;
  const totalReviews = 'totalReviews' in item ? item.totalReviews : 0;

  // --- SERVICE DETAIL ---
  if (detailType === 'service' && service) {
    const providerName = getLocalizedValue(service.providerName, service.providerNameFr);
    const categoryName = getLocalizedValue(service.categoryName, service.categoryNameFr);
    const CategoryIcon = categoryIconMap[service.categoryId] || Wrench;

    return (
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          {/* Gradient header */}
          <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <div className="absolute inset-0 hero-pattern opacity-30" />
            <motion.div
              className="absolute w-20 h-20 rounded-full bg-white/10 top-4 start-4"
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-12 h-12 rounded-full bg-white/10 bottom-8 end-8"
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative w-20 h-20 rounded-3xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
            >
              <CategoryIcon className="w-10 h-10 text-deal-orange" />
            </motion.div>
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-deal-orange bg-deal-orange/10 px-3 py-1 rounded-full">
                  {categoryName}
                </span>
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
              <h2 className="text-xl font-black text-deal-navy leading-tight">{title}</h2>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-deal-teal/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-deal-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-deal-navy">{providerName}</p>
                <RatingStars rating={service.providerRating} size="sm" showCount={false} />
              </div>
            </div>

            <RatingStars rating={rating} size="md" reviewCount={totalReviews} />

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-muted-foreground">{t.services.price}</p>
                <p className="text-2xl font-black text-deal-orange">
                  {service.price.toLocaleString()} <span className="text-sm font-semibold">{t.common.currency}</span>
                </p>
                <p className="text-xs text-muted-foreground">{t.services.perService}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d text-white bg-deal-orange rounded-xl px-8 py-3 font-bold text-base"
              >
                {t.services.book}
              </motion.button>
            </div>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  // --- PRODUCT DETAIL ---
  if (detailType === 'product' && product) {
    const merchantName = getLocalizedValue(product.merchantName, product.merchantNameFr);
    const categoryName = getLocalizedValue(product.categoryName, product.categoryNameFr);
    const unitLabel = unitLabels[product.unit]?.[locale] || product.unit;

    return (
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <div className="absolute inset-0 hero-pattern opacity-30" />
            <motion.div
              className="absolute w-20 h-20 rounded-full bg-white/10 top-4 end-4"
              animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-14 h-14 rounded-full bg-white/10 bottom-6 start-6"
              animate={{ y: [0, 10, 0], scale: [1, 0.9, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative w-20 h-20 rounded-3xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
            >
              <PackageCheck className="w-10 h-10 text-deal-teal" />
            </motion.div>
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-deal-teal bg-deal-teal/10 px-3 py-1 rounded-full">
                  {categoryName}
                </span>
                {product.stock > 0 ? (
                  <span className="badge-3d bg-emerald-500 text-white text-xs flex items-center gap-1">
                    <PackageCheck className="w-3 h-3" />
                    {t.products.inStock}: {product.stock}
                  </span>
                ) : (
                  <span className="badge-3d bg-red-500 text-white text-xs flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {t.products.outOfStock}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-deal-navy leading-tight">{title}</h2>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-deal-orange/10 flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5 text-deal-orange" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-deal-navy">{merchantName}</p>
                <p className="text-xs text-muted-foreground">{categoryName}</p>
              </div>
            </div>

            <RatingStars rating={rating} size="md" reviewCount={totalReviews} />

            {/* Stock bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t.products.stock}</span>
                <span>{product.stock.toLocaleString()} {unitLabel}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (product.stock / 500) * 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    product.stock > 100 ? 'bg-emerald-500' : product.stock > 20 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-muted-foreground">{t.products.price}</p>
                <p className="text-2xl font-black text-deal-teal">
                  {product.price.toLocaleString()} <span className="text-sm font-semibold">{t.common.currency}</span>
                </p>
                <p className="text-xs text-muted-foreground">/ {unitLabel}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={product.stock <= 0}
                className="btn-3d-sm btn-3d-teal text-white rounded-xl px-8 py-3 font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.products.buyNow}
              </motion.button>
            </div>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  // --- EQUIPMENT DETAIL ---
  if (detailType === 'equipment' && equipment) {
    const ownerName = getLocalizedValue(equipment.ownerName, equipment.ownerNameFr);

    const priceMap: Record<PriceTab, number> = {
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
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <div className="absolute inset-0 hero-pattern opacity-30" />
            <motion.div
              className="absolute w-20 h-20 rounded-full bg-white/10 top-6 start-6"
              animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-16 h-16 rounded-full bg-white/10 bottom-4 end-10"
              animate={{ y: [0, 12, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative w-20 h-20 rounded-3xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
            >
              <Wrench className="w-10 h-10 text-deal-gold" />
            </motion.div>
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-deal-gold bg-deal-gold/10 px-3 py-1 rounded-full">
                  {t.sections.equipment}
                </span>
                {equipment.status === 'AVAILABLE' ? (
                  <span className="badge-3d bg-emerald-500 text-white text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {t.equipment.available}
                  </span>
                ) : (
                  <span className="badge-3d bg-amber-500 text-white text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t.equipment.rented}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-deal-navy leading-tight">{title}</h2>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-deal-gold/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-deal-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-deal-navy">{ownerName}</p>
                <p className="text-xs text-muted-foreground">{t.equipment.available}</p>
              </div>
            </div>

            <RatingStars rating={rating} size="md" reviewCount={totalReviews} />

            {/* Price tabs */}
            <div className="space-y-3">
              <div className="flex rounded-xl overflow-hidden border border-amber-200 bg-amber-50/50">
                {(Object.keys(priceMap) as PriceTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPriceTab(tab)}
                    className={`flex-1 py-2.5 text-sm font-bold transition-all duration-200 ${
                      priceTab === tab
                        ? 'bg-deal-gold text-deal-navy shadow-md'
                        : 'text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    {periodLabel[tab]}
                  </button>
                ))}
              </div>

              {/* Price cards */}
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(priceMap) as PriceTab[]).map((tab) => (
                  <motion.div
                    key={tab}
                    onClick={() => setPriceTab(tab)}
                    whileHover={{ scale: 1.03 }}
                    className={`cursor-pointer rounded-xl p-3 text-center transition-all duration-200 border-2 ${
                      priceTab === tab
                        ? 'border-deal-gold bg-deal-gold/10 shadow-md'
                        : 'border-gray-100 bg-white hover:border-amber-200'
                    }`}
                  >
                    <p className="text-[10px] font-bold text-muted-foreground mb-1">{periodLabel[tab]}</p>
                    <p className="text-sm font-black text-deal-navy">
                      {priceMap[tab].toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{t.common.currency}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-muted-foreground">{t.equipment.perDay}</p>
                <motion.p
                  key={priceTab}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-black text-deal-gold"
                >
                  {priceMap[priceTab].toLocaleString()} <span className="text-sm font-semibold">{t.common.currency}</span>
                </motion.p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={equipment.status !== 'AVAILABLE'}
                className="btn-3d-sm btn-3d-gold text-deal-navy rounded-xl px-8 py-3 font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.equipment.book}
              </motion.button>
            </div>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
