'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Globe, SlidersHorizontal, X, Sparkles,
  RotateCw, Wrench, ShoppingBag, Truck, Star, Loader2,
  ChevronDown, StarIcon,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import RatingStars from './rating-stars';

interface SearchResult {
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
  category?: string;
  categoryFr?: string | null;
}

export default function SearchBar() {
  const { locale, toggleLocale, t, getLocalizedValue } = useI18n();
  const { searchQuery, setSearchQuery, activeSection, setShowDetailModal, setDetailType, setSelectedItemId } = useAppStore();
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [iconRotating, setIconRotating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Backend search results
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Filters
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number>(0);

  // Mock search suggestions (shown when no backend search)
  const suggestions = locale === 'ar'
    ? ['خدمات البناء', 'أسمنت', 'إيجار رافعة', 'نجار محترف', 'دهانات', 'مواد بلاستيكية']
    : ['Services de construction', 'Ciment', 'Location de grue', 'Charpentier', 'Peintures', 'Matériaux plastiques'];

  const filteredSuggestions = searchQuery.length > 0
    ? suggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : suggestions.slice(0, 3);

  // Debounced backend search
  const performSearch = useCallback(async (query: string, filters?: { minPrice?: number | null; maxPrice?: number | null; minRating?: number }) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setSearchLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({ q: query });
      if (filters?.minPrice) params.set('minPrice', String(filters.minPrice));
      if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice));
      if (filters?.minRating && filters.minRating > 0) params.set('minRating', String(filters.minRating));

      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      }
    } catch {
      console.error('Search failed');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Debounce search on query change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery, { minPrice, maxPrice, minRating });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, minPrice, maxPrice, minRating, performSearch]);

  // Focus input when Ctrl+K is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIconRotating(true);
        setTimeout(() => setIconRotating(false), 500);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const id = ++rippleId.current;
      const fakeEvent = { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
      setRipples((prev) => [...prev, { x: fakeEvent.clientX - rect.left, y: fakeEvent.clientY - rect.top, id }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    }
  }, [setSearchQuery]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setShowSuggestions(true);
    setIconRotating(true);
    setTimeout(() => setIconRotating(false), 500);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => { setIsFocused(false); setShowSuggestions(false); }, 200);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setMinPrice(null);
    setMaxPrice(null);
    setMinRating(0);
    inputRef.current?.focus();
  };

  const openResult = (result: SearchResult) => {
    setSelectedItemId(result.id);
    setDetailType(result.type);
    setShowDetailModal(true);
    setShowSuggestions(false);
  };

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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      <div ref={containerRef} className="relative overflow-visible">
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute w-8 h-8 rounded-full bg-deal-orange/20 pointer-events-none"
            style={{ left: ripple.x - 16, top: ripple.y - 16 }}
          />
        ))}
        <div
          className={`search-focus-ring relative flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl
            transition-all duration-300 ease-out
            ${isFocused
              ? 'bg-white/95 backdrop-blur-2xl search-glow ring-1 ring-deal-orange/30 scale-[1.02]'
              : 'bg-white/80 backdrop-blur-xl shadow-md border border-gray-200/60 hover:shadow-lg hover:bg-white'
            }
          `}
        >
          {/* Search icon with rotation */}
          <motion.div
            animate={{
              scale: isFocused ? 1.15 : 1,
              rotate: iconRotating ? 360 : 0,
            }}
            transition={{
              scale: { duration: 0.2 },
              rotate: { duration: 0.5, ease: 'easeInOut' },
            }}
            className="flex-shrink-0"
          >
            {searchLoading ? (
              <Loader2 className="w-5 h-5 text-deal-orange animate-spin" />
            ) : (
              <Search className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-deal-orange' : 'text-slate-400'}`} />
            )}
          </motion.div>

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={t.nav.search}
            className="flex-1 bg-transparent outline-none text-sm sm:text-base text-deal-navy placeholder:text-slate-400 font-medium min-w-0"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          />

          {/* Character count indicator */}
          <AnimatePresence>
            {isFocused && searchQuery.length > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="hidden sm:inline-flex text-[10px] font-mono text-muted-foreground/50 flex-shrink-0"
              >
                {searchQuery.length}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Clear button */}
          <AnimatePresence>
            {searchQuery.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearSearch}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-500" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200/60 flex-shrink-0" />

          {/* Language toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleLocale}
            className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-deal-teal/5 flex items-center justify-center hover:bg-deal-teal/10 transition-colors group"
            title={t.common.language}
          >
            <Globe className="w-4 h-4 text-deal-teal group-hover:rotate-180 transition-transform duration-500" />
          </motion.button>

          {/* Filters toggle button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`hidden sm:flex flex-shrink-0 items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              showFilters || minPrice || maxPrice || minRating > 0
                ? 'bg-deal-orange text-white'
                : 'bg-deal-orange/5 text-deal-orange hover:bg-deal-orange/10'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t.common.filter}</span>
            {(minPrice || maxPrice || minRating > 0) && (
              <span className="w-4 h-4 rounded-full bg-white text-deal-orange text-[9px] font-bold flex items-center justify-center">
                {[minPrice, maxPrice, minRating > 0 ? 1 : 0].filter(Boolean).length}
              </span>
            )}
          </motion.button>

          {/* Keyboard shortcut hint (desktop only) - enhanced */}
          {!isFocused && !searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:flex items-center gap-0.5 flex-shrink-0"
            >
              <kbd className="px-1.5 py-0.5 rounded-md bg-gradient-to-b from-gray-50 to-gray-100 text-[10px] font-mono text-slate-400 border border-gray-200 shadow-sm">Ctrl</kbd>
              <kbd className="px-1.5 py-0.5 rounded-md bg-gradient-to-b from-gray-50 to-gray-100 text-[10px] font-mono text-slate-400 border border-gray-200 shadow-sm">K</kbd>
            </motion.div>
          )}
        </div>

        {/* Filter Controls Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute top-full mt-2 inset-x-0 glass-menu rounded-xl overflow-hidden z-50 shadow-xl"
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-deal-navy flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-deal-orange" />
                    {locale === 'ar' ? 'تصفية النتائج' : 'Filtrer les résultats'}
                  </span>
                  <button
                    onClick={() => { setMinPrice(null); setMaxPrice(null); setMinRating(0); }}
                    className="text-[10px] font-semibold text-deal-orange hover:text-deal-orange/80"
                  >
                    {locale === 'ar' ? 'إعادة تعيين' : 'Réinitialiser'}
                  </button>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {locale === 'ar' ? 'نطاق السعر' : 'Fourchette de prix'} ({t.common.currency})
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder={locale === 'ar' ? 'الحد الأدنى' : 'Min'}
                      value={minPrice || ''}
                      onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : null)}
                      className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy"
                      dir="ltr"
                    />
                    <span className="text-xs text-muted-foreground">—</span>
                    <input
                      type="number"
                      placeholder={locale === 'ar' ? 'الحد الأقصى' : 'Max'}
                      value={maxPrice || ''}
                      onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : null)}
                      className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Minimum Rating */}
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {locale === 'ar' ? 'الحد الأدنى للتقييم' : 'Note minimum'}
                  </label>
                  <div className="flex items-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setMinRating(star)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          minRating >= star
                            ? 'bg-deal-gold/15 border border-deal-gold/30'
                            : 'bg-white border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {star === 0 ? (
                          <span className="text-[10px] font-bold text-muted-foreground">{locale === 'ar' ? 'الكل' : 'Tous'}</span>
                        ) : (
                          <Star className={`w-4 h-4 ${minRating >= star ? 'fill-deal-gold text-deal-gold' : 'text-gray-300'}`} />
                        )}
                      </motion.button>
                    ))}
                    {minRating > 0 && (
                      <span className="text-[10px] font-bold text-deal-gold ms-1">+{minRating}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results Dropdown (from backend) */}
        <AnimatePresence>
          {showSuggestions && hasSearched && searchQuery.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scaleY: 0.95, scaleX: 0.98 }}
              animate={{ opacity: 1, y: 0, scaleY: 1, scaleX: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.95, scaleX: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute top-full mt-2 inset-x-0 glass-menu rounded-xl overflow-hidden z-50 shadow-xl"
            >
              {/* Results header */}
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-deal-gold" />
                  {searchLoading
                    ? (locale === 'ar' ? 'جاري البحث...' : 'Recherche...')
                    : `${searchResults.length} ${locale === 'ar' ? 'نتيجة' : 'résultat(s)'}`
                  }
                </span>
              </div>

              {/* Results list */}
              <div className="py-1 max-h-80 overflow-y-auto custom-scrollbar">
                {searchLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 text-deal-orange animate-spin" />
                  </div>
                )}

                {!searchLoading && searchResults.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">{t.common.noResults}</p>
                  </div>
                )}

                {!searchLoading && searchResults.map((result, i) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onMouseDown={() => openResult(result)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm search-suggestion text-deal-navy hover:text-deal-orange hover:bg-deal-orange/5 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0 text-start">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs truncate">{getLocalizedValue(result.title, result.titleFr)}</span>
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
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Fallback suggestion dropdown (when not searched yet or query too short) */}
          {showSuggestions && !hasSearched && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scaleY: 0.95, scaleX: 0.98 }}
              animate={{ opacity: 1, y: 0, scaleY: 1, scaleX: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.95, scaleX: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute top-full mt-2 inset-x-0 glass-menu rounded-xl overflow-hidden z-50 shadow-xl"
            >
              <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-deal-gold" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {locale === 'ar' ? 'اقتراحات البحث' : 'Suggestions'}
                </span>
              </div>
              <div className="py-1">
                {filteredSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onMouseDown={() => { setSearchQuery(suggestion); setShowSuggestions(false); inputRef.current?.focus(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm search-suggestion text-deal-navy hover:text-deal-orange"
                  >
                    <div className="w-7 h-7 rounded-lg bg-deal-orange/5 flex items-center justify-center flex-shrink-0">
                      {i < 2 ? (
                        <Sparkles className="w-3.5 h-3.5 text-deal-orange" />
                      ) : (
                        <RotateCw className="w-3.5 h-3.5 text-deal-teal" />
                      )}
                    </div>
                    <span className="font-medium">{suggestion}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active filter pills (mobile friendly) */}
      <AnimatePresence>
        {(minPrice || maxPrice || minRating > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex flex-wrap items-center gap-2 mt-3 max-w-2xl mx-auto"
          >
            {minPrice && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-deal-orange/10 text-deal-orange text-[10px] font-bold">
                {locale === 'ar' ? 'من' : 'Min'}: {minPrice.toLocaleString()} {t.common.currency}
                <button onClick={() => setMinPrice(null)} className="hover:text-deal-orange/70"><X className="w-2.5 h-2.5" /></button>
              </span>
            )}
            {maxPrice && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-deal-orange/10 text-deal-orange text-[10px] font-bold">
                {locale === 'ar' ? 'إلى' : 'Max'}: {maxPrice.toLocaleString()} {t.common.currency}
                <button onClick={() => setMaxPrice(null)} className="hover:text-deal-orange/70"><X className="w-2.5 h-2.5" /></button>
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-deal-gold/10 text-deal-gold-dark text-[10px] font-bold">
                <Star className="w-2.5 h-2.5 fill-deal-gold text-deal-gold" /> {minRating}+
                <button onClick={() => setMinRating(0)} className="hover:text-deal-gold/70"><X className="w-2.5 h-2.5" /></button>
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
