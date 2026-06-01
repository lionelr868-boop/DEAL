'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ArrowDown, Users, ShoppingBag, Truck, Search,
  CheckCircle, Wrench, Star, ArrowRight, ArrowLeft,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import { AnimatedCounter } from './animated-counter';

/* ──────────── Feature Card (right column) ──────────── */
function FeatureCard({
  icon: IconComp,
  title,
  description,
  gradientFrom,
  gradientTo,
  delay,
}: {
  icon: typeof Wrench;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}08 0%, ${gradientTo}12 100%)`,
        border: `1px solid ${gradientFrom}20`,
      }}
    >
      {/* Shimmer on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 40%, ${gradientFrom}15 45%, ${gradientTo}10 50%, transparent 55%)`,
          backgroundSize: '200% 100%',
        }}
      />
      <div className="relative p-5 sm:p-6 flex gap-4 items-start">
        {/* Gradient icon container */}
        <div
          className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            boxShadow: `0 4px 14px ${gradientFrom}35`,
          }}
        >
          <IconComp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-deal-navy mb-1">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────── Stat Card (bottom stats bar) ──────────── */
function StatCard({
  stat,
  statLabel,
  index,
  isInView,
}: {
  stat: {
    key: string;
    icon: typeof Users;
    color: string;
    delay: number;
    target: string | number;
  };
  statLabel: string;
  index: number;
  isInView: boolean;
}) {
  const IconComp = stat.icon;
  return (
    <motion.div
      key={stat.key}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: stat.delay }}
      whileHover={{ y: -6 }}
      className={`stat-card rounded-2xl p-4 sm:p-6 relative overflow-hidden ${index % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}
    >
      <div className="relative z-10">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}
        >
          <IconComp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-deal-navy">
          {isInView ? (
            <AnimatedCounter
              target={stat.target}
              duration={1500}
              startOnView={true}
              isInView={true}
            />
          ) : (
            <span>
              {typeof stat.target === 'string'
                ? stat.target.match(/^[^0-9]*/)?.[0] || '0'
                : '0'}
            </span>
          )}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
          {statLabel}
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────── How It Works ──────────── */
function HowItWorksSection() {
  const { t } = useI18n();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const steps = [
    {
      icon: Search,
      color: 'from-deal-orange to-deal-orange-dark',
      number: 1,
    },
    {
      icon: Users,
      color: 'from-deal-teal to-deal-teal-dark',
      number: 2,
    },
    {
      icon: CheckCircle,
      color: 'from-deal-gold to-deal-gold-dark',
      number: 3,
    },
  ];

  const titles = [t.hero.step1Title, t.hero.step2Title, t.hero.step3Title];
  const descs = [t.hero.step1Desc, t.hero.step2Desc, t.hero.step3Desc];

  return (
    <div ref={ref} className="max-w-4xl mx-auto mt-16 sm:mt-20">
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

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-0 relative">
        {steps.map((step, i) => {
          const IconComp = step.icon;
          return (
            <div key={i} className="flex-1 relative flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center w-full max-w-[200px] glass-card rounded-2xl p-5"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-4 relative`}
                >
                  <IconComp className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  <div className="absolute -top-1 -end-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    <span className="text-xs font-black text-deal-navy">
                      {step.number}
                    </span>
                  </div>
                </motion.div>
                <h3 className="text-sm sm:text-base font-bold text-deal-navy mb-1">
                  {titles[i]}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {descs[i]}
                </p>
              </motion.div>

              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.2 + 0.3 }}
                  className="hidden sm:block absolute top-8 sm:top-10 start-[60%] end-[-20%] h-0.5"
                >
                  <div className="w-full border-t-2 border-dashed border-deal-orange/30" />
                </motion.div>
              )}
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

/* ──────────── Main Hero ──────────── */
export default function Hero() {
  const { locale, t } = useI18n();
  const { searchQuery, setSearchQuery } = useAppStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-50px' });
  const [realStats, setRealStats] = useState<{
    totalUsers: number;
    craftsmen: number;
    customers: number;
    services: number;
    products: number;
    equipment: number;
    bookings: number;
    orders: number;
    avgRating: number;
  } | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        setRealStats({
          totalUsers: data.users?.total || 0,
          craftsmen: data.users?.craftsmen || 0,
          customers: data.users?.customers || 0,
          services: data.services || 0,
          products: data.products || 0,
          equipment: data.equipment || 0,
          bookings: data.bookings || 0,
          orders: data.orders || 0,
          avgRating: data.avgRating || 0,
        });
      })
      .catch(() => {});
  }, []);

  const { scrollY } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollY, [0, 500], [0, 60]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);

  const stats = [
    {
      key: 'providers',
      icon: Wrench,
      color: 'from-deal-orange to-deal-orange-dark',
      delay: 0,
      target: realStats ? `${realStats.totalUsers}` : '0',
    },
    {
      key: 'services',
      icon: ShoppingBag,
      color: 'from-deal-teal to-deal-teal-dark',
      delay: 0.15,
      target: realStats ? `${realStats.services}` : '0',
    },
    {
      key: 'products',
      icon: Truck,
      color: 'from-deal-gold to-deal-gold-dark',
      delay: 0.3,
      target: realStats ? `${realStats.products}` : '0',
    },
    {
      key: 'satisfaction',
      icon: Star,
      color: 'from-deal-orange to-deal-gold',
      delay: 0.45,
      target: realStats ? `${realStats.avgRating}` : '0',
    },
  ];

  const getStatLabel = (key: string) => {
    if (locale === 'fr') {
      const frMap: Record<string, string> = {
        providers: `${realStats?.craftsmen || 0} artisans`,
        services: `${realStats?.services || 0} services`,
        products: `${realStats?.products || 0} produits`,
        satisfaction: `Note ${realStats?.avgRating || 0}/5`,
      };
      return frMap[key] || '';
    }
    const arMap: Record<string, string> = {
      providers: `${realStats?.craftsmen || 0} حرفي`,
      services: `${realStats?.services || 0} خدمة`,
      products: `${realStats?.products || 0} منتج`,
      satisfaction: `${realStats?.avgRating || 0}/5 تقييم`,
    };
    return arMap[key] || '';
  };

  /* Feature cards data */
  const featureCards = [
    {
      icon: Wrench,
      title: t.sections.services,
      description:
        locale === 'fr'
          ? 'Trouvez des artisans qualifiés pour tous vos projets'
          : 'أفضل الحرفيين المتخصصين لمشاريعك',
      gradientFrom: '#FF6B35',
      gradientTo: '#E55A25',
    },
    {
      icon: ShoppingBag,
      title: t.sections.products,
      description:
        locale === 'fr'
          ? 'Matériaux et produits de qualité à prix compétitifs'
          : 'مواد ومنتجات عالية الجودة بأسعار منافسة',
      gradientFrom: '#0D9488',
      gradientTo: '#0F766E',
    },
    {
      icon: Truck,
      title: t.sections.equipment,
      description:
        locale === 'fr'
          ? 'Louez du matériel professionnel au meilleur tarif'
          : 'استأجر معدات احترافية بأفضل الأسعار',
      gradientFrom: '#F59E0B',
      gradientTo: '#D97706',
    },
  ];

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(165deg, #FFFFFF 0%, #FFF8F0 30%, #F0FDFA 60%, #E8ECF1 100%)',
      }}
    >
      {/* Subtle decorative orbs */}
      <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-deal-orange/[0.06] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 end-0 w-[600px] h-[600px] bg-deal-teal/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 start-1/2 w-[400px] h-[400px] bg-deal-gold/[0.04] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-20"
        style={{ y: contentY }}
      >
        <motion.div style={{ opacity }}>
          {/* ── Two-Column Layout ── */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-20">
            {/* Left Column: Text Content */}
            <div className="flex-1 text-center lg:text-start">
              {/* Tagline badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-deal-orange/20 bg-deal-orange/[0.06] backdrop-blur-sm mb-6"
              >
                <div className="w-2 h-2 rounded-full bg-deal-teal animate-pulse" />
                <span className="text-sm font-medium text-deal-navy/80">
                  {t.app.tagline}
                </span>
              </motion.div>

              {/* Big gradient heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-5"
                style={{
                  fontFamily: "'Cairo', 'Inter', sans-serif",
                }}
              >
                <span
                  className="block"
                  style={{
                    background:
                      'linear-gradient(135deg, #FF6B35 0%, #F59E0B 40%, #0D9488 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {t.hero.title.split(' ').slice(0, 3).join(' ')}
                </span>
                <span className="block text-deal-navy mt-1">
                  {t.hero.title.split(' ').slice(3).join(' ')}
                </span>
              </motion.h1>

              {/* Bilingual subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                {t.hero.subtitle}
              </motion.p>

              {/* Embedded Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="max-w-xl mx-auto lg:mx-0"
              >
                <div className="relative group search-focus-ring rounded-2xl">
                  <div className="flex items-center bg-white/80 backdrop-blur-xl border-2 border-deal-orange/15 rounded-2xl shadow-lg shadow-deal-orange/5 group-hover:border-deal-orange/30 group-hover:shadow-xl group-hover:shadow-deal-orange/10 transition-all duration-300 overflow-hidden">
                    {/* Search icon */}
                    <div className="ps-4 sm:ps-5 pe-3 flex items-center">
                      <Search className="w-5 h-5 text-deal-orange/60 group-hover:text-deal-orange transition-colors" />
                    </div>

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.nav.search}
                      className="flex-1 py-4 sm:py-5 bg-transparent text-deal-navy placeholder:text-muted-foreground/60 text-sm sm:text-base font-medium outline-none min-w-0"
                    />

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="me-2 sm:me-3 flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-deal-orange to-deal-orange-dark text-white text-sm font-bold shadow-md shadow-deal-orange/20 hover:shadow-lg hover:shadow-deal-orange/30 transition-shadow"
                    >
                      <span className="hidden sm:inline">{t.common.search}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 w-full max-w-md lg:max-w-none"
            >
              <div className="flex flex-col gap-4">
                {featureCards.map((card, i) => (
                  <FeatureCard
                    key={card.title}
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                    gradientFrom={card.gradientFrom}
                    gradientTo={card.gradientTo}
                    delay={0.4 + i * 0.15}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Animated Stats Bar ── */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <StatCard
                key={stat.key}
                stat={stat}
                statLabel={getStatLabel(stat.key)}
                index={i}
                isInView={statsInView}
              />
            ))}
          </motion.div>

          {/* ── How It Works ── */}
          <HowItWorksSection />

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{
              delay: 1.5,
              y: { duration: 1.5, repeat: Infinity },
            }}
            className="mt-12 flex justify-center"
          >
            <ArrowDown className="w-6 h-6 text-deal-navy/30" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
