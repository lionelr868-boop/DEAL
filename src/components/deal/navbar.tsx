'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, LogOut, LayoutDashboard, User, Heart } from 'lucide-react';
import { useI18n, useAppStore, useFavoritesStore } from '@/lib/store';
import NotificationCenter from './notification-center';

export default function Navbar() {
  const { locale, toggleLocale, t } = useI18n();
  const { currentUser, showAuthModal, setShowAuthModal, setAuthMode, logout, setShowDashboard, setActiveSection, setDetailType, setSelectedItemId } = useAppStore();
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deal-orange to-deal-gold flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">D</span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-deal-orange via-deal-gold to-deal-teal bg-clip-text text-transparent">
              DEAL
            </span>
          </motion.div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.button
                key={link.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={link.action}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-deal-navy hover:bg-deal-orange/10 hover:text-deal-orange transition-colors"
              >
                {link.label}
              </motion.button>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleLocale}
              className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center gap-1 hover:border-deal-teal hover:bg-deal-teal/5 transition-colors shadow-sm"
            >
              <Globe className="w-4 h-4 text-deal-teal" />
              <span className="text-xs font-bold text-deal-teal">
                {locale === 'ar' ? 'FR' : 'AR'}
              </span>
            </motion.button>

            {/* Notification Center (visible when logged in) */}
            {currentUser && (
              <NotificationCenter />
            )}

            {/* Favorites (visible when logged in) */}
            {currentUser && favorites.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavoritesClick}
                className="relative w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-colors shadow-sm"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center notif-bounce">
                  {favorites.length}
                </span>
              </motion.button>
            )}

            {/* Auth buttons or User menu */}
            {!currentUser ? (
              <div className="hidden sm:flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="btn-3d-sm bg-white text-deal-orange border border-deal-orange/30 text-xs"
                  style={{
                    background: 'white',
                    boxShadow: '0 4px 0 0 rgba(255,107,53,0.2), 0 6px 8px rgba(255,107,53,0.15)',
                  }}
                >
                  {t.nav.login}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                  className="btn-3d-sm text-white text-xs"
                >
                  {t.nav.register}
                </motion.button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-deal-orange/10 text-deal-orange text-xs font-semibold"
                >
                  <User className="w-4 h-4" />
                  {currentUser.name}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDashboard(true)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-deal-teal/10 text-deal-teal text-xs font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t.nav.dashboard}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { logout(); setShowDashboard(false); }}
                  className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                </motion.button>
              </div>
            )}

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm"
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

              <div className="border-t border-gray-200 pt-3 mt-3">
                {!currentUser ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setAuthMode('login'); setShowAuthModal(true); setMobileOpen(false); }}
                      className="flex-1 btn-3d-sm text-white text-xs"
                    >
                      {t.nav.login}
                    </button>
                    <button
                      onClick={() => { setAuthMode('register'); setShowAuthModal(true); setMobileOpen(false); }}
                      className="flex-1 btn-3d-sm btn-3d-teal text-white text-xs"
                    >
                      {t.nav.register}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => { setShowDashboard(true); setMobileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-deal-orange/10 text-deal-orange text-sm font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t.nav.dashboard}
                    </button>
                    <button
                      onClick={() => { logout(); setShowDashboard(false); setMobileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 text-sm font-semibold"
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
