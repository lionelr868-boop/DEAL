'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, SlidersHorizontal, X, TrendingUp, Clock, Sparkles, RotateCw } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';

export default function SearchBar() {
  const { locale, toggleLocale, t } = useI18n();
  const { searchQuery, setSearchQuery } = useAppStore();
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [iconRotating, setIconRotating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);

  // Mock search suggestions
  const suggestions = locale === 'ar'
    ? ['خدمات البناء', 'أسمنت', 'إيجار رافعة', 'نجار محترف', 'دهانات', 'مواد بلاستيكية']
    : ['Services de construction', 'Ciment', 'Location de grue', 'Charpentier', 'Peintures', 'Matériaux plastiques'];

  const filteredSuggestions = searchQuery.length > 0
    ? suggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : suggestions.slice(0, 3);

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

  // Ripple effect on input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Add ripple effect on container
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const id = ++rippleId.current;
      const fakeEvent = { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
      setRipples((prev) => [...prev, { x: fakeEvent.clientX - rect.left, y: fakeEvent.clientY - rect.top, id }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    }
  }, [setSearchQuery]);

  // Reset icon rotation when focusing
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
    inputRef.current?.focus();
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
          className={`
            relative flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl
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
            <Search className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-deal-orange' : 'text-slate-400'}`} />
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

          {/* Filters button (decorative) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:flex flex-shrink-0 items-center gap-1.5 px-3 py-2 rounded-xl bg-deal-orange/5 text-deal-orange text-xs font-bold hover:bg-deal-orange/10 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t.common.filter}</span>
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

        {/* Search suggestion dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 inset-x-0 glass-menu rounded-xl overflow-hidden z-50 shadow-xl"
            >
              {/* Suggestions header */}
              <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-deal-gold" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {locale === 'ar' ? 'اقتراحات البحث' : 'Suggestions'}
                </span>
              </div>
              {/* Suggestion items */}
              <div className="py-1">
                {filteredSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onMouseDown={() => { setSearchQuery(suggestion); setShowSuggestions(false); inputRef.current?.focus(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm search-suggestion text-deal-navy hover:text-deal-orange"
                  >
                    <div className="w-7 h-7 rounded-lg bg-deal-orange/5 flex items-center justify-center flex-shrink-0">
                      {i < 2 ? (
                        <TrendingUp className="w-3.5 h-3.5 text-deal-orange" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-deal-teal" />
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
    </motion.div>
  );
}
