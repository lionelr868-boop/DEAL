'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
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
  Loader2,
  Inbox,
  Check,
  X,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import ProfileTabContent from './profile-tab-content';
import { products } from '@/lib/data/mock';
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
  ACCEPTED: { bg: 'bg-deal-teal/10', text: 'text-deal-teal', dot: 'bg-deal-teal' },
  PROCESSING: { bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-500' },
  SHIPPED: { bg: 'bg-purple-100', text: 'text-purple-600', dot: 'bg-purple-500' },
  COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500' },
};

interface ApiOrder {
  id: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  product: {
    id: string;
    title: string;
    titleFr?: string | null;
    price: number;
    stock: number;
    category?: { name: string; nameFr?: string | null; id?: string } | null;
  } | null;
  customer: {
    id: string;
    name: string;
    nameFr?: string | null;
    phone?: string | null;
  } | null;
}

interface ApiProduct {
  id: string;
  title: string;
  titleFr?: string | null;
  price: number;
  stock: number;
  unit?: string | null;
  rating: number;
  totalReviews: number;
  category?: { id: string; name: string; nameFr?: string | null; icon?: string | null } | null;
  merchant?: { id: string; name: string; nameFr?: string | null } | null;
}

export default function MerchantDashboard() {
  const { t, getLocalizedValue, locale } = useI18n();
  const { currentUser, dashboardActiveTab, setShowDetailModal, setDetailType, setSelectedItemId, setDashboardActiveTab } = useAppStore();

  const fallbackProducts = products.slice(0, 8);

  // Real products state
  const [myProducts, setMyProducts] = useState<ApiProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsFetched, setProductsFetched] = useState(false);

  // Real orders state
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersFetched, setOrdersFetched] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Overview loading
  const [overviewLoading, setOverviewLoading] = useState(true);

  // --- Fetch Products ---
  const fetchProducts = useCallback(async () => {
    if (!currentUser?.id) return;
    setProductsLoading(true);
    try {
      const res = await fetch(`/api/products?merchantId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setMyProducts(data);
      }
    } catch {
      // silently fail
    } finally {
      setProductsLoading(false);
      setProductsFetched(true);
    }
  }, [currentUser?.id]);

  // --- Fetch Orders ---
  const fetchOrders = useCallback(async () => {
    if (!currentUser?.id) return;
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?merchantId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // silently fail
    } finally {
      setOrdersLoading(false);
      setOrdersFetched(true);
    }
  }, [currentUser?.id]);

  // --- Fetch overview data on mount ---
  useEffect(() => {
    if (currentUser?.id) {
      setOverviewLoading(true);
      Promise.all([fetchProducts(), fetchOrders()]).finally(() => {
        setOverviewLoading(false);
      });
    }
  }, [currentUser?.id, fetchProducts, fetchOrders]);

  // Fetch products when switching to products tab
  useEffect(() => {
    if (dashboardActiveTab === 'products' && currentUser?.id && !productsFetched) {
      fetchProducts();
    }
  }, [dashboardActiveTab, currentUser?.id, productsFetched, fetchProducts]);

  // Fetch orders when switching to orders tab
  useEffect(() => {
    if (dashboardActiveTab === 'orders' && currentUser?.id && !ordersFetched) {
      fetchOrders();
    }
  }, [dashboardActiveTab, currentUser?.id, ordersFetched, fetchOrders]);

  // --- Computed Stats ---
  const stats = useMemo(() => {
    const totalProducts = myProducts.length > 0 ? myProducts.length : 0;
    const totalOrders = orders.length;
    const revenue = orders.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const avgRating = myProducts.length > 0
      ? (myProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / myProducts.length).toFixed(1)
      : '0';
    return [
      { label: t.dashboard.totalProducts, value: String(totalProducts), icon: Package, bg: 'bg-deal-teal/10' },
      { label: t.dashboard.totalOrders, value: String(totalOrders), icon: ShoppingCart, bg: 'bg-deal-orange/10' },
      { label: t.dashboard.revenue, value: revenue.toLocaleString(), icon: DollarSign, bg: 'bg-deal-gold/10' },
      { label: t.dashboard.avgRating, value: avgRating, icon: Star, bg: 'bg-deal-gold/10' },
    ];
  }, [myProducts, orders, t.dashboard.totalProducts, t.dashboard.totalOrders, t.dashboard.revenue, t.dashboard.avgRating]);

  const statsReady = useMemo(() => !overviewLoading, [overviewLoading]);

  // --- Low Stock Products (stock < 10) ---
  const lowStockProducts = useMemo(() => {
    return myProducts.filter(p => p.stock < 10).map(p => ({
      id: p.id,
      name: getLocalizedValue(p.title, p.titleFr || null),
      stock: p.stock,
      threshold: 10,
    }));
  }, [myProducts, getLocalizedValue]);

  // --- Update order status ---
  const handleUpdateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        toast.success(newStatus === 'PROCESSING' ? t.dashboard.accept : t.dashboard.cancelled);
      } else {
        const errData = await res.json().catch(() => ({ error: 'Failed' }));
        toast.error(errData.error || (locale === 'ar' ? 'فشل تحديث الطلب' : 'Échec de la mise à jour'));
      }
    } catch {
      toast.error(locale === 'ar' ? 'خطأ في الاتصال' : 'Erreur de connexion');
    } finally {
      setUpdatingOrderId(null);
    }
  }, [t.dashboard.accept, t.dashboard.cancelled, locale]);

  // Add product form state
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [addFormLoading, setAddFormLoading] = useState(false);
  const [newProductTitle, setNewProductTitle] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('building');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');

  const handleSubmitAddProduct = async () => {
    if (!newProductTitle.trim() || !newProductPrice.trim() || !currentUser?.id) return;
    setAddFormLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProductTitle,
          description: newProductDesc,
          categoryId: newProductCategory,
          price: Number(newProductPrice),
          stock: Number(newProductStock) || 0,
          merchantId: currentUser.id,
        }),
      });
      if (res.ok) {
        toast.success(locale === 'ar' ? t.dashboard.addedSuccessfully : t.dashboard.addedSuccessfully);
        setShowAddProductForm(false);
        setNewProductTitle('');
        setNewProductDesc('');
        setNewProductCategory('building');
        setNewProductPrice('');
        setNewProductStock('');
        setProductsFetched(false);
        await fetchProducts();
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
    { label: t.dashboard.addProduct, icon: Plus, color: 'bg-deal-teal', action: () => setShowAddProductForm(true) },
    { label: t.dashboard.manageOrders, icon: ClipboardList, color: 'bg-deal-orange', action: () => setDashboardActiveTab('orders') },
    { label: t.dashboard.viewProfile, icon: UserCog, color: 'bg-deal-gold', action: () => setDashboardActiveTab('profile') },
  ];

  const handleOpenProduct = (id: string) => {
    setSelectedItemId(id);
    setDetailType('product');
    setShowDetailModal(true);
  };

  const getOrderDisplay = (order: ApiOrder) => {
    const productName = order.product
      ? getLocalizedValue(order.product.title, order.product.titleFr)
      : (locale === 'ar' ? 'منتج غير معروف' : 'Produit inconnu');
    const customerName = order.customer
      ? getLocalizedValue(order.customer.name, order.customer.nameFr)
      : (locale === 'ar' ? 'عميل غير معروف' : 'Client inconnu');
    const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ') : '';
    return { productName, customerName, date };
  };

  // --- Render Order Item ---
  const renderOrderItem = (order: ApiOrder, i: number, showActions = false) => {
    const status = statusConfig[order.status] || statusConfig.PENDING;
    const { productName, customerName, date } = getOrderDisplay(order);
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
            <span className="text-[10px] font-mono font-bold text-muted-foreground bg-gray-200 px-1.5 py-0.5 rounded">{order.id.slice(-6)}</span>
          </div>
          <p className="font-bold text-sm text-deal-navy truncate mt-1">{productName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {customerName} • {t.common.currency} {order.quantity} • {date}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-sm font-bold text-deal-navy hidden sm:block">{order.totalPrice.toLocaleString()} {t.common.currency}</span>
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold ${status.bg} ${status.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {order.status === 'PROCESSING' ? t.dashboard.processing :
             order.status === 'SHIPPED' ? t.dashboard.shipped :
             order.status === 'COMPLETED' ? t.dashboard.completed :
             t.dashboard[order.status.toLowerCase() as keyof typeof t.dashboard] || order.status}
          </span>
          {showActions && order.status === 'PENDING' && (
            <div className="flex gap-1">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); handleUpdateOrderStatus(order.id, 'PROCESSING'); }}
                disabled={updatingOrderId === order.id}
                className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {updatingOrderId === order.id ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Check className="w-4 h-4 text-white" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); handleUpdateOrderStatus(order.id, 'CANCELLED'); }}
                disabled={updatingOrderId === order.id}
                className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {updatingOrderId === order.id ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <X className="w-4 h-4 text-white" />}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // --- Profile Tab ---
  if (dashboardActiveTab === 'profile') {
    return <ProfileTabContent role="merchant" />;
  }

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
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchProducts}
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
                onClick={() => { setShowAddProductForm(true); setDashboardActiveTab('overview'); }}
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
          </div>
        </motion.div>

        {productsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-deal-teal animate-spin" />
            <span className="ms-3 text-sm text-muted-foreground">{t.common.loading}</span>
          </div>
        ) : myProducts.length === 0 && productsFetched ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm font-bold text-muted-foreground">{t.common.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(myProducts.length > 0 ? myProducts : fallbackProducts).map((prod, i) => {
              const title = getLocalizedValue(prod.title, prod.titleFr || null);
              const categoryName = prod.category
                ? getLocalizedValue(prod.category.name, prod.category.nameFr || null)
                : '';
              const productStock = 'stock' in prod ? (prod as ApiProduct).stock : 0;
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
                    <p className="text-[10px] text-muted-foreground">{categoryName}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-lg font-black text-deal-teal">{prod.price.toLocaleString()} <span className="text-xs">{t.common.currency}</span></span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${productStock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {productStock > 0 ? `${t.products.inStock}: ${productStock}` : t.products.outOfStock}
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

  // --- Orders Tab ---
  if (dashboardActiveTab === 'orders') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-orange via-deal-orange-dark to-deal-gold p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">{t.dashboard.orders} 🛒</h2>
              <p className="mt-1 text-white/80 text-sm">{locale === 'ar' ? 'جميع الطلبات الواردة' : 'Toutes les commandes reçues'}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchOrders}
              className="btn-3d-sm text-white text-xs"
              style={{
                background: 'linear-gradient(180deg, #FF8C5A 0%, #FF6B35 100%)',
                boxShadow: '0 4px 0 0 #CC5529, 0 6px 8px rgba(255,107,53,0.25)',
              }}
            >
              {t.dashboard.refresh}
            </motion.button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          {ordersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-deal-orange animate-spin" />
              <span className="ms-3 text-sm text-muted-foreground">{t.common.loading}</span>
            </div>
          ) : orders.length === 0 && ordersFetched ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Inbox className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm font-bold text-muted-foreground">{t.dashboard.noOrders}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {orders.map((order, i) => renderOrderItem(order, i, true))}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewLoading ? (
          <div className="col-span-full flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-deal-teal animate-spin" />
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
          {overviewLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-deal-orange animate-spin" />
            </div>
          ) : orders.length === 0 && ordersFetched ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Inbox className="w-10 h-10 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-muted-foreground">{t.dashboard.noOrders}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {orders.slice(0, 4).map((order, i) => renderOrderItem(order, i, true))}
            </div>
          )}
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
          {overviewLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-deal-orange animate-spin" />
            </div>
          ) : lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <PackageCheck className="w-10 h-10 text-emerald-200 mb-2" />
              <p className="text-sm font-bold text-muted-foreground">{locale === 'ar' ? 'لا توجد منتجات منخفضة المخزون' : 'Aucun produit en stock faible'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product, i) => {
                const percentage = Math.round((product.stock / product.threshold) * 100);
                const barColor = percentage <= 30 ? 'from-red-500 to-red-400' : percentage <= 60 ? 'from-deal-orange to-deal-orange-light' : 'from-deal-gold to-deal-gold-dark';
                return (
                  <motion.div
                    key={product.id}
                    custom={i}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="p-3 rounded-xl bg-red-50/50 border border-red-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-deal-navy truncate">{product.name}</p>
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
          {showAddProductForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-deal-navy">{t.dashboard.addProduct}</h4>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowAddProductForm(false)} className="text-xs text-muted-foreground hover:text-deal-navy">{t.common.cancel}</motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={newProductTitle} onChange={(e) => setNewProductTitle(e.target.value)} placeholder={t.dashboard.titleField} className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal" dir={locale === 'ar' ? 'rtl' : 'ltr'} />
                  <input type="number" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} placeholder={t.dashboard.priceField} className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal" dir="ltr" />
                  <input type="number" value={newProductStock} onChange={(e) => setNewProductStock(e.target.value)} placeholder={locale === 'ar' ? 'الكمية' : 'Quantité'} className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal" dir="ltr" />
                  <select value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal">
                    <option value="building">{t.categories.building}</option>
                    <option value="electrical_materials">{t.categories.electrical_materials}</option>
                    <option value="wood">{t.categories.wood}</option>
                    <option value="plumbing_materials">{t.categories.plumbing_materials}</option>
                    <option value="paints">{t.categories.paints}</option>
                    <option value="tools">{t.categories.tools}</option>
                  </select>
                  <input type="text" value={newProductDesc} onChange={(e) => setNewProductDesc(e.target.value)} placeholder={t.dashboard.descriptionField} className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal sm:col-span-2" dir={locale === 'ar' ? 'rtl' : 'ltr'} />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={addFormLoading || !newProductTitle.trim() || !newProductPrice.trim()}
                  onClick={handleSubmitAddProduct}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-deal-teal to-teal-600 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
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
