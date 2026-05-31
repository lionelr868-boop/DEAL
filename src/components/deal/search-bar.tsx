'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, SlidersHorizontal, X } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';

export default function SearchBar() {
  const { locale, toggleLocale, t } = useI18n();
  const { searchQuery, setSearchQuery } = useAppStore();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when Ctrl+K is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      <div
        className={`
          relative flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl
          transition-all duration-300 ease-out
          ${isFocused
            ? 'bg-white shadow-lg shadow-deal-orange/15 ring-2 ring-deal-orange/60 scale-[1.02]'
            : 'bg-white/80 backdrop-blur-xl shadow-md border border-gray-200/60 hover:shadow-lg hover:bg-white'
          }
        `}
      >
        {/* Search icon */}
        <motion.div
          animate={{ scale: isFocused ? 1.15 : 1, color: isFocused ? '#FF6B35' : '#94A3B8' }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <Search className="w-5 h-5 text-slate-400" />
        </motion.div>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t.nav.search}
          className="flex-1 bg-transparent outline-none text-sm sm:text-base text-deal-navy placeholder:text-slate-400 font-medium min-w-0"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />

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
        <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

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

        {/* Keyboard shortcut hint (desktop only) */}
        {!isFocused && !searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden lg:flex items-center gap-0.5 flex-shrink-0"
          >
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-mono text-slate-400 border border-gray-200">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-mono text-slate-400 border border-gray-200">K</kbd>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
