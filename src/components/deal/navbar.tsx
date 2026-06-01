'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, LogOut, LayoutDashboard, User, Heart, LogIn, UserPlus, Languages } from 'lucide-react';
import { useI18n, useAppStore, useFavoritesStore } from '@/lib/store';
import NotificationCenter from './notification-center';

export default function Navbar() {
  const { locale, toggleLocale, t } = useI18n();
  const { currentUser, showAuthPage, setShowAuthPage, showAuthModal, setShowAuthModal, setAuthMode, logout, setShowDashboard, setActiveSection, setDetailType, setSelectedItemId } = useAppStore();
  const { favorites } = useFavoritesStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { key: 'home', label: t.nav.home, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { key: 'services', label: t.nav.services, action: () => {
      const el = document.getElementById('services-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }},
    { key: 'products', label: t.nav.products, action: () => {
      const el = document.getElementById('products-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }},
    { key: 'equipment', label: t.nav.equipment, action: () => {
      const el = document.getElementById('equipment-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }},
  ];

  const handleFavoritesClick = () => {
    if (favorites.length > 0) {
      const firstFav = favorites[0];
      if (firstFav.startsWith('s')) {
        setActiveSection('services');
        setDetailType('service');
      } else if (firstFav.startsWith('p')) {
        setActiveSection('products');
        setDetailType('product');
      } else if (firstFav.startsWith('e')) {
        setActiveSection('equipment');
        setDetailType('equipment');
      }
      setSelectedItemId(firstFav);
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 inset-x-0 z-50 glass"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/logo.png"
              alt="DEAL Logo"
              className="h-12 w-auto object-contain"
            />
          </motion.div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.button
                key={link.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={link.action}
                className="relative px-4 py-2 rounded-xl text-sm font-semibold text-deal-navy hover:bg-deal-orange/10 hover:text-deal-orange transition-all duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 inset-x-2 h-0.5 bg-gradient-to-r from-deal-orange to-deal-gold rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </motion.button>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Language toggle — elegant pill */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLocale}
              className="relative flex items-center gap-1.5 h-9 px-3 rounded-full bg-gradient-to-r from-deal-navy/5 to-deal-teal/5 border border-deal-teal/20 hover:border-deal-teal/40 hover:from-deal-teal/10 hover:to-deal-teal/5 transition-all duration-300 shadow-sm overflow-hidden group"
            >
              <Languages className="w-3.5 h-3.5 text-deal-teal group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xs font-bold text-deal-teal tracking-wide">
                {locale === 'ar' ? 'FR' : 'عربي'}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-deal-teal/0 via-deal-teal/5 to-deal-teal/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.button>

            {/* Notification Center */}
            {currentUser && (
              <NotificationCenter />
            )}

            {/* Favorites */}
            {currentUser && favorites.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavoritesClick}
                className="relative w-9 h-9 rounded-full bg-white border border-red-100 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all duration-300 shadow-sm"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white text-[9px] font-bold flex items-center justify-center notif-bounce shadow-sm">
                  {favorites.length}
                </span>
              </motion.button>
            )}

            {/* Auth buttons — creative design */}
            {!currentUser ? (
              <div className="hidden sm:flex items-center gap-2">
                {/* Login — glass outlined with icon */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setAuthMode('login'); setShowAuthPage(true); }}
                  className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-white/80 backdrop-blur-sm border-2 border-deal-orange/25 hover:border-deal-orange/60 hover:bg-deal-orange/5 text-deal-orange text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-deal-orange/10 hover:shadow-md group"
                >
                  <LogIn className="w-3.5 h-3.5 group-hover:-translate-x-px transition-transform" />
                  <span>{t.nav.login}</span>
                </motion.button>

                {/* Register — gradient pill with glow */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setAuthMode('register'); setShowAuthPage(true); }}
                  className="relative flex items-center gap-1.5 h-9 px-4 rounded-full bg-gradient-to-r from-deal-orange to-deal-orange-dark text-white text-xs font-bold transition-all duration-300 shadow-md shadow-deal-orange/25 hover:shadow-lg hover:shadow-deal-orange/35 overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-deal-orange via-deal-gold to-deal-orange bg-[length:200%_100%] opacity-0 group-hover:opacity-100 group-hover:animate-[gradientShift_2s_ease_infinite] transition-opacity duration-500" />
                  <UserPlus className="w-3.5 h-3.5 relative z-10 group-hover:rotate-6 transition-transform" />
                  <span className="relative z-10">{t.nav.register}</span>
                </motion.button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                {/* User name badge */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 h-9 px-3 rounded-full bg-gradient-to-r from-deal-orange/10 to-deal-gold/5 border border-deal-orange/15 text-deal-orange text-xs font-bold transition-all duration-300 hover:border-deal-orange/30 hover:shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-deal-orange to-deal-gold flex items-center justify-center shadow-sm">
                    <span className="text-white font-black text-[10px]">{currentUser.name.charAt(0)}</span>
                  </div>
                  <span className="hidden md:inline max-w-[80px] truncate">{currentUser.name}</span>
                </motion.button>

                {/* Dashboard */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowDashboard(true)}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-deal-teal/10 border border-deal-teal/15 text-deal-teal text-xs font-bold transition-all duration-300 hover:bg-deal-teal/15 hover:border-deal-teal/25"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t.nav.dashboard}</span>
                </motion.button>

                {/* Logout */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { logout(); setShowDashboard(false); }}
                  className="w-9 h-9 rounded-full bg-red-50 border border-red-100 flex items-center justify-center hover:bg-red-100 hover:border-red-200 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                </motion.button>
              </div>
            )}

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden w-11 h-11 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/80 flex items-center justify-center shadow-sm"
            >
              {mobileOpen ? <X className="w-5 h-5 text-deal-navy" /> : <Menu className="w-5 h-5 text-deal-navy" />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden glass border-t border-white/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => { link.action(); setMobileOpen(false); }}
                  className="w-full text-start px-4 py-3 rounded-xl text-sm font-semibold text-deal-navy hover:bg-deal-orange/10 hover:text-deal-orange transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <div className="border-t border-gray-200/80 pt-3 mt-3">
                {!currentUser ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setAuthMode('login'); setShowAuthPage(true); setMobileOpen(false); }}
                      className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-full bg-white border-2 border-deal-orange/30 text-deal-orange text-xs font-bold hover:bg-deal-orange/5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      {t.nav.login}
                    </button>
                    <button
                      onClick={() => { setAuthMode('register'); setShowAuthPage(true); setMobileOpen(false); }}
                      className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-full bg-gradient-to-r from-deal-orange to-deal-orange-dark text-white text-xs font-bold shadow-md shadow-deal-orange/25"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      {t.nav.register}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => { setShowDashboard(true); setMobileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-deal-orange/10 text-deal-orange text-sm font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t.nav.dashboard}
                    </button>
                    <button
                      onClick={() => { logout(); setShowDashboard(false); setMobileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-500 text-sm font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.nav.logout}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
