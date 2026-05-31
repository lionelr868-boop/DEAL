'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CalendarCheck, Star, Info, Trash2, Check } from 'lucide-react';
import { useI18n } from '@/lib/store';
import { useFavoritesStore } from '@/lib/store';
import { toast } from 'sonner';

const typeIcons: Record<string, React.ElementType> = {
  booking: CalendarCheck,
  review: Star,
  system: Info,
};

const typeColors: Record<string, string> = {
  booking: 'bg-deal-orange text-white',
  review: 'bg-deal-gold text-deal-navy',
  system: 'bg-deal-teal text-white',
};

const typeUnreadBg: Record<string, string> = {
  booking: 'bg-deal-orange/5 border-deal-orange/20',
  review: 'bg-deal-gold/5 border-deal-gold/20',
  system: 'bg-deal-teal/5 border-deal-teal/20',
};

export default function NotificationCenter() {
  const { t, locale } = useI18n();
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useFavoritesStore();

  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
  };

  const handleClearAll = () => {
    clearNotifications();
    toast.success(locale === 'ar' ? 'تم مسح جميع الإشعارات' : 'Toutes les notifications ont été supprimées');
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    toast.success(locale === 'ar' ? 'تم تعليم الكل كمقروء' : 'Tout marqué comme lu');
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return locale === 'ar' ? 'الآن' : 'Maintenant';
    if (minutes < 60) return locale === 'ar' ? `منذ ${minutes} دقيقة` : `Il y a ${minutes} min`;
    if (hours < 24) return locale === 'ar' ? `منذ ${hours} ساعة` : `Il y a ${hours}h`;
    return locale === 'ar' ? `منذ ${days} يوم` : `Il y a ${days}j`;
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-deal-teal hover:bg-deal-teal/5 transition-colors shadow-sm"
      >
        <Bell className="w-4 h-4 text-deal-navy" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-deal-orange text-white text-[9px] font-bold flex items-center justify-center shadow-sm"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute end-0 top-full mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-deal-navy">{t.common.notifications}</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-deal-orange text-white px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleMarkAllRead}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title={locale === 'ar' ? 'تعليم الكل كمقروء' : 'Tout marquer comme lu'}
                  >
                    <Check className="w-3.5 h-3.5 text-deal-teal" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClearAll}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  title={locale === 'ar' ? 'مسح الكل' : 'Tout supprimer'}
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </motion.button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"
                  >
                    <Bell className="w-8 h-8 text-gray-300" />
                  </motion.div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {t.common.noNotifications}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {locale === 'ar' ? 'ستظهر الإشعارات الجديدة هنا' : 'Les nouvelles notifications apparaîtront ici'}
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {notifications.map((notification) => {
                    const Icon = typeIcons[notification.type] || Info;
                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors hover:bg-white/60 ${
                          !notification.read
                            ? `${typeUnreadBg[notification.type]} border-s-2`
                            : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${typeColors[notification.type]} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed ${!notification.read ? 'font-semibold text-deal-navy' : 'text-muted-foreground'}`}>
                            {locale === 'ar' ? notification.message.ar : notification.message.fr}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-deal-orange mt-2 flex-shrink-0" />
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
