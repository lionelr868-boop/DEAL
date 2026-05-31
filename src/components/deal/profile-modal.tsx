'use client';

import { motion } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  MessageCircle, Star, CheckCircle2, Award, Clock, Briefcase,
  Phone, MapPin,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import RatingStars from './rating-stars';
import { toast } from 'sonner';

export default function ProfileModal() {
  const { t, locale, getLocalizedValue } = useI18n();
  const {
    showProfileModal, setShowProfileModal,
    profileProviderName, profileSpecialty,
    profileRating, profileReviewsCount,
  } = useAppStore();

  const providerName = getLocalizedValue(profileProviderName.ar, profileProviderName.fr);
  const specialty = getLocalizedValue(profileSpecialty.ar, profileSpecialty.fr);

  const stats = [
    {
      label: locale === 'ar' ? 'خدمات منجزة' : 'Services terminés',
      value: Math.floor(Math.random() * 50 + 20),
      icon: Briefcase,
      color: 'text-deal-orange',
      bg: 'bg-deal-orange/10',
    },
    {
      label: locale === 'ar' ? 'سنوات الخبرة' : "Années d'expérience",
      value: Math.floor(Math.random() * 10 + 3),
      icon: Clock,
      color: 'text-deal-teal',
      bg: 'bg-deal-teal/10',
    },
  ];

  const handleContact = () => {
    toast.success(
      locale === 'ar'
        ? `تم فتح المحادثة مع ${providerName}`
        : `Conversation ouverte avec ${providerName}`
    );
  };

  if (!showProfileModal) return null;

  return (
    <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Glassmorphism Header */}
        <div className="relative h-44 bg-gradient-to-br from-deal-orange via-deal-gold to-deal-teal flex items-center justify-center">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <motion.div
            className="absolute w-24 h-24 rounded-full bg-white/10 -top-6 -start-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-16 h-16 rounded-full bg-white/10 -bottom-4 -end-4"
            animate={{ scale: [1, 0.9, 1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />

          {/* Avatar */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl border-4 border-white/50">
              <span className="text-3xl font-black bg-gradient-to-r from-deal-orange to-deal-teal bg-clip-text text-transparent">
                {providerName.charAt(0)}
              </span>
            </div>
            {/* Verification badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-sm"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span className="text-[9px] font-bold">{locale === 'ar' ? 'موثق' : 'Vérifié'}</span>
            </motion.div>
          </motion.div>
        </div>

        <div className="p-6 space-y-5">
          {/* Name & Specialty */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-deal-navy">{providerName}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold text-deal-teal bg-deal-teal/10 px-3 py-1 rounded-full">
                {specialty}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-2">
            <RatingStars rating={profileRating} size="md" showCount={false} />
            <span className="text-sm font-bold text-deal-navy">{profileRating}</span>
            <span className="text-xs text-muted-foreground">
              ({profileReviewsCount} {profileReviewsCount === 1 ? t.common.reviewsCount : t.common.reviewsCountPlural})
            </span>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="card-3d rounded-xl p-4 bg-white text-center"
                >
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-xl font-black text-deal-navy">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Info badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {locale === 'ar' ? 'سوق أهراس' : 'Souk Ahras'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
              <Award className="w-3.5 h-3.5 text-deal-gold" />
              <span className="text-xs text-muted-foreground">
                {locale === 'ar' ? 'عضو مميز' : 'Membre premium'}
              </span>
            </div>
          </div>

          {/* Contact Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContact}
            className="w-full btn-3d text-white bg-deal-orange rounded-xl px-8 py-3.5 font-bold text-base flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            {t.common.contact}
          </motion.button>
        </div>

        <DialogHeader className="sr-only">
          <DialogTitle>{providerName}</DialogTitle>
          <DialogDescription>
            {locale === 'ar' ? 'ملف شخصي للمقدم' : 'Profil du prestataire'}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
