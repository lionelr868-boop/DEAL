'use client';

import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Star,
  Plus,
  ClipboardList,
  UserCog,
  AlertTriangle,
  TrendingUp,
  PackageCheck,
  ImageIcon,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import { products } from '@/lib/data/mock';

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
  PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' },
  SHIPPED: { bg: 'bg-purple-100', text: 'text-purple-600', dot: 'bg-purple-500' },
  COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500' },
};

export default function MerchantDashboard() {
  const { t, getLocalizedValue, locale } = useI18n();
  const { currentUser, dashboardActiveTab, setShowDetailModal, setDetailType, setSelectedItemId } = useAppStore();

  const myProducts = products.slice(0, 8);

  const stats = [
    { label: t.dashboard.totalProducts, value: '24', icon: Package, bg: 'bg-deal-teal/10' },
    { label: t.dashboard.totalOrders, value: '38', icon: ShoppingCart, bg: 'bg-deal-orange/10' },
    { label: t.dashboard.revenue, value: '520,000', icon: DollarSign, bg: 'bg-deal-gold/10' },
    { label: t.dashboard.avgRating, value: '4.6', icon: Star, bg: 'bg-deal-gold/10' },
  ];

  const orders = [
    { id: 'ORD-001', product: { ar: 'أسمنت بوورتلاند 50كغ', fr: 'Ciment Portland 50kg' }, customer: { ar: 'أحمد بلقاسم', fr: 'Ahmed Belkacem' }, qty: '50', date: '2025-01-15', status: 'PROCESSING', total: 75000 },
    { id: 'ORD-002', product: { ar: 'طوب أحمر', fr: 'Briques rouges' }, customer: { ar: 'محمد العربي', fr: 'Mohamed Larbi' }, qty: '2000', date: '2025-01-14', status: 'PENDING', total: 120000 },
    { id: 'ORD-003', product: { ar: 'حديد تسليح 12مم', fr: 'Fer à béton 12mm' }, customer: { ar: 'كريم بوزيد', fr: 'Karim Bouzid' }, qty: '100', date: '2025-01-13', status: 'SHIPPED', total: 95000 },
    { id: 'ORD-004', product: { ar: 'دهان أبيض 20لتر', fr: 'Peinture blanche 20L' }, customer: { ar: 'سمير حمادي', fr: 'Samir Hamadi' }, qty: '10', date: '2025-01-12', status: 'COMPLETED', total: 45000 },
    { id: 'ORD-005', product: { ar: 'أنابيب PVC 110مم', fr: 'Tuyaux PVC 110mm' }, customer: { ar: 'نادر مراد', fr: 'Nadir Mourad' }, qty: '30', date: '2025-01-11', status: 'CANCELLED', total: 18000 },
  ];

  const lowStockProducts = [
    { name: { ar: 'مسامير 6مم', fr: 'Vis 6mm' }, stock: 15, threshold: 50 },
    { name: { ar: 'أبواب خشبية', fr: 'Portes en bois' }, stock: 3, threshold: 10 },
    { name: { ar: 'أسلاك كهربائية', fr: 'Fils électriques' }, stock: 25, threshold: 100 },
    { name: { ar: 'زجاج 4مم', fr: 'Verre 4mm' }, stock: 8, threshold: 30 },
  ];

  const quickActions = [
    { label: t.dashboard.addProduct, icon: Plus, color: 'bg-deal-teal' },
    { label: t.dashboard.manageOrders, icon: ClipboardList, color: 'bg-deal-orange' },
    { label: t.dashboard.viewProfile, icon: UserCog, color: 'bg-deal-gold' },
  ];

  const handleOpenProduct = (id: string) => {
    setSelectedItemId(id);
    setDetailType('product');
    setShowDetailModal(true);
  };

  // --- Products Tab ---
  if (dashboardActiveTab === 'products') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-teal via-deal-teal-dark to-deal-teal p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -bottom-8 -end-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">{t.dashboard.products} 📦</h2>
              <p className="mt-1 text-white/80 text-sm">{locale === 'ar' ? 'إدارة وعرض منتجاتك' : 'Gérer et afficher vos produits'}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-3d-sm text-white text-xs"
              style={{
                background: 'linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)',
                boxShadow: '0 4px 0 0 #0F766E, 0 6px 8px rgba(13,148,136,0.25)',
              }}
            >
              <Plus className="w-4 h-4 inline-block me-1" />
              {t.dashboard.addProduct}
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProducts.map((prod, i) => {
            const title = getLocalizedValue(prod.title, prod.titleFr);
            return (
              <motion.div
                key={prod.id}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => handleOpenProduct(prod.id)}
                className="card-3d rounded-2xl p-4 bg-white cursor-pointer"
              >
                <div className="w-full h-20 rounded-xl mb-3 bg-gradient-to-br from-deal-teal/60 to-emerald-400/60 flex items-center justify-center">
                  <PackageCheck className="w-8 h-8 text-white/40" />
                </div>
                <div className="min-w-0 mb-2">
                  <p className="text-sm font-bold text-deal-navy truncate">{title}</p>
                  <p className="text-[10px] text-muted-foreground">{getLocalizedValue(prod.categoryName, prod.categoryNameFr)}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-lg font-black text-deal-teal">{prod.price.toLocaleString()} <span className="text-xs">{t.common.currency}</span></span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prod.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {prod.stock > 0 ? `${t.products.inStock}: ${prod.stock}` : t.products.outOfStock}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Orders Tab ---
  if (dashboardActiveTab === 'orders') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-orange via-deal-orange-dark to-deal-gold p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black">{t.dashboard.orders} 🛒</h2>
            <p className="mt-1 text-white/80 text-sm">{locale === 'ar' ? 'جميع الطلبات الواردة' : 'Toutes les commandes reçues'}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {orders.map((order, i) => {
              const status = statusConfig[order.status] || statusConfig.PENDING;
              return (
                <motion.div
                  key={order.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground bg-gray-200 px-1.5 py-0.5 rounded">{order.id}</span>
                    </div>
                    <p className="font-bold text-sm text-deal-navy truncate mt-1">{getLocalizedValue(order.product.ar, order.product.fr)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getLocalizedValue(order.customer.ar, order.customer.fr)} • {t.common.currency} {order.qty} • {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="text-sm font-bold text-deal-navy hidden sm:block">{order.total.toLocaleString()} {t.common.currency}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {order.status}
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-teal via-deal-teal-dark to-deal-teal p-6 text-white"
      >
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="absolute -bottom-8 -end-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black">
            {t.dashboard.welcomeBack}، {currentUser?.name} 🏪
          </h2>
          <p className="mt-1 text-white/80 text-sm sm:text-base">
            {t.dashboard.products} • {t.dashboard.thisMonth}
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
                  <p className="text-xl sm:text-2xl font-black text-deal-navy truncate">{stat.value}</p>
                  <p className="text-[11px] sm:text-sm text-muted-foreground font-medium truncate">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 card-3d rounded-2xl bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.orders}</h3>
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {orders.slice(0, 4).map((order, i) => {
              const status = statusConfig[order.status] || statusConfig.PENDING;
              return (
                <motion.div
                  key={order.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground bg-gray-200 px-1.5 py-0.5 rounded">{order.id}</span>
                    </div>
                    <p className="font-bold text-sm text-deal-navy truncate mt-1">{getLocalizedValue(order.product.ar, order.product.fr)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getLocalizedValue(order.customer.ar, order.customer.fr)} • {t.common.currency} {order.qty} • {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="text-sm font-bold text-deal-navy hidden sm:block">{order.total.toLocaleString()} {t.common.currency}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Low Stock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-3d rounded-2xl bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.lowStock}</h3>
            <AlertTriangle className="w-5 h-5 text-deal-orange" />
          </div>
          <div className="space-y-3">
            {lowStockProducts.map((product, i) => {
              const percentage = Math.round((product.stock / product.threshold) * 100);
              const barColor = percentage <= 30 ? 'from-red-500 to-red-400' : percentage <= 60 ? 'from-deal-orange to-deal-orange-light' : 'from-deal-gold to-deal-gold-dark';
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="p-3 rounded-xl bg-red-50/50 border border-red-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-deal-navy truncate">{getLocalizedValue(product.name.ar, product.name.fr)}</p>
                    <span className="text-xs font-bold text-red-500">{product.stock}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{t.dashboard.stockRemaining}: {product.stock}/{product.threshold}</p>
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
