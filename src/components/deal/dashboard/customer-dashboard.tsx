'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
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
  Loader2,
  XCircle,
} from 'lucide-react';
import { useI18n, useAppStore, useFavoritesStore } from '@/lib/store';
import { services, products, equipmentList } from '@/lib/data/mock';
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

const bookingStatusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-deal-orange/10', text: 'text-deal-orange', dot: 'bg-deal-orange' },
  CONFIRMED: { bg: 'bg-deal-teal/10', text: 'text-deal-teal', dot: 'bg-deal-teal' },
  ACCEPTED: { bg: 'bg-deal-teal/10', text: 'text-deal-teal', dot: 'bg-deal-teal' },
  IN_PROGRESS: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500' },
};

const orderStatusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-deal-orange/10', text: 'text-deal-orange', dot: 'bg-deal-orange' },
  CONFIRMED: { bg: 'bg-deal-teal/10', text: 'text-deal-teal', dot: 'bg-deal-teal' },
  PROCESSING: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  SHIPPED: { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-500' },
  DELIVERED: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500' },
};

interface APIBooking {
  id: string;
  type: string;
  startDate: string;
  status: string;
  totalPrice: number;
  notes: string | null;
  service?: { title: string; titleFr: string | null } | null;
  equipment?: { title: string; titleFr: string | null } | null;
  provider: { name: string; nameFr: string | null };
  createdAt: string;
}

interface APIOrder {
  id: string;
  quantity: number;
  totalPrice: number;
  status: string;
  deliveryAddress: string | null;
  notes: string | null;
  product: { title: string; titleFr: string | null };
  merchant: { name: string; nameFr: string | null; shopName: string | null; shopNameFr: string | null };
  createdAt: string;
}

export default function CustomerDashboard() {
  const { t, getLocalizedValue, locale } = useI18n();
  const { currentUser, setActiveSection, setShowDetailModal, setDetailType, setSelectedItemId, dashboardActiveTab } = useAppStore();
  const { favorites, toggleFavorite } = useFavoritesStore();

  // API state for bookings
  const [apiBookings, setApiBookings] = useState<APIBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // API state for orders
  const [apiOrders, setApiOrders] = useState<APIOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Cancel loading state
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!currentUser) return;
    setBookingsLoading(true);
    try {
      const res = await fetch(`/api/bookings?customerId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setApiBookings(data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  }, [currentUser]);

  const fetchOrders = useCallback(async () => {
    if (!currentUser) return;
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?customerId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setApiOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, [currentUser]);

  // Fetch data on mount for overview stats
  const [initialFetched, setInitialFetched] = useState(false);

  useEffect(() => {
    if (currentUser && !initialFetched) {
      Promise.all([fetchBookings(), fetchOrders()]).finally(() => setInitialFetched(true));
    }
  }, [currentUser, initialFetched, fetchBookings, fetchOrders]);

  useEffect(() => {
    if (dashboardActiveTab === 'bookings' && initialFetched) {
      fetchBookings();
    }
  }, [dashboardActiveTab, initialFetched, fetchBookings]);

  useEffect(() => {
    if (dashboardActiveTab === 'orders' && initialFetched) {
      fetchOrders();
    }
  }, [dashboardActiveTab, initialFetched, fetchOrders]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancelLoading(bookingId);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: 'CANCELLED' }),
      });
      if (res.ok) {
        toast.success(locale === 'ar' ? 'تم إلغاء الحجز' : 'Réservation annulée');
        fetchBookings();
      } else {
        toast.error(locale === 'ar' ? 'فشل إلغاء الحجز' : "Échec de l'annulation");
      }
    } catch {
      toast.error(locale === 'ar' ? 'فشل إلغاء الحجز' : "Échec de l'annulation");
    } finally {
      setCancelLoading(null);
    }
  };

  const stats = [
    { label: t.dashboard.activeBookings, value: apiBookings.filter(b => !['COMPLETED', 'CANCELLED'].includes(b.status)).length.toString(), icon: CalendarCheck, color: 'from-deal-orange to-deal-orange-dark', bg: 'bg-deal-orange/10' },
    { label: t.dashboard.completedOrders, value: apiOrders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED').length.toString(), icon: PackageCheck, color: 'from-deal-teal to-deal-teal-dark', bg: 'bg-deal-teal/10' },
    { label: t.dashboard.pendingReviews, value: apiBookings.filter(b => b.status === 'COMPLETED' && apiOrders.filter(o => o.status === 'DELIVERED').length === 0).length.toString(), icon: Star, color: 'from-deal-gold to-deal-gold-dark', bg: 'bg-deal-gold/10' },
  ];

  const statsReady = useMemo(() => true, []);

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

  const getBookingName = (booking: APIBooking) => {
    if (booking.service) return getLocalizedValue(booking.service.title, booking.service.titleFr);
    if (booking.equipment) return getLocalizedValue(booking.equipment.title, booking.equipment.titleFr);
    return locale === 'ar' ? 'حجز' : 'Réservation';
  };

  const getBookingType = (booking: APIBooking) => {
    if (booking.service) return 'service';
    if (booking.equipment) return 'equipment';
    return 'service';
  };

  const getProviderName = (booking: APIBooking) => {
    return getLocalizedValue(booking.provider.name, booking.provider.nameFr);
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
          <div className="absolute -top-8 -end-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black">{t.dashboard.bookings} 📋</h2>
            <p className="mt-1 text-white/80 text-sm">{locale === 'ar' ? 'جميع حجوزاتك وطلباتك' : 'Toutes vos réservations et demandes'}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          {bookingsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-deal-teal animate-spin" />
              <span className="ms-3 text-sm text-muted-foreground">{t.common.loading}</span>
            </div>
          ) : apiBookings.length === 0 ? (
            <div className="text-center py-12">
              <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-muted-foreground">{t.dashboard.noBookings}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {locale === 'ar' ? 'لم تقم بأي حجز بعد' : "Vous n'avez pas encore de réservation"}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {apiBookings.map((booking, i) => {
                const status = bookingStatusConfig[booking.status] || bookingStatusConfig.PENDING;
                const bType = getBookingType(booking);
                const canCancel = ['PENDING', 'CONFIRMED', 'ACCEPTED'].includes(booking.status);
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
                      bType === 'service' ? 'bg-deal-orange/10' : 'bg-deal-gold/10'
                    }`}>
                      {bType === 'service' ? (
                        <Wrench className="w-5 h-5 text-deal-orange" />
                      ) : (
                        <Truck className="w-5 h-5 text-deal-gold" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-deal-navy truncate">{getBookingName(booking)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {getProviderName(booking)} • {new Date(booking.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-bold text-deal-navy hidden sm:block">
                        {booking.totalPrice.toLocaleString()} {t.common.currency}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {t.dashboard[booking.status.toLowerCase() as keyof typeof t.dashboard] || booking.status}
                      </span>
                      {canCancel && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={cancelLoading === booking.id}
                          onClick={() => handleCancelBooking(booking.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {cancelLoading === booking.id ? (
                            <Loader2 className="w-3 h-3 text-red-500 animate-spin" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-500" />
                          )}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // --- Orders Tab ---
  if (dashboardActiveTab === 'orders') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-teal via-emerald-500 to-deal-teal p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -top-8 -end-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black">{t.dashboard.orders} 🛒</h2>
            <p className="mt-1 text-white/80 text-sm">{locale === 'ar' ? 'جميع طلباتك الشرائية' : 'Toutes vos commandes'}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          {ordersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-deal-teal animate-spin" />
              <span className="ms-3 text-sm text-muted-foreground">{t.common.loading}</span>
            </div>
          ) : apiOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-muted-foreground">{t.dashboard.noOrders}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {locale === 'ar' ? 'لم تقم بأي طلب شراء بعد' : "Vous n'avez pas encore de commande"}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {apiOrders.map((order, i) => {
                const status = orderStatusConfig[order.status] || orderStatusConfig.PENDING;
                const productName = getLocalizedValue(order.product.title, order.product.titleFr);
                const merchantName = getLocalizedValue(
                  order.merchant.shopName || order.merchant.name,
                  order.merchant.shopNameFr || order.merchant.nameFr
                );
                return (
                  <motion.div
                    key={order.id}
                    custom={i}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-deal-teal/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-deal-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-deal-navy truncate">{productName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {merchantName} • {order.quantity}x • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      {order.deliveryAddress && (
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5 truncate">
                          📍 {order.deliveryAddress}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-bold text-deal-navy hidden sm:block">
                        {order.totalPrice.toLocaleString()} {t.common.currency}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {t.dashboard[order.status.toLowerCase() as keyof typeof t.dashboard] || order.status}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-orange via-deal-gold to-deal-teal p-6 text-white"
      >
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="absolute -top-8 -end-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -start-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
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
            {apiBookings.length === 0 ? (
              <div className="text-center py-8">
                <CalendarCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">{t.dashboard.noBookings}</p>
              </div>
            ) : (
              apiBookings.slice(0, 5).map((booking, i) => {
                const status = bookingStatusConfig[booking.status] || bookingStatusConfig.PENDING;
                const bType = getBookingType(booking);
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
                      bType === 'service' ? 'bg-deal-orange/10' : 'bg-deal-gold/10'
                    }`}>
                      {bType === 'service' ? (
                        <Wrench className="w-5 h-5 text-deal-orange" />
                      ) : (
                        <Truck className="w-5 h-5 text-deal-gold" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-deal-navy truncate">{getBookingName(booking)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {getProviderName(booking)} • {new Date(booking.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-bold text-deal-navy hidden sm:block">
                        {booking.totalPrice.toLocaleString()} {t.common.currency}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {t.dashboard[booking.status.toLowerCase() as keyof typeof t.dashboard] || booking.status}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
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
