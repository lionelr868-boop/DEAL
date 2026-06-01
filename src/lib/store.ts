import { create } from 'zustand';
import ar from '@/i18n/ar.json';
import fr from '@/i18n/fr.json';

type Locale = 'ar' | 'fr';
type Translations = typeof ar;

const translations: Record<Locale, Translations> = { ar, fr };

export interface Notification {
  id: string;
  message: { ar: string; fr: string };
  type: 'booking' | 'review' | 'system';
  timestamp: number;
  read: boolean;
}

interface I18nState {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  t: Translations;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  getLocalizedValue: (arValue: string | null | undefined, frValue: string | null | undefined) => string;
}

export const useI18n = create<I18nState>((set, get) => ({
  locale: 'ar',
  dir: 'rtl',
  t: ar,
  setLocale: (locale) =>
    set({
      locale,
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      t: translations[locale],
    }),
  toggleLocale: () => {
    const { locale } = get();
    const newLocale: Locale = locale === 'ar' ? 'fr' : 'ar';
    set({
      locale: newLocale,
      dir: newLocale === 'ar' ? 'rtl' : 'ltr',
      t: translations[newLocale],
    });
    if (typeof document !== 'undefined') {
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLocale;
    }
  },
  getLocalizedValue: (arValue, frValue) => {
    const { locale } = get();
    if (locale === 'fr' && frValue) return frValue;
    return arValue || '';
  },
}));

// App state store
interface AppState {
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  } | null;
  activeSection: 'services' | 'products' | 'equipment';
  showAuthModal: boolean;
  showAuthPage: boolean;
  authMode: 'login' | 'register';
  showDetailModal: boolean;
  detailType: 'service' | 'product' | 'equipment' | 'profile' | null;
  selectedItemId: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  showDashboard: boolean;
  dashboardActiveTab: string;
  showAddItemPage: 'service' | 'product' | 'equipment' | null;
  showProfileModal: boolean;
  showComplaintModal: boolean;
  messagingTargetUserId: string | null;
  profileProviderName: { ar: string; fr: string };
  profileSpecialty: { ar: string; fr: string };
  profileRating: number;
  profileReviewsCount: number;

  setCurrentUser: (user: AppState['currentUser']) => void;
  logout: () => void;
  setActiveSection: (section: AppState['activeSection']) => void;
  setShowAuthModal: (show: boolean) => void;
  setShowAuthPage: (show: boolean) => void;
  setAuthMode: (mode: 'login' | 'register') => void;
  setShowDetailModal: (show: boolean) => void;
  setDetailType: (type: AppState['detailType']) => void;
  setSelectedItemId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setShowDashboard: (show: boolean) => void;
  setDashboardActiveTab: (tab: string) => void;
  setShowAddItemPage: (type: 'service' | 'product' | 'equipment' | null) => void;
  setShowProfileModal: (show: boolean) => void;
  setShowComplaintModal: (show: boolean) => void;
  setMessagingTargetUserId: (id: string | null) => void;
  setProfileProviderName: (name: { ar: string; fr: string }) => void;
  setProfileSpecialty: (specialty: { ar: string; fr: string }) => void;
  setProfileRating: (rating: number) => void;
  setProfileReviewsCount: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  activeSection: 'services',
  showAuthModal: false,
  showAuthPage: false,
  authMode: 'login',
  showDetailModal: false,
  detailType: null,
  selectedItemId: null,
  searchQuery: '',
  selectedCategory: null,
  showDashboard: false,
  dashboardActiveTab: 'overview',
  showAddItemPage: null,
  showProfileModal: false,
  showComplaintModal: false,
  messagingTargetUserId: null,
  profileProviderName: { ar: '', fr: '' },
  profileSpecialty: { ar: '', fr: '' },
  profileRating: 0,
  profileReviewsCount: 0,

  setCurrentUser: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null, showDashboard: false, dashboardActiveTab: 'overview' }),
  setActiveSection: (section) => set({ activeSection: section }),
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  setShowAuthPage: (show) => set({ showAuthPage: show }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setShowDetailModal: (show) => set({ showDetailModal: show }),
  setDetailType: (type) => set({ detailType: type }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setShowDashboard: (show) => set({ showDashboard: show }),
  setDashboardActiveTab: (tab) => set({ dashboardActiveTab: tab }),
  setShowAddItemPage: (type) => set({ showAddItemPage: type }),
  setShowProfileModal: (show) => set({ showProfileModal: show }),
  setShowComplaintModal: (show) => set({ showComplaintModal: show }),
  setMessagingTargetUserId: (id) => set({ messagingTargetUserId: id }),
  setProfileProviderName: (name) => set({ profileProviderName: name }),
  setProfileSpecialty: (specialty) => set({ profileSpecialty: specialty }),
  setProfileRating: (rating) => set({ profileRating: rating }),
  setProfileReviewsCount: (count) => set({ profileReviewsCount: count }),
}));

// Favorites & Notifications store
interface FavoritesState {
  favorites: string[];
  notifications: Notification[];
  unreadCount: number;

  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  notifications: [],
  unreadCount: 0,

  toggleFavorite: (id) => {
    const { favorites } = get();
    if (favorites.includes(id)) {
      set({ favorites: favorites.filter((f) => f !== id) });
    } else {
      set({ favorites: [...favorites, id] });
    }
  },

  isFavorite: (id) => {
    return get().favorites.includes(id);
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markNotificationRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    });
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
