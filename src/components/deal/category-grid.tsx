'use client';

import { motion } from 'framer-motion';
import {
  Zap, Droplets, HardHat, Hammer, Wind, Wrench,
  PaintBucket, Home, Construction, Cable, TreePine, Pipette,
  Palette, Drill, Layers, type LucideIcon,
} from 'lucide-react';
import { useI18n } from '@/lib/store';
import type { Category } from '@/lib/data/mock';

const iconMap: Record<string, LucideIcon> = {
  Zap, Droplets, HardHat, Hammer, Wind, Wrench,
  PaintBucket, Home, Brick: Construction, Cable, TreePine, Pipette,
  Palette, Screwdriver: Drill,
};

// Emoji map for categories (fallback decorative emojis)
const emojiMap: Record<string, string> = {
  Zap: '⚡',
  Droplets: '💧',
  HardHat: '🪖',
  Hammer: '🔨',
  Wind: '🌬️',
  Wrench: '🔧',
  PaintBucket: '🎨',
  Home: '🏠',
  Construction: '🧱',
  Cable: '🔌',
  TreePine: '🌲',
  Pipette: '🧪',
  Palette: '🎯',
  Drill: '🔩',
  Layers: '📋',
};

interface CategoryGridProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  colorScheme?: 'orange' | 'teal' | 'gold';
}

const colorSchemes = {
  orange: {
    active: 'border-deal-orange bg-gradient-to-br from-orange-50 to-amber-50',
    icon: 'text-deal-orange',
    count: 'bg-deal-orange text-white',
    hover: 'hover:border-deal-orange hover:shadow-orange-200/50',
    gradient: 'from-deal-orange/5 via-deal-gold/5 to-deal-orange/5',
  },
  teal: {
    active: 'border-deal-teal bg-gradient-to-br from-teal-50 to-cyan-50',
    icon: 'text-deal-teal',
    count: 'bg-deal-teal text-white',
    hover: 'hover:border-deal-teal hover:shadow-teal-200/50',
    gradient: 'from-deal-teal/5 via-cyan-50/5 to-deal-teal/5',
  },
  gold: {
    active: 'border-deal-gold bg-gradient-to-br from-amber-50 to-yellow-50',
    icon: 'text-deal-gold',
    count: 'bg-deal-gold text-deal-navy',
    hover: 'hover:border-deal-gold hover:shadow-amber-200/50',
    gradient: 'from-deal-gold/5 via-amber-50/5 to-deal-gold/5',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function CategoryGrid({
  categories,
  activeCategory,
  onSelectCategory,
  colorScheme = 'orange',
}: CategoryGridProps) {
  const { getLocalizedValue, t } = useI18n();
  const colors = colorSchemes[colorScheme];

  const totalCount = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8"
    >
      {/* All category button */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelectCategory(null)}
        className={`category-card category-3d group flex flex-col items-center gap-2 p-4 transition-all duration-300 overflow-hidden relative
          ${!activeCategory
            ? `category-active-pressed ${colors.active} shadow-lg`
            : `border-gray-200 bg-white ${colors.hover} hover:shadow-md`
          }`}
      >
        {/* Shimmer overlay on hover */}
        <div className="absolute inset-0 category-chip-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-deal-orange/10 to-deal-gold/10 ${!activeCategory ? colors.icon : 'text-gray-500'} transition-all duration-300`}>
          <Layers className="w-6 h-6" />
        </div>
        <span className="text-sm font-semibold text-center">
          {t.categories.all}
        </span>
        <span className="text-lg leading-none">📋</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.count}`}>
          {totalCount}
        </span>
      </motion.button>

      {categories.map((cat, i) => {
        const IconComp = iconMap[cat.icon];
        const emoji = emojiMap[cat.icon] || '📦';
        const isActive = activeCategory === cat.id;
        return (
          <motion.button
            key={cat.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectCategory(cat.id === activeCategory ? null : cat.id)}
            className={`category-card category-3d group flex flex-col items-center gap-2 p-4 transition-all duration-300 overflow-hidden relative
              ${isActive
                ? `category-active-pressed ${colors.active} shadow-lg`
                : `border-gray-200 bg-white ${colors.hover} hover:shadow-md`
              }`}
          >
            {/* Subtle gradient that shifts on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'group-hover:opacity-100'}`} />

            {/* Shimmer overlay on hover */}
            <div className="absolute inset-0 category-chip-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[1]" />

            <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-deal-orange/10 to-deal-gold/10 ${isActive ? colors.icon : 'text-gray-500'} transition-all duration-300`}>
              {IconComp && <IconComp className="w-6 h-6" />}
            </div>
            <span className="relative text-sm font-semibold text-center leading-tight">
              {getLocalizedValue(cat.name, cat.nameFr)}
            </span>
            <span className="relative text-lg leading-none">{emoji}</span>
            <span className={`relative text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.count}`}>
              {cat.count}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
