'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MessageCircle, Star, CheckCircle2, Award, Clock, Briefcase,
  Phone, MapPin, Loader2, Save, User,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import RatingStars from './rating-stars';
import { toast } from 'sonner';

interface ProfileFormData {
  name: string;
  nameFr: string;
  phone: string;
  bio: string;
  bioFr: string;
  specialties: string;
  experience: string;
  hourlyRate: string;
}

export default function ProfileModal() {
  const { t, locale, getLocalizedValue } = useI18n();
  const {
    showProfileModal, setShowProfileModal,
    profileProviderName, profileSpecialty,
    profileRating, profileReviewsCount,
    currentUser, setCurrentUser,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('view');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    nameFr: '',
    phone: '',
    bio: '',
    bioFr: '',
    specialties: '',
    experience: '',
    hourlyRate: '',
  });

  const providerName = getLocalizedValue(profileProviderName.ar, profileProviderName.fr);
  const specialty = getLocalizedValue(profileSpecialty.ar, profileSpecialty.fr);

  const isOwnProfile = currentUser && profileProviderName.ar === currentUser.name;

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

  // Fetch current user profile data for editing
  const fetchProfileData = useCallback(async () => {
    if (!currentUser?.id) return;
    setIsLoadingProfile(true);
    try {
      const res = await fetch(`/api/users/${currentUser.id}`);
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setFormData({
        name: data.name || '',
        nameFr: data.nameFr || '',
        phone: data.phone || '',
        bio: data.bio || '',
        bioFr: data.bioFr || '',
        specialties: data.specialties || '',
        experience: data.experience?.toString() || '',
        hourlyRate: data.hourlyRate?.toString() || '',
      });
    } catch {
      toast.error(t.common.profileError);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [currentUser?.id, t.common.profileError]);

  // Fetch profile data when switching to edit tab
  useEffect(() => {
    if (activeTab === 'edit' && currentUser?.id) {
      fetchProfileData();
    }
  }, [activeTab, currentUser?.id, fetchProfileData]);

  // Reset tab when modal opens/closes
  useEffect(() => {
    if (!showProfileModal) {
      setActiveTab('view');
    }
  }, [showProfileModal]);

  const handleSaveProfile = async () => {
    if (!currentUser?.id) return;
    setIsSaving(true);
    try {
      const body: Record<string, unknown> = {};
      if (formData.name) body.name = formData.name;
      if (formData.nameFr) body.nameFr = formData.nameFr;
      if (formData.phone) body.phone = formData.phone;
      if (formData.bio) body.bio = formData.bio;
      if (formData.bioFr) body.bioFr = formData.bioFr;
      if (formData.specialties) body.specialties = formData.specialties;
      if (formData.experience) body.experience = parseInt(formData.experience);
      if (formData.hourlyRate) body.hourlyRate = parseFloat(formData.hourlyRate);

      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to save profile');
      const updatedUser = await res.json();

      // Update current user in store
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          name: updatedUser.name || currentUser.name,
        });
      }

      toast.success(t.common.profileSaved);
      setActiveTab('view');
    } catch {
      toast.error(t.common.profileError);
    } finally {
      setIsSaving(false);
    }
  };

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
        <div className="relative h-36 bg-gradient-to-br from-deal-orange via-deal-gold to-deal-teal flex items-center justify-center">
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-2 pb-0">
            <TabsList className="w-full bg-gray-100 rounded-lg h-10 p-1">
              <TabsTrigger
                value="view"
                className="flex-1 rounded-md text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-deal-navy data-[state=active]:shadow-sm"
              >
                <User className="w-3.5 h-3.5 me-1.5" />
                {t.common.profileView}
              </TabsTrigger>
              {isOwnProfile && (
                <TabsTrigger
                  value="edit"
                  className="flex-1 rounded-md text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-deal-navy data-[state=active]:shadow-sm"
                >
                  <Star className="w-3.5 h-3.5 me-1.5" />
                  {t.common.profileEdit}
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* View Tab */}
          <TabsContent value="view" className="mt-0">
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
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="mt-0">
            <div className="p-6 space-y-4">
              {isLoadingProfile ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-deal-navy">
                      {locale === 'ar' ? 'الاسم (عربي)' : 'Nom (Arabe)'}
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={locale === 'ar' ? 'الاسم بالعربية' : 'Nom en arabe'}
                      className="rounded-xl border-gray-200 focus-visible:ring-deal-orange/30"
                    />
                  </div>

                  {/* Name French */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-deal-navy">
                      {locale === 'ar' ? 'الاسم (فرنسي)' : 'Nom (Français)'}
                    </Label>
                    <Input
                      value={formData.nameFr}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameFr: e.target.value }))}
                      placeholder={locale === 'ar' ? 'الاسم بالفرنسية' : 'Nom en français'}
                      className="rounded-xl border-gray-200 focus-visible:ring-deal-orange/30"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-deal-navy flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {t.common.phone}
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder={locale === 'ar' ? '0XXX XX XX XX' : '0XXX XX XX XX'}
                      className="rounded-xl border-gray-200 focus-visible:ring-deal-orange/30"
                      dir="ltr"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-deal-navy">
                      {locale === 'ar' ? 'نبذة (عربي)' : 'Bio (Arabe)'}
                    </Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder={t.common.bioPlaceholder}
                      className="rounded-xl border-gray-200 focus-visible:ring-deal-orange/30 resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Bio French */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-deal-navy">
                      {locale === 'ar' ? 'نبذة (فرنسي)' : 'Bio (Français)'}
                    </Label>
                    <Textarea
                      value={formData.bioFr}
                      onChange={(e) => setFormData(prev => ({ ...prev, bioFr: e.target.value }))}
                      placeholder={locale === 'ar' ? 'نبذة عنك بالفرنسية...' : 'À propos de vous...'}
                      className="rounded-xl border-gray-200 focus-visible:ring-deal-orange/30 resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Specialties */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-deal-navy">
                      {t.common.specialties}
                    </Label>
                    <Input
                      value={formData.specialties}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
                      placeholder={t.common.specialtiesPlaceholder}
                      className="rounded-xl border-gray-200 focus-visible:ring-deal-orange/30"
                    />
                  </div>

                  {/* Experience & Hourly Rate */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-deal-navy">
                        {t.common.experienceYears}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="0"
                        className="rounded-xl border-gray-200 focus-visible:ring-deal-orange/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-deal-navy">
                        {t.common.hourlyRate}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                        placeholder="0"
                        className="rounded-xl border-gray-200 focus-visible:ring-deal-orange/30"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="pt-2"
                  >
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="w-full bg-deal-orange hover:bg-deal-orange-dark text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t.common.saving}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {t.common.saveProfile}
                        </>
                      )}
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

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
