'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Star, ChevronDown, Wrench, ShoppingBag, Truck,
  SlidersHorizontal, Sparkles, Loader2, ArrowUpDown,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import RatingStars from './rating-stars';

interface SearchResultItem {
  id: string;
  type: 'service' | 'product' | 'equipment';
  title: string;
  titleFr: string | null;
  description: string;
  descriptionFr: string | null;
  price: number;
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
  createdAt: string;
  category?: string;
  categoryFr?: string | null;
}

interface SearchResponse {
  services: SearchResultItem[];
  products: SearchResultItem[];
  equipment: SearchResultItem[];
  total: number;
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const sortOptions = [
  { value: 'rating', getLabel: (locale: string) => locale === 'ar' ? 'الأعلى تقييماً' : 'Mieux notés' },
  { value: 'price-asc', getLabel: (locale: string) => locale === 'ar' ? 'السعر: الأقل أولاً' : 'Prix: croissant' },
  { value: 'price-desc', getLabel: (locale: string) => locale === 'ar' ? 'السعر: الأعلى أولاً' : 'Prix: décroissant' },
  { value: 'newest', getLabel: (locale: string) => locale === 'ar' ? 'الأحدث' : 'Plus récents' },
  { value: 'popular', getLabel: (locale: string) => locale === 'ar' ? 'الأكثر شعبية' : 'Plus populaires' },
];

export default function AdvancedSearch({ isOpen, onClose }: AdvancedSearchProps) {
  const { locale, t, getLocalizedValue } = useI18n();
  const { searchQuery, setSearchQuery, setShowDetailModal, setDetailType, setSelectedItemId } = useAppStore();

  // Filters
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [activeTab, setActiveTab] = useState<'all' | 'service' | 'product' | 'equipment'>('all');

  // Results
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset filters
  const resetFilters = useCallback(() => {
    setMinPrice(null);
    setMaxPrice(null);
    setMinRating(0);
    setAvailableOnly(false);
    setSortBy('rating');
    setActiveTab('all');
  }, []);

  // Build query params
  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (minPrice) params.set('minPrice', String(minPrice));
    if (maxPrice) params.set('maxPrice', String(maxPrice));
    if (minRating > 0) params.set('minRating', String(minRating));
    if (availableOnly) params.set('available', 'true');
    if (sortBy) params.set('sort', sortBy);
    if (activeTab !== 'all') params.set('type', activeTab);
    return params;
  }, [searchQuery, minPrice, maxPrice, minRating, availableOnly, sortBy, activeTab]);

  // Fetch search results
  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const params = buildParams();
      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch {
      console.error('Search failed');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, buildParams]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch();
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, minPrice, maxPrice, minRating, availableOnly, sortBy, activeTab, isOpen, performSearch]);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Open result detail
  const openResult = (result: SearchResultItem) => {
    setSelectedItemId(result.id);
    setDetailType(result.type);
    setShowDetailModal(true);
    onClose();
  };

  // Filter count
  const filterCount = [minPrice, maxPrice, minRating > 0, availableOnly, sortBy !== 'rating', activeTab !== 'all'].filter(Boolean).length;

  // Active filter list for display
  const currentResults = useMemo(() => {
    if (!results) return [];
    if (activeTab === 'all') return [...results.services, ...results.products, ...results.equipment];
    return results[activeTab] || [];
  }, [results, activeTab]);

  // Type counts
  const typeCounts = useMemo(() => {
    if (!results) return { all: 0, service: 0, product: 0, equipment: 0 };
    return {
      all: results.total,
      service: results.services.length,
      product: results.products.length,
      equipment: results.equipment.length,
    };
  }, [results]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service': return <Wrench className="w-4 h-4 text-deal-orange" />;
      case 'product': return <ShoppingBag className="w-4 h-4 text-deal-teal" />;
      case 'equipment': return <Truck className="w-4 h-4 text-deal-gold-dark" />;
      default: return <Search className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return locale === 'ar' ? 'خدمة' : 'Service';
      case 'product': return locale === 'ar' ? 'منتج' : 'Produit';
      case 'equipment': return locale === 'ar' ? 'معدة' : 'Équipement';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-20 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[640px] bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden max-h-[80vh] flex flex-col"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-deal-orange/5 to-deal-teal/5">
              <div className="w-10 h-10 rounded-xl bg-deal-orange/10 flex items-center justify-center">
                <Search className="w-5 h-5 text-deal-orange" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-deal-navy text-sm">{t.search.advancedSearch}</h3>
                <p className="text-[10px] text-muted-foreground">
                  {results ? `${results.total} ${t.search.results}` : t.search.filterResults}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {filterCount > 0 && (
                  <span className="w-6 h-6 rounded-full bg-deal-orange text-white text-[10px] font-bold flex items-center justify-center">
                    {filterCount}
                  </span>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </motion.button>
              </div>
            </div>

            {/* Filters */}
            <div className="px-5 py-4 space-y-4 border-b border-gray-100 bg-gray-50/50">
              {/* Row 1: Price + Sort */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Price Range */}
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3 h-3" />
                    {t.search.priceRange} ({t.common.currency})
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder={t.search.minPrice}
                      value={minPrice || ''}
                      onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : null)}
                      className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy"
                      dir="ltr"
                    />
                    <span className="text-xs text-muted-foreground flex-shrink-0">—</span>
                    <input
                      type="number"
                      placeholder={t.search.maxPrice}
                      value={maxPrice || ''}
                      onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : null)}
                      className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className="sm:w-48 space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowUpDown className="w-3 h-3" />
                    {t.search.sortBy}
                  </label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 pe-8 rounded-lg bg-white border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy appearance-none cursor-pointer"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.getLabel(locale)}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute top-1/2 -translate-y-1/2 end-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Rating + Availability */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                {/* Rating */}
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {t.search.minRating}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setMinRating(star)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all text-xs font-bold ${
                          minRating >= star
                            ? 'bg-deal-gold/15 border border-deal-gold/30 text-deal-gold'
                            : 'bg-white border border-gray-200 hover:border-gray-300 text-muted-foreground'
                        }`}
                      >
                        {star === 0 ? (locale === 'ar' ? 'الكل' : 'Tous') : star}
                      </motion.button>
                    ))}
                    {minRating > 0 && (
                      <span className="flex items-center gap-0.5 ms-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= minRating ? 'fill-deal-gold text-deal-gold' : 'text-gray-200'}`} />
                        ))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {t.search.availability}
                  </label>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAvailableOnly(!availableOnly)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                      availableOnly
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-white text-muted-foreground border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      availableOnly ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                    }`}>
                      {availableOnly && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {t.search.availableOnly}
                  </motion.button>
                </div>
              </div>

              {/* Active Filter Chips */}
              <AnimatePresence>
                {filterCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 flex-wrap"
                  >
                    {minPrice && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-deal-orange/10 text-deal-orange text-[10px] font-bold">
                        {locale === 'ar' ? 'من' : 'Min'}: {minPrice.toLocaleString()}
                        <button onClick={() => setMinPrice(null)} className="hover:text-deal-orange/70"><X className="w-2.5 h-2.5" /></button>
                      </span>
                    )}
                    {maxPrice && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-deal-orange/10 text-deal-orange text-[10px] font-bold">
                        {locale === 'ar' ? 'إلى' : 'Max'}: {maxPrice.toLocaleString()}
                        <button onClick={() => setMaxPrice(null)} className="hover:text-deal-orange/70"><X className="w-2.5 h-2.5" /></button>
                      </span>
                    )}
                    {minRating > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-deal-gold/10 text-deal-gold-dark text-[10px] font-bold">
                        <Star className="w-2.5 h-2.5 fill-deal-gold text-deal-gold" /> {minRating}+
                        <button onClick={() => setMinRating(0)} className="hover:text-deal-gold/70"><X className="w-2.5 h-2.5" /></button>
                      </span>
                    )}
                    {availableOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">
                        {t.search.availableOnly}
                        <button onClick={() => setAvailableOnly(false)} className="hover:text-emerald-500"><X className="w-2.5 h-2.5" /></button>
                      </span>
                    )}
                    <button
                      onClick={resetFilters}
                      className="text-[10px] font-bold text-deal-orange hover:text-deal-orange/80 px-2 py-1"
                    >
                      {t.search.resetFilters}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Type Tabs + Results */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Type Tabs */}
              <div className="flex items-center gap-1 px-5 py-3 border-b border-gray-100 bg-white">
                {[
                  { key: 'all' as const, label: t.search.allTypes, count: typeCounts.all, icon: <Sparkles className="w-3 h-3" /> },
                  { key: 'service' as const, label: locale === 'ar' ? 'خدمات' : 'Services', count: typeCounts.service, icon: <Wrench className="w-3 h-3 text-deal-orange" /> },
                  { key: 'product' as const, label: locale === 'ar' ? 'منتجات' : 'Produits', count: typeCounts.product, icon: <ShoppingBag className="w-3 h-3 text-deal-teal" /> },
                  { key: 'equipment' as const, label: locale === 'ar' ? 'معدات' : 'Équipements', count: typeCounts.equipment, icon: <Truck className="w-3 h-3 text-deal-gold-dark" /> },
                ].map((tab) => (
                  <motion.button
                    key={tab.key}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeTab === tab.key
                        ? 'bg-deal-orange text-white shadow-sm'
                        : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-muted-foreground'
                    }`}>
                      {tab.count}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Results List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="w-6 h-6 text-deal-orange animate-spin" />
                    <span className="text-xs text-muted-foreground">{t.search.searching}</span>
                  </div>
                )}

                {!loading && !searchQuery && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Search className="w-10 h-10 text-gray-200" />
                    <p className="text-xs text-muted-foreground">{t.nav.search}</p>
                  </div>
                )}

                {!loading && searchQuery && currentResults.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Search className="w-10 h-10 text-gray-200" />
                    <p className="text-xs text-muted-foreground">{t.common.noResults}</p>
                  </div>
                )}

                {!loading && currentResults.length > 0 && (
                  <div className="p-2 space-y-1">
                    {currentResults.map((result) => (
                      <motion.button
                        key={`${result.type}-${result.id}`}
                        whileHover={{ x: locale === 'ar' ? -2 : 2, backgroundColor: 'rgba(255,107,53,0.03)' }}
                        onClick={() => openResult(result)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs truncate text-deal-navy">
                              {getLocalizedValue(result.title, result.titleFr)}
                            </span>
                            <span className="text-[9px] font-bold text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                          {result.category && (
                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                              {getLocalizedValue(result.category, result.categoryFr)}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                          <span className="text-xs font-black text-deal-orange">
                            {result.price.toLocaleString()} <span className="text-[9px] font-semibold">{t.common.currency}</span>
                          </span>
                          {result.rating > 0 && (
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-deal-gold text-deal-gold" />
                              <span className="text-[9px] font-semibold text-muted-foreground">{result.rating}</span>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
