'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';
import { useI18n } from '@/lib/store';

export default function Footer() {
  const { t } = useI18n();

  const quickLinks = [
    { label: t.nav.services, href: '#services' },
    { label: t.nav.products, href: '#products' },
    { label: t.nav.equipment, href: '#equipment' },
    { label: t.footer.help, href: '#' },
    { label: t.footer.privacy, href: '#' },
    { label: t.footer.terms, href: '#' },
  ];

  return (
    <footer className="relative bg-deal-navy text-white mt-auto">
      {/* Top gradient line */}
      <div className="h-1 gradient-animated" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10"
        >
          {/* About section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deal-orange to-deal-gold flex items-center justify-center">
                <span className="text-white font-black text-lg">D</span>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-deal-orange to-deal-gold bg-clip-text text-transparent">
                DEAL
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {t.footer.aboutText}
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-deal-orange text-sm transition-colors"
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
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-deal-orange flex-shrink-0" />
                <span>سوق أهراس، الجزائر</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-deal-teal flex-shrink-0" />
                <span dir="ltr">+213 77 000 00 00</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-deal-gold flex-shrink-0" />
                <span>contact@deal.dz</span>
              </div>
            </div>

            {/* Social icons placeholder */}
            <div className="flex gap-2 pt-2">
              {['fb', 'tw', 'ig', 'yt'].map((social) => (
                <div
                  key={social}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-deal-orange/20 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-white/60">{social.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} DEAL. {t.footer.rights}
          </p>
          <p className="text-white/30 text-xs flex items-center gap-1">
            صُنع بـ <Heart className="w-3 h-3 text-red-400 fill-red-400" /> في سوق أهراس
          </p>
        </div>
      </div>
    </footer>
  );
}
