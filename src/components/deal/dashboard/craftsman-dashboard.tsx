'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
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
  Loader2,
  Inbox,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import ProfileTabContent from './profile-tab-content';
import { services } from '@/lib/data/mock';
import { AnimatedCounter } from '../animated-counter';
import { toast } from 'sonner';

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
  CONFIRMED: { bg: 'bg-deal-teal/10', text: 'text-deal-teal', dot: 'bg-deal-teal' },
  ACCEPTED: { bg: 'bg-deal-teal/10', text: 'text-deal-teal', dot: 'bg-deal-teal' },
  IN_PROGRESS: { bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-500' },
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

interface ApiService {
  id: string;
  title: string;
  titleFr?: string | null;
  price: number;
  isAvailable: boolean;
  rating: number;
  totalReviews: number;
  category?: { id: string; name: string; nameFr?: string | null; icon?: string | null } | null;
  provider?: { id: string; name: string; nameFr?: string | null } | null;
}

interface ApiBooking {
  id: string;
  customerId: string;
  providerId: string;
  type: string;
  totalPrice: number;
  status: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  createdAt: string;
  service?: {
    id: string;
    title: string;
    titleFr?: string | null;
  } | null;
  equipment?: {
    id: string;
    title: string;
    titleFr?: string | null;
  } | null;
  customer?: {
    id: string;
    name: string;
    nameFr?: string | null;
  } | null;
}

interface RevenueBar {
  month: { ar: string; fr: string };
  value: number;
}

export default function CraftsmanDashboard() {
  const { t, getLocalizedValue, locale } = useI18n();
  const { currentUser, dashboardActiveTab, setShowDetailModal, setDetailType, setSelectedItemId, setDashboardActiveTab, setShowAddItemPage } = useAppStore();

  // Real services state
  const [myServices, setMyServices] = useState<ApiService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesFetched, setServicesFetched] = useState(false);

  // Real bookings state
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsFetched, setBookingsFetched] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);

  // Overview loading
  const [overviewLoading, setOverviewLoading] = useState(true);

  const fallbackServices = services.slice(0, 8);

  // --- Fetch Services ---
  const fetchServices = useCallback(async () => {
    if (!currentUser?.id) return;
    setServicesLoading(true);
    try {
      const res = await fetch(`/api/services?providerId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setMyServices(data);
      }
    } catch {
      // silently fail
    } finally {
      setServicesLoading(false);
      setServicesFetched(true);
    }
  }, [currentUser?.id]);

  // --- Fetch Bookings ---
  const fetchBookings = useCallback(async () => {
    if (!currentUser?.id) return;
    setBookingsLoading(true);
    try {
      const res = await fetch(`/api/bookings?providerId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch {
      // silently fail
    } finally {
      setBookingsLoading(false);
      setBookingsFetched(true);
    }
  }, [currentUser?.id]);

  // --- Fetch overview data on mount ---
  useEffect(() => {
    if (currentUser?.id) {
      setOverviewLoading(true);
      Promise.all([fetchServices(), fetchBookings()]).finally(() => {
        setOverviewLoading(false);
      });
    }
  }, [currentUser?.id, fetchServices, fetchBookings]);

  // Fetch services when switching to services tab
  useEffect(() => {
    if (dashboardActiveTab === 'services' && currentUser?.id && !servicesFetched) {
      fetchServices();
    }
  }, [dashboardActiveTab, currentUser?.id, servicesFetched, fetchServices]);

  // Fetch bookings when switching to bookings tab
  useEffect(() => {
    if (dashboardActiveTab === 'bookings' && currentUser?.id && !bookingsFetched) {
      fetchBookings();
    }
  }, [dashboardActiveTab, currentUser?.id, bookingsFetched, fetchBookings]);

  // --- Computed Stats ---
  const stats = useMemo(() => {
    const totalServices = myServices.length > 0 ? myServices.length : 0;
    const activeBookings = bookings.filter(b => !['COMPLETED', 'CANCELLED'].includes(b.status)).length;
    const totalRevenue = bookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const avgRating = myServices.length > 0
      ? (myServices.reduce((sum, s) => sum + (s.rating || 0), 0) / myServices.length).toFixed(1)
      : '0';
    return [
      { label: t.dashboard.totalServices, value: String(totalServices), icon: Wrench, color: 'from-deal-orange to-deal-orange-dark', bg: 'bg-deal-orange/10' },
      { label: t.dashboard.activeBookings, value: String(activeBookings), icon: CalendarCheck, color: 'from-deal-teal to-deal-teal-dark', bg: 'bg-deal-teal/10' },
      { label: t.dashboard.totalRevenue, value: totalRevenue.toLocaleString(), icon: DollarSign, color: 'from-deal-gold to-deal-gold-dark', bg: 'bg-deal-gold/10' },
      { label: t.dashboard.avgRating, value: avgRating, icon: Star, color: 'from-deal-orange to-deal-gold', bg: 'bg-deal-gold/10' },
    ];
  }, [myServices, bookings, t.dashboard.totalServices, t.dashboard.activeBookings, t.dashboard.totalRevenue, t.dashboard.avgRating]);

  const statsReady = useMemo(() => !overviewLoading, [overviewLoading]);

  // --- Revenue Data from completed bookings ---
  const revenueData: RevenueBar[] = useMemo(() => {
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
    if (completedBookings.length === 0) return [];

    const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const monthNamesFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    const monthlyRevenue: Record<number, number> = {};
    completedBookings.forEach(b => {
      const date = new Date(b.startDate || b.createdAt);
      const yearMonth = date.getFullYear() * 100 + date.getMonth();
      monthlyRevenue[yearMonth] = (monthlyRevenue[yearMonth] || 0) + (b.totalPrice || 0);
    });

    // Sort by yearMonth descending, take last 6
    const sortedMonths = Object.entries(monthlyRevenue)
      .sort(([a], [b]) => Number(b) - Number(a))
      .slice(0, 6)
      .reverse();

    return sortedMonths.map(([ym, rev]) => {
      const year = Math.floor(Number(ym) / 100);
      const month = Number(ym) % 100;
      return {
        month: { ar: monthNamesAr[month], fr: monthNamesFr[month] },
        value: Math.round(rev / 1000),
      };
    });
  }, [bookings]);

  const maxRevenue = revenueData.length > 0 ? Math.max(...revenueData.map(d => d.value), 1) : 1;

  // --- Update booking status ---
  const handleUpdateBookingStatus = useCallback(async (bookingId: string, newStatus: string) => {
    setUpdatingBookingId(bookingId);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });
      if (res.ok) {
        const updatedBooking = await res.json();
        setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));
        toast.success(newStatus === 'CONFIRMED' ? t.dashboard.accept : t.dashboard.cancelled);
      } else {
        const errData = await res.json().catch(() => ({ error: 'Failed' }));
        toast.error(errData.error || (locale === 'ar' ? 'فشل تحديث الحجز' : 'Échec de la mise à jour'));
      }
    } catch {
      toast.error(locale === 'ar' ? 'خطأ في الاتصال' : 'Erreur de connexion');
    } finally {
      setUpdatingBookingId(null);
    }
  }, [t.dashboard.accept, t.dashboard.cancelled, locale]);

  // Add service form state
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [addFormLoading, setAddFormLoading] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('elec');
  const [newServicePrice, setNewServicePrice] = useState('');

  const handleSubmitAddService = async () => {
    if (!newServiceTitle.trim() || !newServicePrice.trim() || !currentUser?.id) return;
    setAddFormLoading(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newServiceTitle,
          description: newServiceDesc,
          categoryId: newServiceCategory,
          price: Number(newServicePrice),
          providerId: currentUser.id,
        }),
      });
      if (res.ok) {
        toast.success(locale === 'ar' ? t.dashboard.addedSuccessfully : t.dashboard.addedSuccessfully);
        setShowAddServiceForm(false);
        setNewServiceTitle('');
        setNewServiceDesc('');
        setNewServiceCategory('elec');
        setNewServicePrice('');
        setServicesFetched(false);
        await fetchServices();
      } else {
        toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue');
      }
    } catch {
      toast.error(locale === 'ar' ? 'خطأ في الاتصال' : 'Erreur de connexion');
    } finally {
      setAddFormLoading(false);
    }
  };

  const quickActions = [
    { label: t.dashboard.addNewService, icon: Plus, color: 'bg-deal-orange', action: () => setShowAddItemPage('service') },
    { label: t.dashboard.viewAllBookings, icon: ClipboardList, color: 'bg-deal-teal', action: () => setDashboardActiveTab('bookings') },
    { label: t.dashboard.editProfile, icon: UserCog, color: 'bg-deal-gold', action: () => setDashboardActiveTab('profile') },
  ];

  const handleOpenService = (id: string) => {
    setSelectedItemId(id);
    setDetailType('service');
    setShowDetailModal(true);
  };

  const getServiceDisplayInfo = (svc: ApiService) => {
    const title = getLocalizedValue(svc.title, svc.titleFr);
    return { title };
  };

  // --- Render Booking Item ---
  const renderBookingItem = (booking: ApiBooking, i: number) => {
    const status = statusConfig[booking.status] || statusConfig.PENDING;
    const bookingName = booking.service
      ? getLocalizedValue(booking.service.title, booking.service.titleFr)
      : booking.equipment
        ? getLocalizedValue(booking.equipment.title, booking.equipment.titleFr)
        : (locale === 'ar' ? 'خدمة غير معروفة' : 'Service inconnu');
    const customerName = booking.customer
      ? getLocalizedValue(booking.customer.name, booking.customer.nameFr)
      : (locale === 'ar' ? 'عميل غير معروف' : 'Client inconnu');
    const date = booking.startDate ? new Date(booking.startDate).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ') : '';

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
          <p className="font-bold text-sm text-deal-navy truncate">{bookingName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {customerName} • {date}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-sm font-bold text-deal-navy hidden sm:block">
            {booking.totalPrice.toLocaleString()} {t.common.currency}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold ${status.bg} ${status.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {booking.status === 'CONFIRMED' ? t.dashboard.confirmed :
             booking.status === 'IN_PROGRESS' ? t.dashboard.inProgress :
             t.dashboard[booking.status.toLowerCase() as keyof typeof t.dashboard] || booking.status}
          </span>
          {booking.status === 'PENDING' && (
            <div className="flex gap-1">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleUpdateBookingStatus(booking.id, 'CONFIRMED')}
                disabled={updatingBookingId === booking.id}
                className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {updatingBookingId === booking.id ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Check className="w-4 h-4 text-white" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleUpdateBookingStatus(booking.id, 'CANCELLED')}
                disabled={updatingBookingId === booking.id}
                className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {updatingBookingId === booking.id ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <X className="w-4 h-4 text-white" />}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // --- Profile Tab ---
  if (dashboardActiveTab === 'profile') {
    return <ProfileTabContent role="craftsman" />;
  }

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
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchServices}
                className="btn-3d-sm text-white text-xs"
                style={{
                  background: 'linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)',
                  boxShadow: '0 4px 0 0 #0F766E, 0 6px 8px rgba(13,148,136,0.25)',
                }}
              >
                {t.dashboard.refresh}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowAddItemPage('service'); }}
                className="btn-3d-sm text-white text-xs"
                style={{
                  background: 'linear-gradient(180deg, #FF8C5A 0%, #FF6B35 100%)',
                  boxShadow: '0 4px 0 0 #CC5529, 0 6px 8px rgba(255,107,53,0.25)',
                }}
              >
                <Plus className="w-4 h-4 inline-block me-1" />
                {t.dashboard.addNewService}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {servicesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-deal-orange animate-spin" />
            <span className="ms-3 text-sm text-muted-foreground">{t.common.loading}</span>
          </div>
        ) : myServices.length === 0 && servicesFetched ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm font-bold text-muted-foreground">{t.common.noServices}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(myServices.length > 0 ? myServices : fallbackServices).map((svc, i) => {
              const CategoryIcon = categoryIconMap[svc.category?.id || ''] || Wrench;
              const title = 'title' in svc ? svc.title : getLocalizedValue((svc as { title: string; titleFr?: string | null }).title, (svc as { title: string; titleFr?: string | null }).titleFr);
              const displayTitle = 'categoryId' in svc ? getLocalizedValue(svc.title, (svc as { titleFr?: string | null }).titleFr) : title;
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
                      <p className="text-sm font-bold text-deal-navy truncate">{displayTitle}</p>
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
          <div className="absolute -bottom-8 -end-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">{t.dashboard.bookings} 📋</h2>
              <p className="mt-1 text-white/80 text-sm">{locale === 'ar' ? 'جميع حجوزات الخدمات' : 'Toutes les réservations de services'}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchBookings}
              className="btn-3d-sm text-white text-xs"
              style={{
                background: 'linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)',
                boxShadow: '0 4px 0 0 #0F766E, 0 6px 8px rgba(13,148,136,0.25)',
              }}
            >
              {t.dashboard.refresh}
            </motion.button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          {bookingsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-deal-teal animate-spin" />
              <span className="ms-3 text-sm text-muted-foreground">{t.common.loading}</span>
            </div>
          ) : bookings.length === 0 && bookingsFetched ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Inbox className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm font-bold text-muted-foreground">{t.dashboard.noBookings}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {bookings.map((booking, i) => renderBookingItem(booking, i))}
            </div>
          )}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewLoading ? (
          <div className="col-span-full flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-deal-orange animate-spin" />
            <span className="ms-3 text-sm text-muted-foreground">{t.common.loading}</span>
          </div>
        ) : (
          stats.map((stat, i) => {
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
          })
        )}
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
          {overviewLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 text-deal-orange animate-spin" />
            </div>
          ) : revenueData.length > 0 ? (
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
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'لا توجد إيرادات مكتملة بعد' : 'Aucun revenu complété'}</p>
            </div>
          )}
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
          {overviewLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-deal-orange animate-spin" />
            </div>
          ) : bookings.length === 0 && bookingsFetched ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Inbox className="w-10 h-10 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-muted-foreground">{t.dashboard.noBookings}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {bookings.slice(0, 4).map((booking, i) => renderBookingItem(booking, i))}
            </div>
          )}
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
                onClick={action.action}
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
        <AnimatePresence>
          {showAddServiceForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-deal-navy">{t.dashboard.addNewService}</h4>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowAddServiceForm(false)} className="text-xs text-muted-foreground hover:text-deal-navy">{t.common.cancel}</motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={newServiceTitle} onChange={(e) => setNewServiceTitle(e.target.value)} placeholder={t.dashboard.titleField} className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange" dir={locale === 'ar' ? 'rtl' : 'ltr'} />
                  <input type="number" value={newServicePrice} onChange={(e) => setNewServicePrice(e.target.value)} placeholder={t.dashboard.priceField} className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange" dir="ltr" />
                  <select value={newServiceCategory} onChange={(e) => setNewServiceCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange">
                    <option value="elec">{t.categories.electrical}</option>
                    <option value="plumb">{t.categories.plumbing}</option>
                    <option value="build">{t.categories.construction}</option>
                    <option value="carp">{t.categories.carpentry}</option>
                    <option value="hvac">{t.categories.hvac}</option>
                    <option value="metal">{t.categories.metalwork}</option>
                    <option value="paint">{t.categories.painting}</option>
                    <option value="clean">{t.categories.cleaning}</option>
                  </select>
                  <input type="text" value={newServiceDesc} onChange={(e) => setNewServiceDesc(e.target.value)} placeholder={t.dashboard.descriptionField} className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange" dir={locale === 'ar' ? 'rtl' : 'ltr'} />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={addFormLoading || !newServiceTitle.trim() || !newServicePrice.trim()}
                  onClick={handleSubmitAddService}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-deal-orange to-orange-500 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  {addFormLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  {t.common.add}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
