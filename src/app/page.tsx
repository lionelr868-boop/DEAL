'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/deal/navbar';
import Hero from '@/components/deal/hero';
import SectionSwitcher from '@/components/deal/section-switcher';
import AuthModal from '@/components/deal/auth-modal';
import DetailModal from '@/components/deal/detail-modal';
import Footer from '@/components/deal/footer';
import DashboardWrapper from '@/components/deal/dashboard-wrapper';
import { useAppStore } from '@/lib/store';

export default function Home() {
  const { showAuthModal, showDashboard } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Cairo', 'Inter', sans-serif" }}>
      {showDashboard ? (
        <DashboardWrapper />
      ) : (
        <>
          <Navbar />
          <main className="flex-1">
            <Hero />
            <SectionSwitcher />
          </main>
          <Footer />
        </>
      )}
      <AuthModal />
      <DetailModal />
    </div>
  );
}
