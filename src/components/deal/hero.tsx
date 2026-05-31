'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowDown, Users, ShoppingBag, Truck, ThumbsUp, Search, CheckCircle } from 'lucide-react';
import { useI18n } from '@/lib/store';

function StatCard({ stat, statValue, statLabel, index }: {
  stat: { key: string; icon: typeof Users; color: string; delay: number };
  statValue: string;
  statLabel: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const IconComp = stat.icon;
  const glowColors: Record<string, string> = {
    craftsmen: 'rgba(255, 107, 53, 0.4)',
    products: 'rgba(13, 148, 136, 0.4)',
    equipment: 'rgba(245, 158, 11, 0.4)',
    satisfaction: 'rgba(255, 107, 53, 0.3)',
  };

  return (
    <motion.div
      key={stat.key}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 + stat.delay }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`stat-card rounded-2xl p-4 sm:p-6 relative overflow-hidden ${index % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}
    >
      {/* Animated glow border on hover */}
      <motion.div
        initial={false}
        animate={hovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-2xl"
        style={{
          boxShadow: `inset 0 0 0 2px ${glowColors[stat.key] || 'rgba(255,107,53,0.3)'}, 0 0 20px ${glowColors[stat.key] || 'rgba(255,107,53,0.2)'}`,
        }}
      />
      {/* Glow shimmer on hover */}
      <motion.div
        initial={false}
        animate={hovered
          ? { backgroundPosition: '200% 50%' }
          : { backgroundPosition: '0% 50%' }
        }
        transition={{ duration: 2, ease: 'linear' }}
        className="absolute inset-0 rounded-2xl opacity-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColors[stat.key] || 'rgba(255,107,53,0.15)'}, transparent)`,
          backgroundSize: '200% 100%',
          opacity: hovered ? 0.15 : 0,
        }}
      />

      <div className="relative z-10">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
          <IconComp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-deal-navy">
          {statValue}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
          {statLabel}
        </div>
      </div>
    </motion.div>
  );
}

function HowItWorksSection() {
  const { t } = useI18n();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const steps = [
    { icon: Search, color: 'from-deal-orange to-deal-orange-dark', number: 1 },
    { icon: Users, color: 'from-deal-teal to-deal-teal-dark', number: 2 },
    { icon: CheckCircle, color: 'from-deal-gold to-deal-gold-dark', number: 3 },
  ];

  const titles = [t.hero.step1Title, t.hero.step2Title, t.hero.step3Title];
  const descs = [t.hero.step1Desc, t.hero.step2Desc, t.hero.step3Desc];

  return (
    <div ref={ref} className="max-w-4xl mx-auto mt-16 sm:mt-20">
      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl sm:text-3xl font-black text-deal-navy">
          {t.hero.howItWorks}
        </h2>
      </motion.div>

      {/* Steps */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-0 relative">
        {steps.map((step, i) => {
          const IconComp = step.icon;
          return (
            <div key={i} className="flex-1 relative flex flex-col items-center">
              {/* Step card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center w-full max-w-[200px]"
              >
                {/* Number circle with icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-4 relative`}
                >
                  <IconComp className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  {/* Number badge */}
                  <div className="absolute -top-1 -end-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    <span className="text-xs font-black text-deal-navy">{step.number}</span>
                  </div>
                </motion.div>

                <h3 className="text-sm sm:text-base font-bold text-deal-navy mb-1">
                  {titles[i]}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {descs[i]}
                </p>
              </motion.div>

              {/* Dotted connector line (not after last) */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.2 + 0.3 }}
                  className="hidden sm:block absolute top-8 sm:top-10 start-[60%] end-[-20%] h-0.5"
                >
                  <div className="w-full border-t-2 border-dashed border-deal-orange/30" />
                  <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={isInView ? { x: '100%', opacity: [0, 1, 1, 0] } : {}}
                    transition={{ duration: 1.5, delay: i * 0.2 + 0.5, ease: 'easeInOut' }}
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-deal-orange"
                  />
                </motion.div>
              )}

              {/* Mobile vertical connector */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.2 + 0.3 }}
                  className="sm:hidden w-0.5 h-8 mt-2 mb-2 border-s-2 border-dashed border-deal-orange/30 origin-top"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useI18n();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollY, [0, 500], [0, 150]);
  const contentY = useTransform(scrollY, [0, 500], [0, 60]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);

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
    <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background layers with parallax */}
      <motion.div className="absolute inset-0 bg-gradient-to-br from-deal-navy via-deal-navy-dark to-deal-navy" style={{ y: bgY }} />
      <motion.div className="absolute inset-0 hero-pattern opacity-60" style={{ y: bgY }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Decorative blobs with parallax */}
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ y: bgY }}
        className="absolute top-20 start-10 w-72 h-72 rounded-full bg-deal-orange/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -40, 20, 0], y: [0, 20, -30, 0], scale: [1, 0.9, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ y: useTransform(scrollY, [0, 500], [0, 100]) }}
        className="absolute bottom-20 end-10 w-96 h-96 rounded-full bg-deal-teal/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 20, -10, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        style={{ y: useTransform(scrollY, [0, 500], [0, 80]) }}
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

      {/* Content with parallax */}
      <motion.div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20" style={{ y: contentY }}>
        <motion.div style={{ opacity }}>
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
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <StatCard
              key={stat.key}
              stat={stat}
              statValue={statValues[stat.key]}
              statLabel={statLabels[stat.key]}
              index={i}
            />
          ))}
        </motion.div>

        {/* How it works section */}
        <HowItWorksSection />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1.5, y: { duration: 1.5, repeat: Infinity } }}
          className="mt-12"
        >
          <ArrowDown className="w-6 h-6 text-white/40 mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
}


