'use client';

import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';

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

export default function AdminDashboard() {
  const { t, getLocalizedValue } = useI18n();
  const { currentUser } = useAppStore();

  const platformStats = [
    { label: t.dashboard.customers, value: '342', icon: Users, bg: 'bg-deal-orange/10', iconColor: 'text-deal-orange' },
    { label: t.dashboard.craftsmen, value: '128', icon: Wrench, bg: 'bg-deal-teal/10', iconColor: 'text-deal-teal' },
    { label: t.dashboard.merchants, value: '56', icon: Package, bg: 'bg-deal-gold/10', iconColor: 'text-deal-gold-dark' },
    { label: t.dashboard.equipmentOwners, value: '23', icon: Truck, bg: 'bg-purple-50', iconColor: 'text-purple-500' },
    { label: t.dashboard.totalBookings, value: '1,247', icon: ShoppingCart, bg: 'bg-blue-50', iconColor: 'text-blue-500' },
    { label: t.dashboard.totalRevenueCount, value: '2.4M', icon: DollarSign, bg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  ];

  const recentUsers = [
    { id: '1', name: { ar: 'أحمد بن محمد', fr: 'Ahmed Ben Mohamed' }, role: 'craftsman', date: '2025-01-15' },
    { id: '2', name: { ar: 'فاطمة بوعلام', fr: 'Fatima Boualem' }, role: 'customer', date: '2025-01-15' },
    { id: '3', name: { ar: 'كريم مؤسسة البناء', fr: 'Karim Entreprise Bâtiment' }, role: 'merchant', date: '2025-01-14' },
    { id: '4', name: { ar: 'يوسف المعدات', fr: 'Youcef Équipements' }, role: 'equipment_owner', date: '2025-01-14' },
    { id: '5', name: { ar: 'سارة بن عمر', fr: 'Sara Ben Omar' }, role: 'customer', date: '2025-01-13' },
    { id: '6', name: { ar: 'نادر الدهان', fr: 'Nadir Peinture' }, role: 'craftsman', date: '2025-01-13' },
  ];

  const activityFeed = [
    {
      id: '1',
      icon: UserPlus,
      color: 'bg-deal-teal',
      text: { ar: 'أحمد بن محمد سجل كحرفي', fr: 'Ahmed Ben Mohamed s\'est inscrit en tant qu\'artisan' },
      time: { ar: 'منذ 5 دقائق', fr: 'Il y a 5 min' },
    },
    {
      id: '2',
      icon: CalendarCheck,
      color: 'bg-deal-orange',
      text: { ar: 'حجز جديد: تمديد كهربائي', fr: 'Nouvelle réservation: Installation électrique' },
      time: { ar: 'منذ 15 دقيقة', fr: 'Il y a 15 min' },
    },
    {
      id: '3',
      icon: Star,
      color: 'bg-deal-gold',
      text: { ar: 'تقييم 5 نجوم لخدمة السباكة', fr: 'Avis 5 étoiles pour service de plomberie' },
      time: { ar: 'منذ ساعة', fr: 'Il y a 1h' },
    },
    {
      id: '4',
      icon: ShoppingCart,
      color: 'bg-deal-teal',
      text: { ar: 'طلب جديد: 50 كيس إسمنت', fr: 'Nouvelle commande: 50 sacs de ciment' },
      time: { ar: 'منذ ساعتين', fr: 'Il y a 2h' },
    },
    {
      id: '5',
      icon: UserPlus,
      color: 'bg-deal-orange',
      text: { ar: 'مؤسسة البناء الحديثة سجلت كتاجر', fr: 'Entreprise Bâti Moderne s\'est inscrite en tant que commerçant' },
      time: { ar: 'منذ 3 ساعات', fr: 'Il y a 3h' },
    },
    {
      id: '6',
      icon: Truck,
      color: 'bg-deal-gold',
      text: { ar: 'إيجار جديد: حفارة كاتربيلر', fr: 'Nouvelle location: Excavatrice Caterpillar' },
      time: { ar: 'منذ 4 ساعات', fr: 'Il y a 4h' },
    },
    {
      id: '7',
      icon: Star,
      color: 'bg-deal-teal',
      text: { ar: 'تقييم 4 نجوم لخدمة الدهان', fr: 'Avis 4 étoiles pour service de peinture' },
      time: { ar: 'منذ 5 ساعات', fr: 'Il y a 5h' },
    },
    {
      id: '8',
      icon: CalendarCheck,
      color: 'bg-deal-orange',
      text: { ar: 'حجز مؤكد: تركيب تكييف', fr: 'Réservation confirmée: Installation climatisation' },
      time: { ar: 'منذ 6 ساعات', fr: 'Il y a 6h' },
    },
  ];

  const quickActions = [
    { label: t.dashboard.manageUsers, icon: UserCog, color: 'bg-deal-orange' },
    { label: t.dashboard.manageCategories, icon: FolderTree, color: 'bg-deal-teal' },
    { label: t.dashboard.viewReports, icon: BarChart3, color: 'bg-deal-gold' },
  ];

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
            <span className="text-xs font-bold text-deal-teal bg-deal-teal/20 px-2 py-0.5 rounded-full">ADMIN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            {t.dashboard.platformStats} 👑
          </h2>
          <p className="mt-1 text-white/70 text-sm sm:text-base">
            {t.dashboard.welcome}، {currentUser?.name} • {t.dashboard.today}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid - 6 cards */}
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
              <p className="text-xl sm:text-2xl font-black text-deal-navy">{stat.value}</p>
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
