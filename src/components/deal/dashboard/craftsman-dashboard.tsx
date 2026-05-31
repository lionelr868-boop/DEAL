'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import {
  Wrench,
  CalendarCheck,
  DollarSign,
  Star,
  Plus,
  ClipboardList,
  UserCog,
  Check,
  X,
  TrendingUp,
  Zap,
  Droplets,
  HardHat,
  Hammer,
  Wind,
  PaintBucket,
  Home,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import { services } from '@/lib/data/mock';
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

export default function CraftsmanDashboard() {
  const { t, getLocalizedValue, locale } = useI18n();
  const { currentUser, dashboardActiveTab, setShowDetailModal, setDetailType, setSelectedItemId } = useAppStore();

  const myServices = services.slice(0, 8);

  const stats = [
    { label: t.dashboard.totalServices, value: '8', icon: Wrench, color: 'from-deal-orange to-deal-orange-dark', bg: 'bg-deal-orange/10' },
    { label: t.dashboard.activeBookings, value: '5', icon: CalendarCheck, color: 'from-deal-teal to-deal-teal-dark', bg: 'bg-deal-teal/10' },
    { label: t.dashboard.totalRevenue, value: '185,000', icon: DollarSign, color: 'from-deal-gold to-deal-gold-dark', bg: 'bg-deal-gold/10' },
    { label: t.dashboard.avgRating, value: '4.8', icon: Star, color: 'from-deal-orange to-deal-gold', bg: 'bg-deal-gold/10' },
  ];

  const statsReady = useMemo(() => true, []);

  const revenueData = [
    { month: { ar: 'يناير', fr: 'Jan' }, value: 85 },
    { month: { ar: 'فبراير', fr: 'Fév' }, value: 65 },
    { month: { ar: 'مارس', fr: 'Mar' }, value: 92 },
    { month: { ar: 'أبريل', fr: 'Avr' }, value: 78 },
    { month: { ar: 'مايو', fr: 'Mai' }, value: 95 },
    { month: { ar: 'يونيو', fr: 'Jun' }, value: 88 },
    { month: { ar: 'يوليو', fr: 'Jul' }, value: 100 },
  ];

  const bookings = [
    { id: '1', name: { ar: 'تمديد كهربائي', fr: 'Installation électrique' }, customer: { ar: 'محمد أمين', fr: 'Mohamed Amine' }, date: '2025-01-15', status: 'PENDING' as const, price: 15000 },
    { id: '2', name: { ar: 'إصلاح سباكة', fr: 'Réparation plomberie' }, customer: { ar: 'فاطمة الزهراء', fr: 'Fatima Zahra' }, date: '2025-01-14', status: 'PENDING' as const, price: 8000 },
    { id: '3', name: { ar: 'تركيب تكييف', fr: 'Installation climatisation' }, customer: { ar: 'يوسف بن عمر', fr: 'Youcef Ben Omar' }, date: '2025-01-12', status: 'IN_PROGRESS' as const, price: 25000 },
    { id: '4', name: { ar: 'دهان غرفة', fr: 'Peinture chambre' }, customer: { ar: 'سارة بوعلام', fr: 'Sara Boualem' }, date: '2025-01-10', status: 'ACCEPTED' as const, price: 12000 },
    { id: '5', name: { ar: 'ترميم منزل', fr: 'Rénovation maison' }, customer: { ar: 'كريم بلقاسم', fr: 'Karim Belkacem' }, date: '2025-01-08', status: 'COMPLETED' as const, price: 45000 },
    { id: '6', name: { ar: 'صيانة كهربائية', fr: 'Maintenance électrique' }, customer: { ar: 'نادر بن سعيد', fr: 'Nadir Ben Said' }, date: '2025-01-06', status: 'CANCELLED' as const, price: 5000 },
  ];

  const quickActions = [
    { label: t.dashboard.addNewService, icon: Plus, color: 'bg-deal-orange' },
    { label: t.dashboard.viewAllBookings, icon: ClipboardList, color: 'bg-deal-teal' },
    { label: t.dashboard.editProfile, icon: UserCog, color: 'bg-deal-gold' },
  ];

  const maxRevenue = Math.max(...revenueData.map((d) => d.value));

  const handleOpenService = (id: string) => {
    setSelectedItemId(id);
    setDetailType('service');
    setShowDetailModal(true);
  };

  // --- Services Tab ---
  if (dashboardActiveTab === 'services') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-orange via-deal-orange-dark to-deal-gold p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">{t.dashboard.services} 🔧</h2>
              <p className="mt-1 text-white/80 text-sm">{locale === 'ar' ? 'إدارة وعرض خدماتك' : 'Gérer et afficher vos services'}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-3d-sm text-white text-xs"
            >
              <Plus className="w-4 h-4 inline-block me-1" />
              {t.dashboard.addNewService}
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myServices.map((svc, i) => {
            const CategoryIcon = categoryIconMap[svc.categoryId] || Wrench;
            const title = getLocalizedValue(svc.title, svc.titleFr);
            return (
              <motion.div
                key={svc.id}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => handleOpenService(svc.id)}
                className="card-3d rounded-2xl p-4 bg-white cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-deal-orange/10 flex items-center justify-center flex-shrink-0">
                    <CategoryIcon className="w-5 h-5 text-deal-orange" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-deal-navy truncate">{title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {svc.rating} ⭐ • {svc.totalReviews} {t.common.reviewsCountPlural}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-lg font-black text-deal-orange">{svc.price.toLocaleString()} <span className="text-xs">{t.common.currency}</span></span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${svc.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {svc.isAvailable ? t.services.available : t.services.unavailable}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Bookings Tab ---
  if (dashboardActiveTab === 'bookings') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-teal via-deal-teal-dark to-deal-teal p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -bottom-8 -end-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black">{t.dashboard.bookings} 📋</h2>
            <p className="mt-1 text-white/80 text-sm">{locale === 'ar' ? 'جميع حجوزات الخدمات' : 'Toutes les réservations de services'}</p>
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
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-deal-navy truncate">
                      {getLocalizedValue(booking.name.ar, booking.name.fr)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getLocalizedValue(booking.customer.ar, booking.customer.fr)} • {booking.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="text-sm font-bold text-deal-navy hidden sm:block">
                      {booking.price.toLocaleString()} {t.common.currency}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {t.dashboard[booking.status.toLowerCase() as keyof typeof t.dashboard]}
                    </span>
                    {booking.status === 'PENDING' && (
                      <div className="flex gap-1">
                        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm hover:bg-emerald-600 transition-colors">
                          <Check className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors">
                          <X className="w-4 h-4 text-white" />
                        </motion.button>
                      </div>
                    )}
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-orange via-deal-orange-dark to-deal-gold p-6 text-white"
      >
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black">
            {t.dashboard.welcomeBack}، {currentUser?.name} 🔧
          </h2>
          <p className="mt-1 text-white/80 text-sm sm:text-base">
            {t.dashboard.services} • {t.dashboard.thisMonth}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              className="card-3d rounded-2xl p-4 sm:p-5 bg-white"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-deal-navy" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-black text-deal-navy truncate">{statsReady && <AnimatedCounter target={stat.value} duration={1000} />}</p>
                  <p className="text-[11px] sm:text-sm text-muted-foreground font-medium truncate">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-3d rounded-2xl bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.revenueChart}</h3>
            <TrendingUp className="w-5 h-5 text-deal-teal" />
          </div>
          <div className="flex items-end gap-2 h-48">
            {revenueData.map((bar, i) => (
              <motion.div
                key={i}
                className="flex-1 flex flex-col items-center gap-2"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
              >
                <span className="text-[10px] font-bold text-muted-foreground">{bar.value}k</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-deal-orange to-deal-gold transition-all duration-500 hover:from-deal-orange-dark hover:to-deal-gold-dark cursor-pointer min-h-[8px]"
                  style={{ height: `${(bar.value / maxRevenue) * 140}px` }}
                />
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {getLocalizedValue(bar.month.ar, bar.month.fr)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 card-3d rounded-2xl bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.recentBookings}</h3>
            <ClipboardList className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
            {bookings.slice(0, 4).map((booking, i) => {
              const status = statusConfig[booking.status];
              return (
                <motion.div
                  key={booking.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-deal-navy truncate">
                      {getLocalizedValue(booking.name.ar, booking.name.fr)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getLocalizedValue(booking.customer.ar, booking.customer.fr)} • {booking.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="text-sm font-bold text-deal-navy hidden sm:block">
                      {booking.price.toLocaleString()} {t.common.currency}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {t.dashboard[booking.status.toLowerCase() as keyof typeof t.dashboard]}
                    </span>
                    {booking.status === 'PENDING' && (
                      <div className="flex gap-1">
                        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm hover:bg-emerald-600 transition-colors">
                          <Check className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors">
                          <X className="w-4 h-4 text-white" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-3d rounded-2xl bg-white p-5 sm:p-6"
      >
        <h3 className="text-lg font-bold text-deal-navy mb-4">{t.dashboard.quickActions}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-3d-sm text-white text-xs sm:text-sm"
                style={{
                  background: action.color === 'bg-deal-orange'
                    ? 'linear-gradient(180deg, #FF8C5A 0%, #FF6B35 100%)'
                    : action.color === 'bg-deal-teal'
                      ? 'linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)'
                      : 'linear-gradient(180deg, #FBBF24 0%, #F59E0B 100%)',
                  boxShadow: action.color === 'bg-deal-orange'
                    ? '0 4px 0 0 #CC5529, 0 6px 8px rgba(255,107,53,0.25)'
                    : action.color === 'bg-deal-teal'
                      ? '0 4px 0 0 #0F766E, 0 6px 8px rgba(13,148,136,0.25)'
                      : '0 4px 0 0 #D97706, 0 6px 8px rgba(245,158,11,0.25)',
                  color: action.color === 'bg-deal-gold' ? '#1E293B' : '#FFF',
                }}
              >
                <Icon className="w-4 h-4 inline-block me-2" />
                {action.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
