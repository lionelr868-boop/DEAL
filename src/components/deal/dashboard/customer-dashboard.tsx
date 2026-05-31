'use client';

import { motion } from 'framer-motion';
import {
  CalendarCheck,
  PackageCheck,
  Star,
  Wrench,
  ShoppingBag,
  Truck,
  Clock,
  ChevronLeft,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';

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
  const { t, getLocalizedValue } = useI18n();
  const { currentUser, setActiveSection } = useAppStore();

  const stats = [
    { label: t.dashboard.activeBookings, value: '3', icon: CalendarCheck, color: 'from-deal-orange to-deal-orange-dark', bg: 'bg-deal-orange/10' },
    { label: t.dashboard.completedOrders, value: '12', icon: PackageCheck, color: 'from-deal-teal to-deal-teal-dark', bg: 'bg-deal-teal/10' },
    { label: t.dashboard.pendingReviews, value: '2', icon: Star, color: 'from-deal-gold to-deal-gold-dark', bg: 'bg-deal-gold/10' },
  ];

  const bookings: Booking[] = [
    {
      id: '1',
      name: { ar: 'تمديد كهربائي', fr: 'Installation électrique' },
      provider: { ar: 'أحمد بن علي', fr: 'Ahmed Ben Ali' },
      date: '2025-01-15',
      status: 'IN_PROGRESS',
      price: 15000,
      type: 'service',
    },
    {
      id: '2',
      name: { ar: 'خرسانة جاهزة', fr: 'Béton prêt à l\'emploi' },
      provider: { ar: 'مؤسسة البناء الحديث', fr: 'Entreprise Bâti Moderne' },
      date: '2025-01-18',
      status: 'PENDING',
      price: 45000,
      type: 'product',
    },
    {
      id: '3',
      name: { ar: 'إيجار رافعة', fr: 'Location de grue' },
      provider: { ar: 'شركة المعدات الثقيلة', fr: 'Équipements Lourds SARL' },
      date: '2025-01-10',
      status: 'ACCEPTED',
      price: 25000,
      type: 'equipment',
    },
    {
      id: '4',
      name: { ar: 'دهان غرف', fr: 'Peinture de chambres' },
      provider: { ar: 'كريم الدهان', fr: 'Karim Peinture' },
      date: '2025-01-05',
      status: 'COMPLETED',
      price: 35000,
      type: 'service',
    },
  ];

  const quickActions = [
    { label: t.dashboard.browseServices, icon: Wrench, color: 'bg-deal-orange', action: () => setActiveSection('services') },
    { label: t.dashboard.browseProducts, icon: ShoppingBag, color: 'bg-deal-teal', action: () => setActiveSection('products') },
    { label: t.dashboard.browseEquipment, icon: Truck, color: 'bg-deal-gold', action: () => setActiveSection('equipment') },
  ];

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
                  <p className="text-2xl font-black text-deal-navy">{stat.value}</p>
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
