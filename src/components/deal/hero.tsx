'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Users, ShoppingBag, Truck, ThumbsUp } from 'lucide-react';
import { useI18n } from '@/lib/store';

export default function Hero() {
  const { t } = useI18n();

  const stats = [
    { key: 'craftsmen', icon: Users, color: 'from-deal-orange to-deal-orange-dark', delay: 0 },
    { key: 'products', icon: ShoppingBag, color: 'from-deal-teal to-deal-teal-dark', delay: 0.2 },
    { key: 'equipment', icon: Truck, color: 'from-deal-gold to-deal-gold-dark', delay: 0.4 },
    { key: 'satisfaction', icon: ThumbsUp, color: 'from-deal-orange to-deal-gold', delay: 0.6 },
  ];

  const statValues: Record<string, string> = {
    craftsmen: '+200',
    products: '+500',
    equipment: '+100',
    satisfaction: '98%',
  };

  const statLabels: Record<string, string> = {
    craftsmen: t.hero.stats.craftsmen,
    products: t.hero.stats.products,
    equipment: t.hero.stats.equipment,
    satisfaction: t.hero.stats.satisfaction,
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-deal-navy via-deal-navy-dark to-deal-navy" />
      <div className="absolute inset-0 hero-pattern opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Decorative blobs */}
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 start-10 w-72 h-72 rounded-full bg-deal-orange/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -40, 20, 0], y: [0, 20, -30, 0], scale: [1, 0.9, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-20 end-10 w-96 h-96 rounded-full bg-deal-teal/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 20, -10, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 start-1/3 w-64 h-64 rounded-full bg-deal-gold/15 blur-3xl"
      />

      {/* Floating circles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          className={`absolute rounded-full border border-white/10 ${
            i % 3 === 0 ? 'w-3 h-3' : i % 3 === 1 ? 'w-2 h-2' : 'w-4 h-4'
          }`}
          style={{
            top: `${15 + i * 15}%`,
            left: `${10 + i * 15}%`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Main badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-deal-teal animate-pulse" />
          <span className="text-sm font-medium text-white/90">{t.app.tagline}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
        >
          <span className="block">{t.hero.title.split(' ').slice(0, 3).join(' ')}</span>
          <span className="block bg-gradient-to-r from-deal-orange via-deal-gold to-deal-teal bg-clip-text text-transparent mt-2">
            {t.hero.title.split(' ').slice(3).join(' ')}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-3d text-white bg-deal-orange text-base px-8 py-4 rounded-2xl font-bold"
            onClick={() => {
              const el = document.getElementById('services-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t.hero.cta1}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-3d btn-3d-teal text-white text-base px-8 py-4 rounded-2xl font-bold"
          >
            {t.hero.cta2}
          </motion.button>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + stat.delay }}
                whileHover={{ y: -8 }}
                className={`stat-card rounded-2xl p-4 sm:p-6 ${i % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <IconComp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-deal-navy">
                  {statValues[stat.key]}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                  {statLabels[stat.key]}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1.5, y: { duration: 1.5, repeat: Infinity } }}
          className="mt-12"
        >
          <ArrowDown className="w-6 h-6 text-white/40 mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}
