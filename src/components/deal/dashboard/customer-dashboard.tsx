'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import {
  CalendarCheck,
  PackageCheck,
  Star,
  Wrench,
  ShoppingBag,
  Truck,
  Clock,
  ChevronLeft,
  Heart,
  Package,
  ImageIcon,
} from 'lucide-react';
import { useI18n, useAppStore, useFavoritesStore } from '@/lib/store';
import { services, products, equipmentList } from '@/lib/data/mock';
import { AnimatedCounter } from '../animated-counter';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-deal-orange/10', text: 'text-deal-orange', dot: 'bg-deal-orange' },
  ACCEPTED: { bg: 'bg-deal-teal/10', text: 'text-deal-teal', dot: 'bg-deal-teal' },
  IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' },
  COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500' },
};

interface Booking {
  id: string;
  name: { ar: string; fr: string };
  provider: { ar: string; fr: string };
  date: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  price: number;
  type: 'service' | 'equipment';
}

export default function CustomerDashboard() {
  const { t, getLocalizedValue, locale } = useI18n();
  const { currentUser, setActiveSection, setShowDetailModal, setDetailType, setSelectedItemId, dashboardActiveTab } = useAppStore();
  const { favorites, toggleFavorite } = useFavoritesStore();

  const stats = [
    { label: t.dashboard.activeBookings, value: '3', icon: CalendarCheck, color: 'from-deal-orange to-deal-orange-dark', bg: 'bg-deal-orange/10' },
    { label: t.dashboard.completedOrders, value: '12', icon: PackageCheck, color: 'from-deal-teal to-deal-teal-dark', bg: 'bg-deal-teal/10' },
    { label: t.dashboard.pendingReviews, value: '2', icon: Star, color: 'from-deal-gold to-deal-gold-dark', bg: 'bg-deal-gold/10' },
  ];

  const statsReady = useMemo(() => true, []);

  const bookings: Booking[] = [
    { id: '1', name: { ar: 'تمديد كهربائي', fr: 'Installation électrique' }, provider: { ar: 'أحمد بن علي', fr: 'Ahmed Ben Ali' }, date: '2025-01-15', status: 'IN_PROGRESS', price: 15000, type: 'service' },
    { id: '2', name: { ar: 'خرسانة جاهزة', fr: 'Béton prêt à l\'emploi' }, provider: { ar: 'مؤسسة البناء الحديث', fr: 'Entreprise Bâti Moderne' }, date: '2025-01-18', status: 'PENDING', price: 45000, type: 'product' },
    { id: '3', name: { ar: 'إيجار رافعة', fr: 'Location de grue' }, provider: { ar: 'شركة المعدات الثقيلة', fr: 'Équipements Lourds SARL' }, date: '2025-01-10', status: 'ACCEPTED', price: 25000, type: 'equipment' },
    { id: '4', name: { ar: 'دهان غرف', fr: 'Peinture de chambres' }, provider: { ar: 'كريم الدهان', fr: 'Karim Peinture' }, date: '2025-01-05', status: 'COMPLETED', price: 35000, type: 'service' },
  ];

  const quickActions = [
    { label: t.dashboard.browseServices, icon: Wrench, color: 'bg-deal-orange', action: () => setActiveSection('services') },
    { label: t.dashboard.browseProducts, icon: ShoppingBag, color: 'bg-deal-teal', action: () => setActiveSection('products') },
    { label: t.dashboard.browseEquipment, icon: Truck, color: 'bg-deal-gold', action: () => setActiveSection('equipment') },
  ];

  // Get favorited items
  const getFavoritedItems = () => {
    return favorites.map((id) => {
      const service = services.find(s => s.id === id);
      if (service) return { ...service, itemType: 'service' as const };
      const product = products.find(p => p.id === id);
      if (product) return { ...product, itemType: 'product' as const };
      const equipment = equipmentList.find(e => e.id === id);
      if (equipment) return { ...equipment, itemType: 'equipment' as const };
      return null;
    }).filter(Boolean);
  };

  const handleOpenFavorite = (id: string, type: 'service' | 'product' | 'equipment') => {
    setSelectedItemId(id);
    setDetailType(type);
    setShowDetailModal(true);
  };

  const handleRemoveFavorite = (id: string) => {
    toggleFavorite(id);
  };

  // --- Favorites Tab ---
  if (dashboardActiveTab === 'favorites' || dashboardActiveTab === 'profile') {
    const favItems = getFavoritedItems();

    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-400 via-pink-400 to-deal-orange p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -bottom-8 -end-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black">{t.common.favorites} ❤️</h2>
            <p className="mt-1 text-white/80 text-sm">
              {favItems.length} {locale === 'ar' ? 'عنصر في المفضلة' : 'articles en favoris'}
            </p>
          </div>
        </motion.div>

        {favItems.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-3d rounded-2xl bg-white p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"
            >
              <Heart className="w-10 h-10 text-gray-300" />
            </motion.div>
            <p className="text-lg font-bold text-muted-foreground">{t.common.noResults}</p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              {locale === 'ar' ? 'لم تقم بإضافة أي عنصر للمفضلة بعد' : "Vous n'avez pas encore ajouté d'articles en favoris"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favItems.map((item: any, i) => {
              const title = getLocalizedValue(item.title, item.titleFr);
              const price = item.itemType === 'equipment' ? item.dailyPrice : item.price;
              return (
                <motion.div
                  key={item.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="card-3d rounded-2xl p-4 bg-white"
                >
                  {/* Gradient placeholder */}
                  <div className={`w-full h-24 rounded-xl mb-3 bg-gradient-to-br ${
                    item.itemType === 'service' ? 'from-deal-orange/60 to-amber-400/60' :
                    item.itemType === 'product' ? 'from-deal-teal/60 to-emerald-400/60' :
                    'from-deal-gold/60 to-amber-400/60'
                  } flex items-center justify-center`}>
                    {item.itemType === 'service' ? <Wrench className="w-8 h-8 text-white/40" /> :
                     item.itemType === 'product' ? <Package className="w-8 h-8 text-white/40" /> :
                     <Truck className="w-8 h-8 text-white/40" />}
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-deal-navy truncate">{title}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{item.itemType === 'equipment' ? t.sections.equipment : item.itemType === 'product' ? t.sections.products : t.sections.services}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(item.id); }}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 hover:bg-red-100 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenFavorite(item.id, item.itemType)}
                    className="w-full text-center text-xs font-bold text-deal-orange bg-deal-orange/10 rounded-lg py-2 hover:bg-deal-orange/20 transition-colors"
                  >
                    {t.common.viewDetails}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // --- Bookings Tab ---
  if (dashboardActiveTab === 'bookings') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-teal via-deal-teal-dark to-deal-teal p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black">{t.dashboard.bookings} 📋</h2>
            <p className="mt-1 text-white/80 text-sm">{locale === 'ar' ? 'جميع حجوزاتك وطلباتك' : 'Toutes vos réservations et commandes'}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {bookings.map((booking, i) => {
              const status = statusConfig[booking.status];
              return (
                <motion.div
                  key={booking.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    booking.type === 'service' ? 'bg-deal-orange/10' : booking.type === 'equipment' ? 'bg-deal-gold/10' : 'bg-deal-teal/10'
                  }`}>
                    {booking.type === 'service' ? (
                      <Wrench className="w-5 h-5 text-deal-orange" />
                    ) : booking.type === 'equipment' ? (
                      <Truck className="w-5 h-5 text-deal-gold" />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-deal-teal" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-deal-navy truncate">
                      {getLocalizedValue(booking.name.ar, booking.name.fr)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getLocalizedValue(booking.provider.ar, booking.provider.fr)} • {booking.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-bold text-deal-navy hidden sm:block">
                      {booking.price.toLocaleString()} {t.common.currency}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {t.dashboard[booking.status.toLowerCase() as keyof typeof t.dashboard]}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Overview Tab (default) ---
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-orange via-deal-gold to-deal-teal p-6 text-white"
      >
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black">
            {t.dashboard.welcomeBack}، {currentUser?.name} 👋
          </h2>
          <p className="mt-1 text-white/80 text-sm sm:text-base">
            {t.dashboard.overview}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4, scale: 1.02 }}
              className="card-3d rounded-2xl p-5 bg-white"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-deal-navy" />
                </div>
                <div>
                  <p className="text-2xl font-black text-deal-navy">{statsReady && <AnimatedCounter target={stat.value} duration={1000} />}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 card-3d rounded-2xl bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.recentBookings}</h3>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {bookings.map((booking, i) => {
              const status = statusConfig[booking.status];
              return (
                <motion.div
                  key={booking.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    booking.type === 'service' ? 'bg-deal-orange/10' : booking.type === 'equipment' ? 'bg-deal-gold/10' : 'bg-deal-teal/10'
                  }`}>
                    {booking.type === 'service' ? (
                      <Wrench className="w-5 h-5 text-deal-orange" />
                    ) : booking.type === 'equipment' ? (
                      <Truck className="w-5 h-5 text-deal-gold" />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-deal-teal" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-deal-navy truncate">
                      {getLocalizedValue(booking.name.ar, booking.name.fr)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getLocalizedValue(booking.provider.ar, booking.provider.fr)} • {booking.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-bold text-deal-navy hidden sm:block">
                      {booking.price.toLocaleString()} {t.common.currency}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {t.dashboard[booking.status.toLowerCase() as keyof typeof t.dashboard]}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-3d rounded-2xl bg-white p-5 sm:p-6"
        >
          <h3 className="text-lg font-bold text-deal-navy mb-5">{t.dashboard.quickActions}</h3>
          <div className="space-y-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.03, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={action.action}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-start group"
                >
                  <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="flex-1 font-bold text-sm text-deal-navy">{action.label}</span>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-deal-orange transition-colors" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
