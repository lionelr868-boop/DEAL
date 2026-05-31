'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/deal/navbar';
import Hero from '@/components/deal/hero';
import SectionSwitcher from '@/components/deal/section-switcher';
import AuthModal from '@/components/deal/auth-modal';
import DetailModal from '@/components/deal/detail-modal';
import ProfileModal from '@/components/deal/profile-modal';
import Footer from '@/components/deal/footer';
import DashboardWrapper from '@/components/deal/dashboard-wrapper';
import { useAppStore } from '@/lib/store';

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate the progress bar
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onDone, 1500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-animated" />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-deal-orange/10 blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with pulse */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl"
          >
            <span className="text-4xl font-black text-white tracking-tighter" style={{ fontFamily: "'Cairo', sans-serif" }}>
              D
            </span>
          </motion.div>

          {/* Pulsing ring */}
          <motion.div
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 w-24 h-24 rounded-3xl border-2 border-deal-orange/40"
          />
        </motion.div>

        {/* DEAL text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl font-black text-white mb-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          DEAL
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-sm text-white/60 mb-10"
        >
          ديل • منصة الحرفيين والتجار
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 200 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="h-1 bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-deal-orange via-deal-gold to-deal-teal rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-xs text-white/40 font-medium"
        >
          جاري التحميل...
        </motion.p>
      </div>
    </motion.div>
  );
}

// JSON-LD structured data for DEAL platform
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'DEAL',
  alternateName: 'منصة DEAL',
  description: 'DEAL هي منصة رقمية متكاملة تربط الحرفيين والتجار وأصحاب المعدات والمستخدمين في سوق أهراس والولايات المجاورة',
  url: 'https://deal.dz',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Centre Ville',
    addressLocality: 'Souk Ahras',
    addressRegion: 'Souk Ahras',
    postalCode: '41000',
    addressCountry: 'DZ',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 35.2833,
    longitude: 7.9667,
  },
  telephone: '+213-37-00-00-00',
  email: 'contact@deal.dz',
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: { '@type': 'GeoCoordinates', latitude: 35.2833, longitude: 7.9667 },
    geoRadius: '100000',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '18:00',
  },
  priceRange: '$$',
  sameAs: [],
};

export default function Home() {
  const { showAuthModal, showDashboard } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" onDone={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Cairo', 'Inter', sans-serif" }}>
        <AnimatePresence mode="wait">
          {showDashboard ? (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex-1"
            >
              <DashboardWrapper />
            </motion.div>
          ) : (
            <motion.div
              key="home-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex-1"
            >
              <Navbar />
              <main className="flex-1">
                <Hero />
                <SectionSwitcher />
              </main>
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>

        <AuthModal />
        <DetailModal />
        <ProfileModal />
      </div>
    </>
  );
}
