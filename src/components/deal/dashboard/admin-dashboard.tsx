'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users,
  Wrench,
  Package,
  Truck,
  ShoppingCart,
  DollarSign,
  UserCog,
  FolderTree,
  BarChart3,
  UserPlus,
  CalendarCheck,
  Star,
  Activity,
  Clock,
  Check,
  Ban,
  Loader2,
  ShieldCheck,
  ShieldX,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  Award,
  Briefcase,
  Eye,
  Power,
  PowerOff,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import { AnimatedCounter } from '../animated-counter';
import { toast } from 'sonner';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' },
  }),
};

const roleColors: Record<string, { bg: string; text: string }> = {
  customer: { bg: 'bg-deal-orange/10', text: 'text-deal-orange' },
  craftsman: { bg: 'bg-deal-teal/10', text: 'text-deal-teal' },
  merchant: { bg: 'bg-deal-gold/10', text: 'text-deal-gold-dark' },
  equipment_owner: { bg: 'bg-purple-100', text: 'text-purple-600' },
  admin: { bg: 'bg-red-50', text: 'text-red-500' },
};

const roleLabels: Record<string, { ar: string; fr: string }> = {
  customer: { ar: 'عميل', fr: 'Client' },
  craftsman: { ar: 'حرفي', fr: 'Artisan' },
  merchant: { ar: 'تاجر', fr: 'Commerçant' },
  equipment_owner: { ar: 'مؤجر معدات', fr: 'Loueur' },
  admin: { ar: 'مدير', fr: 'Admin' },
};

interface DBUser {
  id: string;
  email: string;
  name: string;
  nameFr: string | null;
  phone: string | null;
  role: string;
  avatar: string | null;
  isVerified: boolean;
  isActive: boolean;
  rating: number | null;
  totalReviews: number;
  specialties: string | null;
  experience: number | null;
  hourlyRate: number | null;
  bio: string | null;
  bioFr: string | null;
  city: string;
  wilaya: string;
  shopName: string | null;
  shopNameFr: string | null;
  hasDelivery: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { t, getLocalizedValue, locale } = useI18n();
  const { dashboardActiveTab } = useAppStore();

  const [dbUsers, setDbUsers] = useState<DBUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // User management filters
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [expandedUserDetail, setExpandedUserDetail] = useState<DBUser | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Stats from API
  const [apiStats, setApiStats] = useState<{ users: Record<string, number>; services: number; products: number; equipment: number; bookings: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchUsers = useCallback(async (search?: string, role?: string) => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (role && role !== 'all') params.set('role', role);
      const res = await fetch(`/api/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDbUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setApiStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (dashboardActiveTab === 'users') {
      fetchUsers(userSearch || undefined, roleFilter);
    }
  }, [dashboardActiveTab, fetchUsers, userSearch, roleFilter]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleToggleActive = async (userId: string, currentState: boolean) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState }),
      });
      if (res.ok) {
        toast.success(
          !currentState
            ? (locale === 'ar' ? 'تم تفعيل الحساب' : 'Compte activé')
            : (locale === 'ar' ? 'تم تعطيل الحساب' : 'Compte désactivé')
        );
        await fetchUsers(userSearch || undefined, roleFilter);
        if (expandedUserId === userId) setExpandedUserId(null);
      }
    } catch {
      toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: true }),
      });
      await fetchUsers(userSearch || undefined, roleFilter);
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: false }),
      });
      await fetchUsers(userSearch || undefined, roleFilter);
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  const handleExpandUser = async (userId: string) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      setExpandedUserDetail(null);
      return;
    }
    setExpandedUserId(userId);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setExpandedUserDetail(data as DBUser);
      }
    } catch (err) {
      console.error('Failed to fetch user detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Filtered users for display
  const filteredUsers = useMemo(() => {
    if (!userSearch) return dbUsers;
    const q = userSearch.toLowerCase();
    return dbUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.nameFr && u.nameFr.toLowerCase().includes(q)) ||
        u.email.toLowerCase().includes(q)
    );
  }, [dbUsers, userSearch]);

  // Fallback stats
  const fallbackStats = [
    { label: t.dashboard.customers, value: '0', icon: Users, bg: 'bg-deal-orange/10', iconColor: 'text-deal-orange', key: 'customers' },
    { label: t.dashboard.craftsmen, value: '0', icon: Wrench, bg: 'bg-deal-teal/10', iconColor: 'text-deal-teal', key: 'craftsmen' },
    { label: t.dashboard.merchants, value: '0', icon: Package, bg: 'bg-deal-gold/10', iconColor: 'text-deal-gold-dark', key: 'merchants' },
    { label: t.dashboard.equipmentOwners, value: '0', icon: Truck, bg: 'bg-purple-50', iconColor: 'text-purple-500', key: 'equipmentOwners' },
    { label: t.dashboard.totalBookings, value: '0', icon: ShoppingCart, bg: 'bg-amber-50', iconColor: 'text-amber-600', key: 'bookings' },
    { label: t.dashboard.totalRevenueCount, value: '0', icon: DollarSign, bg: 'bg-emerald-50', iconColor: 'text-emerald-500', key: 'revenue' },
  ];

  const platformStats = apiStats
    ? [
        { label: t.dashboard.customers, value: String(apiStats.users.customers || 0), icon: Users, bg: 'bg-deal-orange/10', iconColor: 'text-deal-orange', key: 'customers' },
        { label: t.dashboard.craftsmen, value: String(apiStats.users.craftsmen || 0), icon: Wrench, bg: 'bg-deal-teal/10', iconColor: 'text-deal-teal', key: 'craftsmen' },
        { label: t.dashboard.merchants, value: String(apiStats.users.merchants || 0), icon: Package, bg: 'bg-deal-gold/10', iconColor: 'text-deal-gold-dark', key: 'merchants' },
        { label: t.dashboard.equipmentOwners, value: String(apiStats.users.equipmentOwners || 0), icon: Truck, bg: 'bg-purple-50', iconColor: 'text-purple-500', key: 'equipmentOwners' },
        { label: t.dashboard.totalBookings, value: String(apiStats.bookings || 0), icon: ShoppingCart, bg: 'bg-amber-50', iconColor: 'text-amber-600', key: 'bookings' },
        { label: t.dashboard.totalRevenueCount, value: String(apiStats.users.total || 0), icon: DollarSign, bg: 'bg-emerald-50', iconColor: 'text-emerald-500', key: 'revenue' },
      ]
    : fallbackStats;

  const statsReady = useMemo(() => !statsLoading, [statsLoading]);

  const recentUsers = [
    { id: '1', name: { ar: 'أحمد بن محمد', fr: 'Ahmed Ben Mohamed' }, role: 'craftsman', date: '2025-01-15' },
    { id: '2', name: { ar: 'فاطمة بوعلام', fr: 'Fatima Boualem' }, role: 'customer', date: '2025-01-15' },
    { id: '3', name: { ar: 'كريم مؤسسة البناء', fr: 'Karim Entreprise Bâtiment' }, role: 'merchant', date: '2025-01-14' },
    { id: '4', name: { ar: 'يوسف المعدات', fr: 'Youcef Équipements' }, role: 'equipment_owner', date: '2025-01-14' },
    { id: '5', name: { ar: 'سارة بن عمر', fr: 'Sara Ben Omar' }, role: 'customer', date: '2025-01-13' },
    { id: '6', name: { ar: 'نادر الدهان', fr: 'Nadir Peinture' }, role: 'craftsman', date: '2025-01-13' },
  ];

  const activityFeed = [
    { id: '1', icon: UserPlus, color: 'bg-deal-teal', text: { ar: 'أحمد بن محمد سجل كحرفي', fr: "Ahmed Ben Mohamed s'est inscrit en tant qu'artisan" }, time: { ar: 'منذ 5 دقائق', fr: 'Il y a 5 min' } },
    { id: '2', icon: CalendarCheck, color: 'bg-deal-orange', text: { ar: 'حجز جديد: تمديد كهربائي', fr: 'Nouvelle réservation: Installation électrique' }, time: { ar: 'منذ 15 دقيقة', fr: 'Il y a 15 min' } },
    { id: '3', icon: Star, color: 'bg-deal-gold', text: { ar: 'تقييم 5 نجوم لخدمة السباكة', fr: 'Avis 5 étoiles pour service de plomberie' }, time: { ar: 'منذ ساعة', fr: 'Il y a 1h' } },
    { id: '4', icon: ShoppingCart, color: 'bg-deal-teal', text: { ar: 'طلب جديد: 50 كيس إسمنت', fr: 'Nouvelle commande: 50 sacs de ciment' }, time: { ar: 'منذ ساعتين', fr: 'Il y a 2h' } },
    { id: '5', icon: UserPlus, color: 'bg-deal-orange', text: { ar: 'مؤسسة البناء الحديثة سجلت كتاجر', fr: "Entreprise Bâti Moderne s'est inscrite en tant que commerçant" }, time: { ar: 'منذ 3 ساعات', fr: 'Il y a 3h' } },
    { id: '6', icon: Truck, color: 'bg-deal-gold', text: { ar: 'إيجار جديد: حفارة كاتربيلر', fr: 'Nouvelle location: Excavatrice Caterpillar' }, time: { ar: 'منذ 4 ساعات', fr: 'Il y a 4h' } },
    { id: '7', icon: Star, color: 'bg-deal-teal', text: { ar: 'تقييم 4 نجوم لخدمة الدهان', fr: 'Avis 4 étoiles pour service de peinture' }, time: { ar: 'منذ 5 ساعات', fr: 'Il y a 5h' } },
    { id: '8', icon: CalendarCheck, color: 'bg-deal-orange', text: { ar: 'حجز مؤكد: تركيب تكييف', fr: 'Réservation confirmée: Installation climatisation' }, time: { ar: 'منذ 6 ساعات', fr: 'Il y a 6h' } },
  ];

  const quickActions = [
    { label: t.dashboard.manageUsers, icon: UserCog, color: 'bg-deal-orange' },
    { label: t.dashboard.manageCategories, icon: FolderTree, color: 'bg-deal-teal' },
    { label: t.dashboard.viewReports, icon: BarChart3, color: 'bg-deal-gold' },
  ];

  // --- Users Management Tab ---
  if (dashboardActiveTab === 'users') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-navy via-deal-navy-dark to-deal-navy p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full bg-deal-teal/20 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-deal-teal" />
              <span className="text-xs font-bold text-deal-teal bg-deal-teal/20 px-2 py-0.5 rounded-full">{t.dashboard.manageUsers}</span>
            </div>
            <h2 className="text-2xl font-black">{t.dashboard.manageUsers}</h2>
            <p className="mt-1 text-white/70 text-sm">{locale === 'ar' ? 'إدارة جميع المستخدمين المسجلين' : 'Gérer tous les utilisateurs inscrits'}</p>
          </div>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${locale === 'ar' ? 'start-3' : 'start-3'}`} />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder={locale === 'ar' ? 'ابحث بالاسم أو البريد...' : 'Rechercher par nom ou email...'}
                className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            {/* Role Filter */}
            <div className="relative">
              <Filter className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${locale === 'ar' ? 'start-3' : 'start-3'}`} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="ps-9 pe-8 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy appearance-none cursor-pointer min-w-[140px]"
              >
                <option value="all">{locale === 'ar' ? 'جميع الأدوار' : 'Tous les rôles'}</option>
                <option value="customer">{locale === 'ar' ? 'عملاء' : 'Clients'}</option>
                <option value="craftsman">{locale === 'ar' ? 'حرفيون' : 'Artisans'}</option>
                <option value="merchant">{locale === 'ar' ? 'تجار' : 'Commerçants'}</option>
                <option value="equipment_owner">{locale === 'ar' ? 'مؤجر معدات' : 'Loueurs'}</option>
                <option value="admin">{locale === 'ar' ? 'مديرون' : 'Admins'}</option>
              </select>
              <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none ${locale === 'ar' ? 'end-3' : 'end-3'}`} />
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          {loadingUsers ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-deal-orange animate-spin" />
              <span className="ms-3 text-sm text-muted-foreground">{t.common.loading}</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{t.common.noResults}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-muted-foreground">
                  {filteredUsers.length} {locale === 'ar' ? 'مستخدم' : 'utilisateurs'}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-start py-3 px-2 text-xs font-bold text-muted-foreground">{locale === 'ar' ? 'الاسم' : 'Nom'}</th>
                      <th className="text-start py-3 px-2 text-xs font-bold text-muted-foreground hidden sm:table-cell">Email</th>
                      <th className="text-start py-3 px-2 text-xs font-bold text-muted-foreground">{locale === 'ar' ? 'الدور' : 'Rôle'}</th>
                      <th className="text-start py-3 px-2 text-xs font-bold text-muted-foreground">{locale === 'ar' ? 'الحالة' : 'Statut'}</th>
                      <th className="text-end py-3 px-2 text-xs font-bold text-muted-foreground">{locale === 'ar' ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, i) => {
                      const role = roleColors[user.role] || roleColors.customer;
                      const roleName = roleLabels[user.role] || roleLabels.customer;
                      const userName = locale === 'fr' && user.nameFr ? user.nameFr : user.name;
                      const isExpanded = expandedUserId === user.id;
                      return (
                        <motion.tr
                          key={user.id}
                          custom={i}
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-3 px-2">
                            <button
                              onClick={() => handleExpandUser(user.id)}
                              className="flex items-center gap-2 hover:gap-3 transition-all"
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">{userName.charAt(0)}</span>
                              </div>
                              <div className="text-start min-w-0">
                                <span className="font-semibold text-deal-navy text-xs truncate block max-w-[120px]">{userName}</span>
                                <span className="text-[10px] text-muted-foreground sm:hidden truncate block max-w-[120px]">{user.email}</span>
                              </div>
                            </button>
                          </td>
                          <td className="py-3 px-2 text-xs text-muted-foreground hidden sm:table-cell truncate max-w-[160px]">{user.email}</td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${role.bg} ${role.text}`}>
                              {locale === 'ar' ? roleName.ar : roleName.fr}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              {user.isActive ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                  <ShieldCheck className="w-3 h-3" />
                                  {locale === 'ar' ? 'نشط' : 'Actif'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500">
                                  <ShieldX className="w-3 h-3" />
                                  {locale === 'ar' ? 'معطل' : 'Désactivé'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-end gap-1">
                              {/* View button */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleExpandUser(user.id)}
                                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                title={t.common.viewDetails}
                              >
                                <Eye className="w-3 h-3 text-gray-500" />
                              </motion.button>
                              {/* Toggle active */}
                              {user.role !== 'admin' && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  disabled={actionLoading === user.id}
                                  onClick={() => handleToggleActive(user.id, user.isActive)}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 ${
                                    user.isActive
                                      ? 'bg-amber-100 hover:bg-amber-200'
                                      : 'bg-emerald-100 hover:bg-emerald-200'
                                  }`}
                                  title={user.isActive
                                    ? (locale === 'ar' ? 'تعطيل الحساب' : 'Désactiver')
                                    : (locale === 'ar' ? 'تفعيل الحساب' : 'Activer')
                                  }
                                >
                                  {actionLoading === user.id ? (
                                    <Loader2 className="w-3 h-3 text-gray-500 animate-spin" />
                                  ) : user.isActive ? (
                                    <PowerOff className="w-3 h-3 text-amber-600" />
                                  ) : (
                                    <Power className="w-3 h-3 text-emerald-600" />
                                  )}
                                </motion.button>
                              )}
                              {/* Verify/Unverify */}
                              {!user.isVerified && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  disabled={actionLoading === user.id}
                                  onClick={() => handleApproveUser(user.id)}
                                  className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                  title={locale === 'ar' ? 'قبول' : 'Approuver'}
                                >
                                  {actionLoading === user.id ? <Loader2 className="w-3 h-3 text-white animate-spin" /> : <Check className="w-3 h-3 text-white" />}
                                </motion.button>
                              )}
                              {user.isVerified && user.role !== 'admin' && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  disabled={actionLoading === user.id}
                                  onClick={() => handleSuspendUser(user.id)}
                                  className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                                  title={locale === 'ar' ? 'سحب التوثيق' : 'Retirer vérification'}
                                >
                                  {actionLoading === user.id ? <Loader2 className="w-3 h-3 text-white animate-spin" /> : <Ban className="w-3 h-3 text-white" />}
                                </motion.button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Expanded User Detail */}
              <AnimatePresence>
                {expandedUserId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {loadingDetail ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-deal-orange animate-spin" />
                      </div>
                    ) : expandedUserDetail ? (
                      <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 space-y-5">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-deal-navy flex items-center gap-2">
                            <Award className="w-4 h-4 text-deal-orange" />
                            {locale === 'ar' ? 'تفاصيل المستخدم' : 'Détails de l\'utilisateur'}
                          </h4>
                          <button
                            onClick={() => setExpandedUserId(null)}
                            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                          >
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* User info */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {getLocalizedValue(expandedUserDetail.name, expandedUserDetail.nameFr).charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-bold text-deal-navy text-sm">
                                  {getLocalizedValue(expandedUserDetail.name, expandedUserDetail.nameFr)}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${(roleColors[expandedUserDetail.role] || roleColors.customer).bg} ${(roleColors[expandedUserDetail.role] || roleColors.customer).text}`}>
                                    {locale === 'ar' ? (roleLabels[expandedUserDetail.role] || roleLabels.customer).ar : (roleLabels[expandedUserDetail.role] || roleLabels.customer).fr}
                                  </span>
                                  {expandedUserDetail.isVerified && (
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{expandedUserDetail.email}</span>
                              </div>
                              {expandedUserDetail.phone && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Phone className="w-3.5 h-3.5" />
                                  <span dir="ltr">{expandedUserDetail.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{expandedUserDetail.wilaya}, {expandedUserDetail.city}</span>
                              </div>
                            </div>
                          </div>

                          {/* Professional Info */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs">
                              <Star className="w-3.5 h-3.5 text-deal-gold fill-deal-gold" />
                              <span className="font-bold text-deal-navy">{expandedUserDetail.rating || 0}</span>
                              <span className="text-muted-foreground">
                                ({expandedUserDetail.totalReviews} {t.common.reviewsCount})
                              </span>
                            </div>

                            {expandedUserDetail.specialties && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Briefcase className="w-3.5 h-3.5" />
                                <span>{expandedUserDetail.specialties}</span>
                              </div>
                            )}

                            {expandedUserDetail.experience && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{expandedUserDetail.experience} {locale === 'ar' ? 'سنوات خبرة' : "ans d'expérience"}</span>
                              </div>
                            )}

                            {expandedUserDetail.hourlyRate && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>{expandedUserDetail.hourlyRate.toLocaleString()} {t.common.currency}/{locale === 'ar' ? 'ساعة' : 'h'}</span>
                              </div>
                            )}

                            {(expandedUserDetail.shopName || expandedUserDetail.shopNameFr) && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Package className="w-3.5 h-3.5" />
                                <span>{getLocalizedValue(expandedUserDetail.shopName, expandedUserDetail.shopNameFr)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bio */}
                        {(expandedUserDetail.bio || expandedUserDetail.bioFr) && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {getLocalizedValue(expandedUserDetail.bio, expandedUserDetail.bioFr)}
                            </p>
                          </div>
                        )}

                        {/* Registration Date */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">
                            {locale === 'ar' ? 'تاريخ التسجيل' : 'Inscrit le'}: {new Date(expandedUserDetail.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-FR')}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              expandedUserDetail.isActive
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-red-100 text-red-500'
                            }`}>
                              {expandedUserDetail.isActive
                                ? (locale === 'ar' ? 'حساب نشط' : 'Compte actif')
                                : (locale === 'ar' ? 'حساب معطل' : 'Compte désactivé')
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs text-muted-foreground">
                        {locale === 'ar' ? 'لم يتم العثور على التفاصيل' : 'Détails non trouvés'}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-navy via-deal-navy-dark to-deal-navy p-6 text-white"
      >
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full bg-deal-orange/20 blur-2xl" />
        <div className="absolute -bottom-10 -start-10 w-40 h-40 rounded-full bg-deal-teal/20 blur-2xl" />
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-deal-teal" />
              <span className="text-xs font-bold text-deal-teal bg-deal-teal/20 px-2 py-0.5 rounded-full">{t.auth.admin}</span>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-black">
                {t.dashboard.platformStats} 👑
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={statsLoading}
                onClick={fetchStats}
                className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-white ${statsLoading ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
            <p className="mt-1 text-white/70 text-sm sm:text-base">
              {t.dashboard.welcome} • {t.dashboard.today}
            </p>
          </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {platformStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4, scale: 1.03 }}
              className="card-3d rounded-2xl p-3 sm:p-4 bg-white text-center"
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <p className="text-xl sm:text-2xl font-black text-deal-navy">{statsReady && <AnimatedCounter target={stat.value} duration={1000} />}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5 truncate">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card-3d rounded-2xl bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.recentUsers}</h3>
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {recentUsers.map((user, i) => {
              const role = roleColors[user.role] || roleColors.customer;
              const roleName = roleLabels[user.role] || roleLabels.customer;
              return (
                <motion.div
                  key={user.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {getLocalizedValue(user.name.ar, user.name.fr).charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-deal-navy truncate">
                      {getLocalizedValue(user.name.ar, user.name.fr)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{user.date}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${role.bg} ${role.text}`}>
                    {getLocalizedValue(roleName.ar, roleName.fr)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-2 card-3d rounded-2xl bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.activityFeed}</h3>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
            {activityFeed.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-deal-navy leading-relaxed">
                      {getLocalizedValue(activity.text.ar, activity.text.fr)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">
                        {getLocalizedValue(activity.time.ar, activity.time.fr)}
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
        transition={{ delay: 0.55 }}
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
