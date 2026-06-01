'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Heart, ArrowUp, Send, Sparkles, CheckCircle2, Users, Wrench, Package, Truck, Shield, Award, Zap } from 'lucide-react';
import { useI18n } from '@/lib/store';
import { AnimatedCounter } from './animated-counter';

// SVG Social Icons as components
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

const socialLinks = [
  { icon: FacebookIcon, label: 'Facebook', href: '#', hoverBg: 'hover:bg-blue-600', hoverShadow: 'hover:shadow-blue-600/40' },
  { icon: InstagramIcon, label: 'Instagram', href: '#', hoverBg: 'hover:bg-gradient-to-tr hover:from-purple-600 hover:via-pink-500 hover:to-yellow-500', hoverShadow: 'hover:shadow-pink-500/40' },
  { icon: YoutubeIcon, label: 'YouTube', href: '#', hoverBg: 'hover:bg-red-600', hoverShadow: 'hover:shadow-red-600/40' },
  { icon: TikTokIcon, label: 'TikTok', href: '#', hoverBg: 'hover:bg-gray-900', hoverShadow: 'hover:shadow-gray-600/40' },
];

export default function Footer() {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [platformStats, setPlatformStats] = useState<{ users: number; services: number; products: number; equipment: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Show back to top button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch platform stats
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setPlatformStats({
            users: data.users?.total || 0,
            services: data.services || 0,
            products: data.products || 0,
            equipment: data.equipment || 0,
          });
        }
      } catch {
        // silently fail
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const quickLinks = [
    { label: t.nav.services, href: '#services' },
    { label: t.nav.products, href: '#products' },
    { label: t.nav.equipment, href: '#equipment' },
    { label: t.footer.help, href: '#' },
    { label: t.footer.privacy, href: '#' },
    { label: t.footer.terms, href: '#' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-deal-navy text-white mt-auto">
      {/* Wave divider between content and footer */}
      <div className="wave-divider text-deal-navy" style={{ marginTop: '-2px' }}>
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M0,40 C360,100 720,0 1080,60 C1260,80 1380,50 1440,40 L1440,100 L0,100 Z" opacity="0.6" />
          <path fill="currentColor" d="M0,60 C240,20 480,80 720,50 C960,20 1200,80 1440,50 L1440,100 L0,100 Z" opacity="0.3" />
        </svg>
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-deal-orange/5 via-transparent to-deal-teal/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-deal-navy-dark/50 via-transparent to-transparent pointer-events-none" />

      {/* Top gradient line */}
      <div className="h-1 gradient-animated relative z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10"
        >
          {/* About section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="DEAL Logo"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {t.footer.aboutText}
            </p>

            {/* Social icons - enhanced */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social, i) => {
                const IconComp = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.2, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 cursor-pointer social-icon-rotate ${social.hoverBg} ${social.hoverShadow} hover:shadow-lg`}
                    title={social.label}
                  >
                    <IconComp />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t.footer.quickLinks}</h3>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-deal-orange text-sm transition-all duration-200 hover:translate-x-1 hover:ps-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t.footer.contact}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/60 text-sm group hover:text-white/80 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-deal-orange/10 flex items-center justify-center flex-shrink-0 group-hover:bg-deal-orange/20 transition-colors">
                  <MapPin className="w-4 h-4 text-deal-orange" />
                </div>
                <span>سوق أهراس، الجزائر</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm group hover:text-white/80 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-deal-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-deal-teal/20 transition-colors">
                  <Phone className="w-4 h-4 text-deal-teal" />
                </div>
                <span dir="ltr">+213 77 000 00 00</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm group hover:text-white/80 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-deal-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-deal-gold/20 transition-colors">
                  <Mail className="w-4 h-4 text-deal-gold" />
                </div>
                <span>contact@deal.dz</span>
              </div>
            </div>
          </div>

          {/* Newsletter - enhanced */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{t.footer.newsletter}</h3>
              <Sparkles className="w-4 h-4 text-deal-gold" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {t.footer.newsletterDesc}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.newsletterPlaceholder}
                  className="w-full ps-10 pe-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white text-sm placeholder:text-white/35 outline-none focus:border-deal-orange/60 focus:bg-white/12 transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(255,107,53,0.15)]"
                  dir="ltr"
                  required
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-deal-orange to-deal-orange-dark text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-deal-orange/30 transition-all duration-300 font-semibold text-sm"
              >
                <Send className="w-4 h-4" />
                {locale === 'ar' ? 'اشترك الآن' : "S'inscrire"}
              </motion.button>
            </form>
            <AnimatePresence>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-deal-teal text-xs font-medium flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {locale === 'ar' ? 'تم الاشتراك بنجاح!' : 'Inscrit avec succès!'}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Animated divider with dots */}
        <div className="animated-divider-dots mb-8">
          <div className="divider-dot" />
          <div className="divider-dot" />
          <div className="divider-dot" />
          <div className="divider-dot" />
          <div className="divider-dot" />
          <div className="divider-line" />
          <div className="divider-dot" />
          <div className="divider-dot" />
          <div className="divider-dot" />
          <div className="divider-dot" />
          <div className="divider-dot" />
        </div>

        {/* Platform Stats Live */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-5">
            <Zap className="w-4 h-4 text-deal-orange" />
            <h3 className="text-lg font-bold text-center">
              {locale === 'ar' ? 'إحصائيات المنصة المباشرة' : 'Statistiques en Direct'}
            </h3>
            <Zap className="w-4 h-4 text-deal-orange" />
          </div>
          {statsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="footer-stat-skeleton h-20" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <Users className="w-6 h-6 text-deal-orange mx-auto mb-2" />
                <p className="text-2xl font-black text-white">
                  <AnimatedCounter target={platformStats?.users?.toLocaleString() || '0'} duration={1200} />
                </p>
                <p className="text-[11px] text-white/50 font-medium mt-0.5">
                  {locale === 'ar' ? 'مستخدم' : 'Utilisateurs'}
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <Wrench className="w-6 h-6 text-deal-teal mx-auto mb-2" />
                <p className="text-2xl font-black text-white">
                  <AnimatedCounter target={platformStats?.services?.toLocaleString() || '0'} duration={1200} />
                </p>
                <p className="text-[11px] text-white/50 font-medium mt-0.5">
                  {locale === 'ar' ? 'خدمة' : 'Services'}
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <Package className="w-6 h-6 text-deal-gold mx-auto mb-2" />
                <p className="text-2xl font-black text-white">
                  <AnimatedCounter target={platformStats?.products?.toLocaleString() || '0'} duration={1200} />
                </p>
                <p className="text-[11px] text-white/50 font-medium mt-0.5">
                  {locale === 'ar' ? 'منتج' : 'Produits'}
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <Truck className="w-6 h-6 text-deal-orange-light mx-auto mb-2" />
                <p className="text-2xl font-black text-white">
                  <AnimatedCounter target={platformStats?.equipment?.toLocaleString() || '0'} duration={1200} />
                </p>
                <p className="text-[11px] text-white/50 font-medium mt-0.5">
                  {locale === 'ar' ? 'معدة' : 'Équipements'}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Animated divider with dots */}
        <div className="animated-divider-dots mb-8">
          <div className="divider-dot" style={{ background: '#0D9488' }} />
          <div className="divider-dot" style={{ background: '#F59E0B' }} />
          <div className="divider-dot" style={{ background: '#FF6B35' }} />
          <div className="divider-dot" style={{ background: '#0D9488' }} />
          <div className="divider-dot" style={{ background: '#F59E0B' }} />
          <div className="divider-line" />
          <div className="divider-dot" style={{ background: '#0D9488' }} />
          <div className="divider-dot" style={{ background: '#F59E0B' }} />
          <div className="divider-dot" style={{ background: '#FF6B35' }} />
          <div className="divider-dot" style={{ background: '#0D9488' }} />
          <div className="divider-dot" style={{ background: '#F59E0B' }} />
        </div>

        {/* Trusted By section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-center text-white/30 text-xs font-semibold mb-4 uppercase tracking-wider">
            {locale === 'ar' ? 'موثوق من قبل' : 'Approuvé par'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <div className="trust-badge">
              <Shield className="w-4 h-4 text-deal-teal" />
              <span className="text-xs text-white/60 font-semibold">{locale === 'ar' ? 'حماية البيانات' : 'SSL Sécurisé'}</span>
            </div>
            <div className="trust-badge">
              <Award className="w-4 h-4 text-deal-gold" />
              <span className="text-xs text-white/60 font-semibold">{locale === 'ar' ? 'معتميز الجودة' : 'Qualité Certifiée'}</span>
            </div>
            <div className="trust-badge">
              <Zap className="w-4 h-4 text-deal-orange" />
              <span className="text-xs text-white/60 font-semibold">{locale === 'ar' ? 'أداء عالي' : 'Haute Perf.'}</span>
            </div>
          </div>
        </motion.div>

        {/* Gradient divider before copyright */}
        <div className="gradient-divider mb-8" />

        {/* Team Section — Gold text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <h3 className="text-lg font-bold text-amber-400/90" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {locale === 'ar' ? 'من نحن' : 'Qui sommes-nous'}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span className="text-amber-400 font-semibold text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>قاسمي ضياء الدين</span>
              <span className="text-amber-400 font-semibold text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>بوساحة لطفي</span>
              <span className="text-amber-400 font-semibold text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>برجم أسامة</span>
            </div>
            <p className="text-amber-400/80 text-sm font-medium" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {locale === 'ar' ? 'التخصص: علوم تجارية' : 'Spécialité : Sciences commerciales'}
            </p>
            <p className="text-amber-400/70 text-xs leading-relaxed max-w-xl mx-auto" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {locale === 'ar'
                ? 'منصة مقدمة ضمن متطلبات نيل شهادة الماستر مؤسسة ناشئة/ جامعة سوق أهراس-كلية العلوم الاقتصادية والتجارية وعلوم التسيير'
                : 'Plateforme présentée dans le cadre des exigences de l\'obtention du diplôme de Master Entrepreneurship Émergent / Université de Souk Ahras - Faculté des Sciences Économiques, Commerciales et de Gestion'
              }
            </p>
          </div>
        </motion.div>

        {/* Gradient divider before copyright */}
        <div className="gradient-divider mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} DEAL. {t.footer.rights}
          </p>
          <p className="text-white/30 text-xs flex items-center gap-1.5">
            {locale === 'ar' ? 'صُنع بـ' : 'Fait avec'} <Heart className="w-3 h-3 text-red-400 fill-red-400 animate-pulse" /> {locale === 'ar' ? 'في سوق أهراس' : 'à Souk Ahras'}
          </p>
        </div>
      </div>

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 end-6 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-deal-orange to-deal-orange-dark text-white shadow-lg shadow-deal-orange/30 flex items-center justify-center back-to-top-animated"
            title={t.footer.backToTop}
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
