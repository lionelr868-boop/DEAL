import { create } from 'zustand';
import ar from '@/i18n/ar.json';
import fr from '@/i18n/fr.json';

type Locale = 'ar' | 'fr';
type Translations = typeof ar;

const translations: Record<Locale, Translations> = { ar, fr };

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
  authMode: 'login' | 'register';
  showDetailModal: boolean;
  detailType: 'service' | 'product' | 'equipment' | 'profile' | null;
  selectedItemId: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  showDashboard: boolean;
  dashboardActiveTab: string;
  
  setCurrentUser: (user: AppState['currentUser']) => void;
  logout: () => void;
  setActiveSection: (section: AppState['activeSection']) => void;
  setShowAuthModal: (show: boolean) => void;
  setAuthMode: (mode: 'login' | 'register') => void;
  setShowDetailModal: (show: boolean) => void;
  setDetailType: (type: AppState['detailType']) => void;
  setSelectedItemId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setShowDashboard: (show: boolean) => void;
  setDashboardActiveTab: (tab: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  activeSection: 'services',
  showAuthModal: false,
  authMode: 'login',
  showDetailModal: false,
  detailType: null,
  selectedItemId: null,
  searchQuery: '',
  selectedCategory: null,
  showDashboard: false,
  dashboardActiveTab: 'overview',

  setCurrentUser: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null, showDashboard: false, dashboardActiveTab: 'overview' }),
  setActiveSection: (section) => set({ activeSection: section }),
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setShowDetailModal: (show) => set({ showDetailModal: show }),
  setDetailType: (type) => set({ detailType: type }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setShowDashboard: (show) => set({ showDashboard: show }),
  setDashboardActiveTab: (tab) => set({ dashboardActiveTab: tab }),
}));
