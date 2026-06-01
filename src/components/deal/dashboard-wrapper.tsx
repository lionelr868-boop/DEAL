'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  ArrowRight,
  LayoutDashboard,
  CalendarCheck,
  Package,
  Truck,
  Wrench,
  ShoppingCart,
  UserCog,
  Settings,
  Star,
  BarChart3,
  Users,
  FolderTree,
  X,
  AlertTriangle,
  MessageCircle,
  LogOut,
  FileText,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import CustomerDashboard from './dashboard/customer-dashboard';
import CraftsmanDashboard from './dashboard/craftsman-dashboard';
import MerchantDashboard from './dashboard/merchant-dashboard';
import EquipmentOwnerDashboard from './dashboard/equipment-owner-dashboard';
import AdminDashboard from './dashboard/admin-dashboard';
import AddItemPage from './dashboard/add-item-page';

type Role = 'customer' | 'craftsman' | 'merchant' | 'equipment_owner' | 'admin';

interface SidebarItem {
  key: string;
  labelAr: string;
  labelFr: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

function getSidebarItems(role: Role): SidebarItem[] {
  const base: SidebarItem[] = [
    { key: 'overview', labelAr: 'نظرة عامة', labelFr: 'Vue d\'ensemble', icon: LayoutDashboard, color: 'text-deal-orange' },
  ];

  const roleItems: Record<Role, SidebarItem[]> = {
    customer: [
      { key: 'bookings', labelAr: 'حجوزاتي', labelFr: 'Mes réservations', icon: CalendarCheck, color: 'text-deal-teal' },
      { key: 'orders', labelAr: 'طلباتي', labelFr: 'Mes commandes', icon: ShoppingCart, color: 'text-deal-gold-dark' },
      { key: 'favorites', labelAr: 'المفضلة', labelFr: 'Favoris', icon: Star, color: 'text-red-400' },
      { key: 'profile', labelAr: 'الملف الشخصي', labelFr: 'Profil', icon: UserCog, color: 'text-deal-orange' },
    ],
    craftsman: [
      { key: 'services', labelAr: 'خدماتي', labelFr: 'Mes services', icon: Wrench, color: 'text-deal-teal' },
      { key: 'bookings', labelAr: 'حجوزاتي', labelFr: 'Mes réservations', icon: CalendarCheck, color: 'text-deal-gold-dark' },
      { key: 'profile', labelAr: 'الملف الشخصي', labelFr: 'Profil', icon: UserCog, color: 'text-deal-orange' },
    ],
    merchant: [
      { key: 'products', labelAr: 'منتجاتي', labelFr: 'Mes produits', icon: Package, color: 'text-deal-teal' },
      { key: 'orders', labelAr: 'الطلبات', labelFr: 'Commandes', icon: ShoppingCart, color: 'text-deal-gold-dark' },
      { key: 'profile', labelAr: 'الملف الشخصي', labelFr: 'Profil', icon: UserCog, color: 'text-deal-orange' },
    ],
    equipment_owner: [
      { key: 'equipment', labelAr: 'معداتي', labelFr: 'Mes équipements', icon: Truck, color: 'text-deal-gold-dark' },
      { key: 'rentals', labelAr: 'الإيجارات', labelFr: 'Locations', icon: CalendarCheck, color: 'text-deal-teal' },
      { key: 'profile', labelAr: 'الملف الشخصي', labelFr: 'Profil', icon: UserCog, color: 'text-deal-orange' },
    ],
    admin: [
      { key: 'users', labelAr: 'المستخدمون', labelFr: 'Utilisateurs', icon: Users, color: 'text-deal-teal' },
      { key: 'content', labelAr: 'إدارة المحتوى', labelFr: 'Contenu', icon: FileText, color: 'text-deal-orange' },
      { key: 'complaints', labelAr: 'الشكاوى', labelFr: 'Réclamations', icon: AlertTriangle, color: 'text-amber-500' },
      { key: 'messages', labelAr: 'الرسائل', labelFr: 'Messages', icon: MessageCircle, color: 'text-deal-teal' },
      { key: 'categories', labelAr: 'الفئات', labelFr: 'Catégories', icon: FolderTree, color: 'text-deal-gold-dark' },
      { key: 'reports', labelAr: 'التقارير', labelFr: 'Rapports', icon: BarChart3, color: 'text-deal-orange' },
      { key: 'settings', labelAr: 'الإعدادات', labelFr: 'Paramètres', icon: Settings, color: 'text-deal-navy' },
      { key: 'profile', labelAr: 'الملف الشخصي', labelFr: 'Profil', icon: UserCog, color: 'text-deal-orange' },
    ],
  };

  const logoutItem: SidebarItem = {
    key: 'logout',
    labelAr: 'تسجيل الخروج',
    labelFr: 'Déconnexion',
    icon: LogOut,
    color: 'text-red-500',
  };

  return [...base, ...roleItems[role], logoutItem];
}

export default function DashboardWrapper() {
  const { t, locale } = useI18n();
  const { currentUser, setShowDashboard, dashboardActiveTab, setDashboardActiveTab, logout, showAddItemPage, setShowAddItemPage } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Prevent body scroll when sidebar is open on mobile
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">{t.nav.login}</p>
        </div>
      </div>
    );
  }

  const normalizedRole = (currentUser.role || '').toLowerCase() as Role;
  const sidebarItems = getSidebarItems(normalizedRole);

  const renderDashboard = () => {
    switch (normalizedRole) {
      case 'customer':
        return <CustomerDashboard />;
      case 'craftsman':
        return <CraftsmanDashboard />;
      case 'merchant':
        return <MerchantDashboard />;
      case 'equipment_owner':
        return <EquipmentOwnerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };



  const handleReturnHome = () => {
    setShowDashboard(false);
    setDashboardActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-40 glass border-b border-gray-200/50"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Mobile menu toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(true)}
                className="md:hidden w-11 h-11 rounded-xl bg-deal-orange/10 flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-deal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>

              {/* Logo */}
              <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="DEAL"
                className="h-11 w-auto object-contain"
              />
                <h1 className="text-xl font-black bg-gradient-to-r from-deal-orange via-deal-gold to-deal-teal bg-clip-text text-transparent hidden sm:block">
                  {t.dashboard.dashboardTitle}
                </h1>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReturnHome}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-deal-orange/10 text-deal-orange text-sm font-bold hover:bg-deal-orange/20 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">{t.dashboard.returnHome}</span>
              <span className="sm:hidden">{t.nav.home}</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-[1440px] mx-auto flex">
        {/* Desktop Sidebar */}
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="hidden md:block w-64 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar"
        >
          <div className="p-4 space-y-1">
            {/* User card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-deal-orange/5 to-deal-teal/5 border border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">
                    {currentUser.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-deal-navy truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
                </div>
              </div>
            </div>

            {/* Nav items */}
            {sidebarItems.map((item, i) => {
              const Icon = item.icon;
              const isLogout = item.key === 'logout';
              const isActive = dashboardActiveTab === item.key;
              return (
                <div key={item.key}>
                  {isLogout && <div className="border-t border-gray-200 my-3" />}
                  <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    onClick={() => isLogout ? logout() : setDashboardActiveTab(item.key)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isLogout
                        ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
                        : isActive
                          ? 'bg-gradient-to-r from-deal-orange/10 to-deal-gold/10 text-deal-orange shadow-sm border border-deal-orange/20'
                          : 'text-muted-foreground hover:bg-gray-100 hover:text-deal-navy'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isLogout ? 'text-red-500' : isActive ? 'text-deal-orange' : item.color || ''}`} />
                    <span>{locale === 'ar' ? item.labelAr : item.labelFr}</span>
                    {isActive && !isLogout && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="ms-auto w-1.5 h-1.5 rounded-full bg-deal-orange"
                      />
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-3 sm:p-6 pb-24 md:pb-6">
          {showAddItemPage ? (
            <AddItemPage type={showAddItemPage} />
          ) : (
            renderDashboard()
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
        >
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="w-72 h-full bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="DEAL"
                  className="w-10 h-10 rounded-lg object-contain"
                />
                <span className="font-black text-deal-navy">{t.dashboard.dashboardTitle}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-deal-navy" />
              </motion.button>
            </div>

            {/* User card */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">{currentUser.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-deal-navy truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
                </div>
              </div>
            </div>

            {/* Nav items */}
            <div className="p-3 space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isLogout = item.key === 'logout';
                const isActive = dashboardActiveTab === item.key;
                return (
                  <div key={item.key}>
                    {isLogout && <div className="border-t border-gray-200 my-3" />}
                    <button
                      onClick={() => {
                        if (isLogout) {
                          logout();
                        } else {
                          setDashboardActiveTab(item.key);
                          setSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isLogout
                          ? 'text-red-500 hover:bg-red-50'
                          : isActive
                            ? 'bg-gradient-to-r from-deal-orange/10 to-deal-gold/10 text-deal-orange shadow-sm border border-deal-orange/20'
                            : 'text-muted-foreground hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isLogout ? 'text-red-500' : isActive ? 'text-deal-orange' : ''}`} />
                      <span>{locale === 'ar' ? item.labelAr : item.labelFr}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Mobile Bottom Nav */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed bottom-0 inset-x-0 z-40 glass border-t border-gray-200/50 md:hidden pb-safe"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {sidebarItems.filter(item => item.key !== 'logout').slice(0, Math.min(5)).map((item) => {
            const Icon = item.icon;
            const isActive = dashboardActiveTab === item.key;
            return (
              <motion.button
                key={item.key}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDashboardActiveTab(item.key)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[56px] transition-colors ${
                  isActive ? 'text-deal-orange' : 'text-muted-foreground'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-deal-orange/10' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-deal-orange' : ''}`} />
                </div>
                <span className={`text-[10px] font-semibold truncate max-w-[64px] ${isActive ? 'text-deal-orange' : ''}`}>
                  {locale === 'ar' ? item.labelAr : item.labelFr}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="w-1 h-1 rounded-full bg-deal-orange"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
