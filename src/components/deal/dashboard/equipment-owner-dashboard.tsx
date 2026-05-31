'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Truck,
  CalendarCheck,
  DollarSign,
  Star,
  Plus,
  ClipboardList,
  UserCog,
  CheckCircle2,
  Clock,
  Wrench,
  BarChart3,
  Settings,
  Loader2,
  Inbox,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import { equipmentList } from '@/lib/data/mock';
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
  ACTIVE: { bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-500' },
  COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500' },
};

interface ApiEquipment {
  id: string;
  title: string;
  titleFr?: string | null;
  dailyPrice: number;
  weeklyPrice?: number | null;
  monthlyPrice?: number | null;
  status: string;
  rating: number;
  totalReviews: number;
  owner?: { id: string; name: string; nameFr?: string | null } | null;
}

export default function EquipmentOwnerDashboard() {
  const { t, getLocalizedValue, locale } = useI18n();
  const { currentUser, dashboardActiveTab, setShowDetailModal, setDetailType, setSelectedItemId } = useAppStore();

  // Real equipment state
  const [myEquipment, setMyEquipment] = useState<ApiEquipment[]>([]);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [equipmentFetched, setEquipmentFetched] = useState(false);

  const fallbackEquipment = equipmentList.slice(0, 8);

  const stats = [
    { label: t.dashboard.totalEquipment, value: '12', icon: Truck, bg: 'bg-deal-gold/10' },
    { label: t.dashboard.activeRentals, value: '7', icon: CalendarCheck, bg: 'bg-deal-teal/10' },
    { label: t.dashboard.revenue, value: '340,000', icon: DollarSign, bg: 'bg-deal-orange/10' },
    { label: t.dashboard.avgRating, value: '4.7', icon: Star, bg: 'bg-deal-gold/10' },
  ];

  const statsReady = useMemo(() => true, []);

  const rentals = [
    { id: '1', equipment: { ar: 'رافعة برجية 50 طن', fr: 'Grue à tour 50T' }, renter: { ar: 'شركة البناء الوطنية', fr: 'Entreprise Nationale de Bâtiment' }, startDate: '2025-01-01', endDate: '2025-02-01', status: 'ACTIVE', total: 120000 },
    { id: '2', equipment: { ar: 'حفارة كاتربيلر', fr: 'Excavatrice Caterpillar' }, renter: { ar: 'مؤسسة الأشغال العمومية', fr: 'Entreprise de Travaux Publics' }, startDate: '2025-01-10', endDate: '2025-01-25', status: 'ACTIVE', total: 85000 },
    { id: '3', equipment: { ar: 'خلاطة خرسانة', fr: 'Bétonnière' }, renter: { ar: 'أحمد بن سعيد', fr: 'Ahmed Ben Said' }, startDate: '2025-01-15', endDate: '2025-01-20', status: 'PENDING', total: 15000 },
    { id: '4', equipment: { ar: 'مولد كهربائي 100 كفاس', fr: 'Groupe électrogène 100KVA' }, renter: { ar: 'مشاريع سوق أهراس', fr: 'Projets Souk Ahras' }, startDate: '2025-01-05', endDate: '2025-01-12', status: 'COMPLETED', total: 35000 },
  ];

  const quickActions = [
    { label: t.dashboard.addEquipment, icon: Plus, color: 'bg-deal-gold' },
    { label: t.dashboard.viewRentals, icon: ClipboardList, color: 'bg-deal-teal' },
    { label: t.dashboard.manageProfile, icon: UserCog, color: 'bg-deal-orange' },
  ];

  // Computed equipment status from real data
  const equipmentStatus = useMemo(() => {
    if (myEquipment.length > 0) {
      const available = myEquipment.filter(e => e.status === 'AVAILABLE').length;
      const rented = myEquipment.filter(e => e.status === 'RENTED' || e.status === 'ACTIVE').length;
      const maintenance = myEquipment.filter(e => e.status === 'MAINTENANCE').length;
      return [
        { label: t.dashboard.available, value: available, color: 'bg-emerald-500', lightBg: 'bg-emerald-50', textColor: 'text-emerald-600' },
        { label: t.dashboard.rented, value: rented, color: 'bg-amber-500', lightBg: 'bg-amber-50', textColor: 'text-amber-600' },
        { label: t.dashboard.maintenance, value: maintenance, color: 'bg-deal-orange', lightBg: 'bg-deal-orange/10', textColor: 'text-deal-orange' },
      ];
    }
    return [
      { label: t.dashboard.available, value: 5, color: 'bg-emerald-500', lightBg: 'bg-emerald-50', textColor: 'text-emerald-600' },
      { label: t.dashboard.rented, value: 5, color: 'bg-amber-500', lightBg: 'bg-amber-50', textColor: 'text-amber-600' },
      { label: t.dashboard.maintenance, value: 2, color: 'bg-deal-orange', lightBg: 'bg-deal-orange/10', textColor: 'text-deal-orange' },
    ];
  }, [myEquipment, t.dashboard.available, t.dashboard.rented, t.dashboard.maintenance]);

  const totalEquipmentCount = equipmentStatus.reduce((a, b) => a + b.value, 0);

  // Fetch equipment when switching to equipment tab
  const fetchEquipment = useCallback(async () => {
    if (!currentUser?.id) return;
    setEquipmentLoading(true);
    try {
      const res = await fetch(`/api/equipment?ownerId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setMyEquipment(data);
      }
    } catch {
      // silently fail
    } finally {
      setEquipmentLoading(false);
      setEquipmentFetched(true);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (dashboardActiveTab === 'equipment' && currentUser?.id && !equipmentFetched) {
      fetchEquipment();
    }
  }, [dashboardActiveTab, currentUser?.id, equipmentFetched, fetchEquipment]);

  const handleOpenEquipment = (id: string) => {
    setSelectedItemId(id);
    setDetailType('equipment');
    setShowDetailModal(true);
  };

  const getEquipmentStatusInfo = (eqStatus: string) => {
    if (eqStatus === 'AVAILABLE') {
      return { bg: 'bg-emerald-50', text: 'text-emerald-600', label: t.dashboard.available };
    } else if (eqStatus === 'RENTED' || eqStatus === 'ACTIVE') {
      return { bg: 'bg-amber-50', text: 'text-amber-600', label: t.dashboard.rented };
    } else {
      return { bg: 'bg-deal-orange/10', text: 'text-deal-orange', label: t.dashboard.maintenance };
    }
  };

  // --- Equipment Status Tab ---
  if (dashboardActiveTab === 'equipment') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-gold via-deal-gold-dark to-deal-orange p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -top-10 -start-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">{t.dashboard.equipmentStatus} 🚜</h2>
              <p className="mt-1 text-white/80 text-sm">{locale === 'ar' ? 'إدارة حالة المعدات' : 'Gérer l\'état des équipements'}</p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchEquipment}
                className="btn-3d-sm text-white text-xs"
                style={{
                  background: 'linear-gradient(180deg, #FF8C5A 0%, #FF6B35 100%)',
                  boxShadow: '0 4px 0 0 #CC5529, 0 6px 8px rgba(255,107,53,0.25)',
                }}
              >
                {t.dashboard.refresh}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d-sm text-deal-navy text-xs"
                style={{
                  background: 'linear-gradient(180deg, #FBBF24 0%, #F59E0B 100%)',
                  boxShadow: '0 4px 0 0 #D97706, 0 6px 8px rgba(245,158,11,0.25)',
                }}
              >
                <Plus className="w-4 h-4 inline-block me-1" />
                {t.dashboard.addEquipment}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Status overview mini cards */}
        <div className="grid grid-cols-3 gap-3">
          {equipmentStatus.map((item, i) => (
            <motion.div
              key={item.label}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="card-3d rounded-xl p-4 bg-white text-center"
            >
              <span className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center mx-auto mb-2 shadow-sm`}>
                {item.label === t.dashboard.available ? <CheckCircle2 className="w-4 h-4 text-white" /> :
                 item.label === t.dashboard.rented ? <Truck className="w-4 h-4 text-white" /> :
                 <Settings className="w-4 h-4 text-white" />}
              </span>
              <p className="text-2xl font-black text-deal-navy">{item.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Equipment list */}
        {equipmentLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-deal-gold animate-spin" />
            <span className="ms-3 text-sm text-muted-foreground">{t.common.loading}</span>
          </div>
        ) : myEquipment.length === 0 && equipmentFetched ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm font-bold text-muted-foreground">{t.common.noEquipment}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(myEquipment.length > 0 ? myEquipment : fallbackEquipment).map((eq, i) => {
              const title = getLocalizedValue(eq.title, eq.titleFr || null);
              const status = eq.status || 'AVAILABLE';
              const statusInfo = getEquipmentStatusInfo(status);
              const dailyPrice = 'dailyPrice' in eq ? (eq as ApiEquipment).dailyPrice : (eq as { dailyPrice: number }).dailyPrice;
              const eqRating = 'rating' in eq ? (eq as ApiEquipment).rating : (eq as { rating: number }).rating;
              const eqReviews = 'totalReviews' in eq ? (eq as ApiEquipment).totalReviews : (eq as { totalReviews: number }).totalReviews;
              return (
                <motion.div
                  key={eq.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => handleOpenEquipment(eq.id)}
                  className="card-3d rounded-2xl p-4 bg-white cursor-pointer"
                >
                  <div className="w-full h-20 rounded-xl mb-3 bg-gradient-to-br from-deal-gold/60 to-amber-400/60 flex items-center justify-center">
                    <Wrench className="w-8 h-8 text-white/40" />
                  </div>
                  <div className="min-w-0 mb-2">
                    <p className="text-sm font-bold text-deal-navy truncate">{title}</p>
                    <p className="text-[10px] text-muted-foreground">{eqRating} ⭐ • {eqReviews} {t.common.reviewsCountPlural}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-lg font-black text-deal-gold">{dailyPrice.toLocaleString()} <span className="text-xs">{t.common.currency}/{t.equipment.daily}</span></span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // --- Rentals Tab ---
  if (dashboardActiveTab === 'rentals') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-teal via-deal-teal-dark to-deal-teal p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black">{t.dashboard.recentBookings} 📋</h2>
            <p className="mt-1 text-white/80 text-sm">{locale === 'ar' ? 'جميع الإيجارات النشطة والمنتهية' : 'Toutes les locations actives et terminées'}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {rentals.map((rental, i) => {
              const status = statusConfig[rental.status] || statusConfig.PENDING;
              return (
                <motion.div
                  key={rental.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4 }}
                  className="p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 rounded-lg bg-deal-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Truck className="w-5 h-5 text-deal-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-deal-navy truncate">{getLocalizedValue(rental.equipment.ar, rental.equipment.fr)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{getLocalizedValue(rental.renter.ar, rental.renter.fr)}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {rental.startDate} → {rental.endDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-deal-navy">{rental.total.toLocaleString()} {t.common.currency}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {rental.status === 'ACTIVE' ? t.dashboard.inProgress : t.dashboard[rental.status.toLowerCase() as keyof typeof t.dashboard]}
                      </span>
                    </div>
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-gold via-deal-gold-dark to-deal-orange p-6 text-white"
      >
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="absolute -top-10 -start-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black">
            {t.dashboard.welcomeBack}، {currentUser?.name} 🚜
          </h2>
          <p className="mt-1 text-white/80 text-sm sm:text-base">
            {t.dashboard.equipment} • {t.dashboard.thisMonth}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
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
        {/* Equipment Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-3d rounded-2xl bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.equipmentStatus}</h3>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          {/* Donut-style visual */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {equipmentStatus.map((item, i) => {
                  const percentage = totalEquipmentCount > 0 ? (item.value / totalEquipmentCount) * 100 : 0;
                  const circumference = 2 * Math.PI * 45;
                  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                  const offset = equipmentStatus.slice(0, i).reduce((acc, prev) => {
                    return acc + (prev.value / totalEquipmentCount) * 2 * Math.PI * 45;
                  }, 0);
                  return (
                    <motion.circle
                      key={i}
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="14"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                      className={item.color}
                      initial={{ strokeDasharray: `0 ${circumference}` }}
                      animate={{ strokeDasharray }}
                      transition={{ delay: 0.4 + i * 0.15, duration: 0.8 }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-black text-deal-navy">{totalEquipmentCount}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{t.dashboard.totalEquipment}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="space-y-2.5">
            {equipmentStatus.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium text-deal-navy">{item.label}</span>
                </div>
                <span className={`text-sm font-bold ${item.textColor}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Rentals */}
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
            {rentals.map((rental, i) => {
              const status = statusConfig[rental.status] || statusConfig.PENDING;
              return (
                <motion.div
                  key={rental.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4 }}
                  className="p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 rounded-lg bg-deal-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Truck className="w-5 h-5 text-deal-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-deal-navy truncate">{getLocalizedValue(rental.equipment.ar, rental.equipment.fr)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{getLocalizedValue(rental.renter.ar, rental.renter.fr)}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {rental.startDate} → {rental.endDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-deal-navy">{rental.total.toLocaleString()} {t.common.currency}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {rental.status === 'ACTIVE' ? t.dashboard.inProgress : t.dashboard[rental.status.toLowerCase() as keyof typeof t.dashboard]}
                      </span>
                    </div>
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
