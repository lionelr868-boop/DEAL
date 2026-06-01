'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ArrowDown, Users, ShoppingBag, Truck, Search,
  CheckCircle, Wrench, Star, ArrowRight, ArrowLeft,
  Sparkles, Shield, Clock,
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
  accentColor,
  delay,
}: {
  icon: typeof Wrench;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative rounded-2xl overflow-hidden"
    >
      {/* Glass card on dark background */}
      <div
        className="relative p-5 sm:p-6 flex gap-4 items-start rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${accentColor}18`,
        }}
      >
        {/* Subtle glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${accentColor}10 0%, transparent 70%)`,
          }}
        />

        {/* Gradient icon container */}
        <div
          className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            boxShadow: `0 4px 20px ${accentColor}30`,
          }}
        >
          <IconComp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-white mb-1">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-white/55 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Corner accent line */}
        <div
          className="absolute bottom-0 start-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
          style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }}
        />
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: stat.delay }}
      whileHover={{ y: -4, scale: 1.03 }}
      className={`hero-stat-card rounded-2xl p-5 sm:p-6 relative overflow-hidden ${index % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}
    >
      {/* Glass background */}
      <div className="relative z-10 text-center">
        <div
          className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}
          style={{ boxShadow: `0 4px 16px ${stat.color.includes('orange') ? 'rgba(255,107,53,0.3)' : stat.color.includes('teal') ? 'rgba(13,148,136,0.3)' : 'rgba(245,158,11,0.3)'}` }}
        >
          <IconComp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-white">
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
        <div className="text-xs sm:text-sm text-white/50 font-medium mt-1.5">
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
      color: 'from-amber-400 to-amber-500',
      ringColor: 'rgba(245,158,11,0.15)',
      number: 1,
    },
    {
      icon: Users,
      color: 'from-teal-400 to-teal-500',
      ringColor: 'rgba(13,148,136,0.15)',
      number: 2,
    },
    {
      icon: CheckCircle,
      color: 'from-orange-400 to-orange-500',
      ringColor: 'rgba(255,107,53,0.15)',
      number: 3,
    },
  ];

  const titles = [t.hero.step1Title, t.hero.step2Title, t.hero.step3Title];
  const descs = [t.hero.step1Desc, t.hero.step2Desc, t.hero.step3Desc];

  return (
    <div ref={ref} className="max-w-4xl mx-auto mt-20 sm:mt-24">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
            {t.hero.howItWorks}
          </span>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-0 relative">
        {steps.map((step, i) => {
          const IconComp = step.icon;
          return (
            <div key={i} className="flex-1 relative flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center w-full max-w-[220px]"
              >
                {/* Step circle with ring */}
                <div className="relative mb-5">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center relative`}
                    style={{ boxShadow: `0 8px 32px ${step.ringColor}` }}
                  >
                    <IconComp className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                    {/* Step number badge */}
                    <div className="absolute -top-1.5 -end-1.5 w-7 h-7 rounded-lg bg-deal-navy-dark border-2 border-white/20 flex items-center justify-center">
                      <span className="text-xs font-black text-white">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>
                  {/* Outer ring */}
                  <div
                    className="absolute -inset-2 rounded-3xl opacity-30"
                    style={{
                      border: `1.5px dashed ${i === 0 ? 'rgba(245,158,11,0.3)' : i === 1 ? 'rgba(13,148,136,0.3)' : 'rgba(255,107,53,0.3)'}`,
                    }}
                  />
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
                  {titles[i]}
                </h3>
                <p className="text-xs sm:text-sm text-white/45 leading-relaxed max-w-[180px]">
                  {descs[i]}
                </p>
              </motion.div>

              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.2 + 0.3 }}
                  className="hidden sm:block absolute top-9 start-[65%] end-[-25%] h-[2px]"
                >
                  <div className="w-full rounded-full" style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                  }} />
                </motion.div>
              )}
              {/* Connector line (mobile) */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.2 + 0.3 }}
                  className="sm:hidden w-[2px] h-8 mt-3 mb-1 origin-top rounded-full"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────── Floating Decorative Shape ──────────── */
function FloatingShape({
  className,
  delay = 0,
  duration = 6,
}: {
  className: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -15, 0],
        rotate: [0, 5, -5, 0],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
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
      color: 'from-amber-400 to-amber-500',
      delay: 0,
      target: realStats ? `${realStats.totalUsers}` : '0',
    },
    {
      key: 'services',
      icon: ShoppingBag,
      color: 'from-teal-400 to-teal-500',
      delay: 0.15,
      target: realStats ? `${realStats.services}` : '0',
    },
    {
      key: 'products',
      icon: Truck,
      color: 'from-orange-400 to-orange-500',
      delay: 0.3,
      target: realStats ? `${realStats.products}` : '0',
    },
    {
      key: 'satisfaction',
      icon: Star,
      color: 'from-amber-300 to-orange-400',
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
      gradientFrom: '#F59E0B',
      gradientTo: '#D97706',
      accentColor: '#F59E0B',
    },
    {
      icon: ShoppingBag,
      title: t.sections.products,
      description:
        locale === 'fr'
          ? 'Matériaux et produits de qualité à prix compétitifs'
          : 'مواد ومنتجات عالية الجودة بأسعار منافسة',
      gradientFrom: '#14B8A6',
      gradientTo: '#0D9488',
      accentColor: '#14B8A6',
    },
    {
      icon: Truck,
      title: t.sections.equipment,
      description:
        locale === 'fr'
          ? 'Louez du matériel professionnel au meilleur tarif'
          : 'استأجر معدات احترافية بأفضل الأسعار',
      gradientFrom: '#FB923C',
      gradientTo: '#EA580C',
      accentColor: '#FB923C',
    },
  ];

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden hero-dark-bg"
    >
      {/* Dot grid pattern overlay */}
      <div className="hero-dot-pattern absolute inset-0 pointer-events-none z-[1]" />

      {/* Gradient mesh orbs */}
      <div className="absolute top-[-10%] start-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-[10%] end-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 70%)' }}
      />
      <div className="absolute top-[40%] start-[50%] w-[400px] h-[400px] rounded-full pointer-events-none z-[1] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.04) 0%, transparent 70%)' }}
      />

      {/* ── Large Animated Background Logo with Light Effects ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
        {/* Outer glow ring — pulsing light */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.04, 0.09, 0.04],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[700px] h-[700px] sm:w-[800px] sm:h-[800px] lg:w-[1000px] lg:h-[1000px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.06) 30%, transparent 70%)' }}
        />

        {/* Second glow ring — teal accent */}
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.03, 0.07, 0.03],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute w-[750px] h-[750px] sm:w-[850px] sm:h-[850px] lg:w-[950px] lg:h-[950px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 60%)' }}
        />

        {/* Rotating light beam ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[600px] h-[600px] sm:w-[750px] sm:h-[750px] lg:w-[900px] lg:h-[900px] rounded-full"
        >
          <div className="absolute top-0 start-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" style={{ filter: 'blur(4px)' }} />
          <div className="absolute bottom-0 start-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-gradient-to-r from-transparent via-teal-400/15 to-transparent" style={{ filter: 'blur(4px)' }} />
          <div className="absolute start-0 top-1/2 -translate-y-1/2 w-1 h-32 rounded-full bg-gradient-to-b from-transparent via-orange-400/15 to-transparent" style={{ filter: 'blur(4px)' }} />
          <div className="absolute end-0 top-1/2 -translate-y-1/2 w-1 h-32 rounded-full bg-gradient-to-b from-transparent via-amber-300/15 to-transparent" style={{ filter: 'blur(4px)' }} />
        </motion.div>

        {/* Counter-rotating light ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[550px] h-[550px] sm:w-[640px] sm:h-[640px] lg:w-[780px] lg:h-[780px] rounded-full"
        >
          <div className="absolute top-0 start-0 w-20 h-0.5 rounded-full bg-gradient-to-e from-amber-400/25 to-transparent" style={{ filter: 'blur(3px)' }} />
          <div className="absolute bottom-0 end-0 w-20 h-0.5 rounded-full bg-gradient-to-s from-teal-400/20 to-transparent" style={{ filter: 'blur(3px)' }} />
        </motion.div>

        {/* The Logo Image — floating with subtle movement */}
        <motion.div
          animate={{
            y: [0, -20, 0, 12, 0],
            x: [0, 10, -8, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-[3]"
        >
          <motion.div
            animate={{
              opacity: [0.1, 0.18, 0.1],
              scale: [1, 1.04, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            {/* Soft glow behind logo */}
            <div className="absolute inset-0 scale-150 blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.08) 40%, transparent 70%)' }}
            />
            <img
              src="/logo.png"
              alt=""
              className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[420px] lg:h-[420px] object-contain"
              style={{ filter: 'drop-shadow(0 0 60px rgba(251,191,36,0.25)) drop-shadow(0 0 120px rgba(245,158,11,0.12))' }}
            />
          </motion.div>
        </motion.div>

        {/* Orbiting light dots around the logo */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <motion.div
            key={angle}
            animate={{ rotate: 360 }}
            transition={{ duration: 15 + (angle % 30), repeat: Infinity, ease: 'linear', delay: angle / 360 }}
            className="absolute w-[450px] h-[450px] sm:w-[550px] sm:h-[550px] lg:w-[650px] lg:h-[650px]"
          >
            <div
              className="absolute top-0 start-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{
                background: angle % 120 === 0 ? 'rgba(251,191,36,0.4)' : angle % 120 === 60 ? 'rgba(20,184,166,0.35)' : 'rgba(255,107,53,0.35)',
                boxShadow: angle % 120 === 0
                  ? '0 0 8px rgba(251,191,36,0.6), 0 0 20px rgba(251,191,36,0.3)'
                  : angle % 120 === 60
                    ? '0 0 8px rgba(20,184,166,0.5), 0 0 20px rgba(20,184,166,0.2)'
                    : '0 0 8px rgba(255,107,53,0.5), 0 0 20px rgba(255,107,53,0.2)',
                filter: 'blur(0.5px)',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating decorative shapes */}
      <FloatingShape
        className="absolute top-[15%] start-[8%] w-3 h-3 rounded-full bg-amber-400/20 z-[2]"
        delay={0}
        duration={5}
      />
      <FloatingShape
        className="absolute top-[25%] end-[12%] w-2 h-2 rounded-full bg-teal-400/25 z-[2]"
        delay={1}
        duration={7}
      />
      <FloatingShape
        className="absolute bottom-[30%] start-[15%] w-2.5 h-2.5 bg-orange-400/15 z-[2]"
        delay={0.5}
        duration={6}
        style={{ borderRadius: '4px', transform: 'rotate(45deg)' } as React.CSSProperties}
      />
      <FloatingShape
        className="absolute top-[60%] end-[8%] w-4 h-4 rounded-full bg-amber-300/10 z-[2]"
        delay={2}
        duration={8}
      />
      <FloatingShape
        className="absolute top-[10%] end-[25%] w-2 h-2 bg-teal-300/20 z-[2]"
        delay={1.5}
        duration={5.5}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 sm:pb-28"
        style={{ y: contentY }}
      >
        <motion.div style={{ opacity }}>
          {/* ── Two-Column Layout ── */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24">
            {/* Left Column: Text Content */}
            <div className="flex-1 text-center lg:text-start">
              {/* Tagline badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-sm font-medium text-white/70">
                  {t.app.tagline}
                </span>
              </motion.div>

              {/* Big gradient heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6"
                style={{
                  fontFamily: "'Cairo', 'Inter', sans-serif",
                }}
              >
                <span
                  className="block"
                  style={{
                    background:
                      'linear-gradient(135deg, #FBBF24 0%, #F59E0B 30%, #FB923C 60%, #14B8A6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {t.hero.title.split(' ').slice(0, 3).join(' ')}
                </span>
                <span className="block text-white mt-2">
                  {t.hero.title.split(' ').slice(3).join(' ')}
                </span>
              </motion.h1>

              {/* Bilingual subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-base sm:text-lg text-white/50 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              >
                {t.hero.subtitle}
              </motion.p>

              {/* Embedded Search Bar — Glass Morphism */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="max-w-xl mx-auto lg:mx-0"
              >
                <div className="relative group hero-search-glass rounded-2xl">
                  <div
                    className="flex items-center rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {/* Search icon */}
                    <div className="ps-4 sm:ps-5 pe-3 flex items-center">
                      <Search className="w-5 h-5 text-white/40 group-hover:text-amber-400 transition-colors" />
                    </div>

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.nav.search}
                      className="flex-1 py-4 sm:py-5 bg-transparent text-white placeholder:text-white/30 text-sm sm:text-base font-medium outline-none min-w-0"
                    />

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="me-2 sm:me-3 flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white text-sm font-bold transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
                        boxShadow: '0 4px 16px rgba(245,158,11,0.25)',
                      }}
                    >
                      <span className="hidden sm:inline">{t.common.search}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Trust badges below search */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8"
              >
                <div className="flex items-center gap-1.5 text-white/35 text-xs font-medium">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Vérifié' : 'موثوق'}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/15" />
                <div className="flex items-center gap-1.5 text-white/35 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Support 24/7' : 'دعم متواصل'}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/15" />
                <div className="flex items-center gap-1.5 text-white/35 text-xs font-medium">
                  <Star className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Meilleur rapport qualité-prix' : 'أفضل الأسعار'}</span>
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
                    accentColor={card.accentColor}
                    delay={0.4 + i * 0.15}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Stats Band ── */}
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
            className="mt-14 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] text-white/25 font-medium uppercase tracking-widest">
              {locale === 'fr' ? 'Découvrir' : 'اكتشف'}
            </span>
            <ArrowDown className="w-5 h-5 text-white/20" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
