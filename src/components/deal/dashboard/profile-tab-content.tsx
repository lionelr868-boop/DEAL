'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { UserCog, Mail, Phone, FileText, Star, Wrench, Package, Loader2, Shield } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import { toast } from 'sonner';

const roleGradientMap: Record<string, string> = {
  customer: 'from-deal-orange via-deal-gold to-deal-orange',
  craftsman: 'from-deal-teal via-deal-teal-dark to-teal-600',
  merchant: 'from-deal-teal via-emerald-500 to-deal-teal',
  equipment_owner: 'from-deal-gold via-deal-gold-dark to-deal-orange',
  admin: 'from-deal-navy via-deal-navy-dark to-deal-navy',
};

const roleLabels: Record<string, { ar: string; fr: string }> = {
  customer: { ar: 'عميل', fr: 'Client' },
  craftsman: { ar: 'حرفي', fr: 'Artisan' },
  merchant: { ar: 'تاجر', fr: 'Commerçant' },
  equipment_owner: { ar: 'مؤجر معدات', fr: 'Loueur' },
  admin: { ar: 'مدير', fr: 'Admin' },
};

const roleBadgeColors: Record<string, string> = {
  customer: 'bg-deal-orange/20 text-deal-orange',
  craftsman: 'bg-deal-teal/20 text-deal-teal',
  merchant: 'bg-emerald-500/20 text-emerald-600',
  equipment_owner: 'bg-deal-gold/20 text-deal-gold-dark',
  admin: 'bg-deal-navy/20 text-deal-navy',
};

interface ProfileData {
  id: string;
  email: string;
  name: string;
  nameFr: string | null;
  phone: string | null;
  bio: string | null;
  bioFr: string | null;
  specialties: string | null;
  experience: number | null;
  hourlyRate: number | null;
  shopName: string | null;
  shopNameFr: string | null;
  hasDelivery: boolean;
  rating: number | null;
  totalReviews: number;
  role: string;
  city: string;
  wilaya: string;
}

interface ProfileTabContentProps {
  role: string;
}

export default function ProfileTabContent({ role }: ProfileTabContentProps) {
  const { t, locale } = useI18n();
  const { currentUser, setCurrentUser } = useAppStore();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formNameFr, setFormNameFr] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formBioFr, setFormBioFr] = useState('');
  const [formSpecialties, setFormSpecialties] = useState('');
  const [formExperience, setFormExperience] = useState('');
  const [formHourlyRate, setFormHourlyRate] = useState('');
  const [formShopName, setFormShopName] = useState('');
  const [formShopNameFr, setFormShopNameFr] = useState('');
  const [formHasDelivery, setFormHasDelivery] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      fetchProfile();
    }
  }, [currentUser?.id]);

  const fetchProfile = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        // Populate form
        setFormName(data.name || '');
        setFormNameFr(data.nameFr || '');
        setFormPhone(data.phone || '');
        setFormBio(data.bio || '');
        setFormBioFr(data.bioFr || '');
        setFormSpecialties(data.specialties || '');
        setFormExperience(data.experience != null ? String(data.experience) : '');
        setFormHourlyRate(data.hourlyRate != null ? String(data.hourlyRate) : '');
        setFormShopName(data.shopName || '');
        setFormShopNameFr(data.shopNameFr || '');
        setFormHasDelivery(data.hasDelivery || false);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser?.id) return;
    setSaving(true);
    try {
      const updatePayload: Record<string, unknown> = {
        name: formName,
        nameFr: formNameFr || null,
        phone: formPhone || null,
        bio: formBio || null,
        bioFr: formBioFr || null,
      };

      if (role === 'craftsman') {
        updatePayload.specialties = formSpecialties || null;
        updatePayload.experience = formExperience ? Number(formExperience) : null;
        updatePayload.hourlyRate = formHourlyRate ? Number(formHourlyRate) : null;
      }

      if (role === 'merchant') {
        updatePayload.shopName = formShopName || null;
        updatePayload.shopNameFr = formShopNameFr || null;
        updatePayload.hasDelivery = formHasDelivery;
      }

      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        toast.success(t.common.profileSaved);
        // Update current user in store
        if (currentUser) {
          setCurrentUser({ ...currentUser, name: updatedUser.name, email: updatedUser.email });
        }
        setProfileData(updatedUser);
      } else {
        toast.error(t.common.profileError);
      }
    } catch {
      toast.error(t.common.profileError);
    } finally {
      setSaving(false);
    }
  };

  const gradient = roleGradientMap[role] || roleGradientMap.customer;
  const roleName = roleLabels[role] || roleLabels.customer;
  const badgeColor = roleBadgeColors[role] || roleBadgeColors.customer;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-deal-orange animate-spin" />
        <span className="ms-3 text-sm text-muted-foreground">{t.common.fetchingData}</span>
      </div>
    );
  }

  const displayName = currentUser?.name || '';
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const displayEmail = currentUser?.email || '';

  return (
    <div className="space-y-6">
      {/* Profile Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${gradient} p-6 sm:p-8 text-white`}
      >
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -start-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
            <span className="text-white font-black text-2xl sm:text-3xl">{avatarInitial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-black truncate">{displayName}</h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeColor} bg-white/20 text-white`}>
                <RoleIcon role={role} />
                <span>{locale === 'ar' ? roleName.ar : roleName.fr}</span>
              </span>
              {profileData?.rating != null && (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                  <Star className="w-3 h-3" />
                  {profileData.rating}/5
                </span>
              )}
              {profileData?.city && (
                <span className="text-xs font-medium text-white/70">
                  {profileData.city}{profileData.wilaya ? `, ${profileData.wilaya}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Account Settings Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-3d rounded-2xl bg-white p-5 sm:p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-deal-orange/10 flex items-center justify-center">
            <UserCog className="w-5 h-5 text-deal-orange" />
          </div>
          <h3 className="text-lg font-bold text-deal-navy">{t.common.accountSettings}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name (Arabic) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground">{t.common.nameAr}</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              dir="rtl"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground"
              placeholder={locale === 'ar' ? 'الاسم بالعربية' : 'Nom en arabe'}
            />
          </div>

          {/* Name (French) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground">{t.common.nameFrProfile}</label>
            <input
              type="text"
              value={formNameFr}
              onChange={(e) => setFormNameFr(e.target.value)}
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground"
              placeholder={locale === 'ar' ? 'الاسم بالفرنسية' : 'Nom en français'}
            />
          </div>

          {/* Email (readonly) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              {t.common.emailAddress}
            </label>
            <input
              type="email"
              value={displayEmail}
              readOnly
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              {t.common.phone}
            </label>
            <input
              type="tel"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground"
              placeholder="0xxx xx xx xx"
            />
          </div>

          {/* Bio (Arabic) */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              {t.common.bioAr}
            </label>
            <textarea
              value={formBio}
              onChange={(e) => setFormBio(e.target.value)}
              dir="rtl"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground resize-none"
              placeholder={t.common.bioPlaceholder}
            />
          </div>

          {/* Bio (French) */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              {t.common.bioFr}
            </label>
            <textarea
              value={formBioFr}
              onChange={(e) => setFormBioFr(e.target.value)}
              dir="ltr"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground resize-none"
              placeholder={t.common.bioPlaceholder}
            />
          </div>

          {/* Craftsman-specific fields */}
          {role === 'craftsman' && (
            <>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Wrench className="w-3 h-3" />
                  {t.common.specialties}
                </label>
                <input
                  type="text"
                  value={formSpecialties}
                  onChange={(e) => setFormSpecialties(e.target.value)}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground"
                  placeholder={t.common.specialtiesPlaceholder}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">{t.common.experienceYears}</label>
                <input
                  type="number"
                  value={formExperience}
                  onChange={(e) => setFormExperience(e.target.value)}
                  min="0"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground"
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">{t.common.hourlyRate}</label>
                <input
                  type="number"
                  value={formHourlyRate}
                  onChange={(e) => setFormHourlyRate(e.target.value)}
                  min="0"
                  dir="ltr"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground"
                  placeholder="0"
                />
              </div>
            </>
          )}

          {/* Merchant-specific fields */}
          {role === 'merchant' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Package className="w-3 h-3" />
                  {t.common.shopNameAr}
                </label>
                <input
                  type="text"
                  value={formShopName}
                  onChange={(e) => setFormShopName(e.target.value)}
                  dir="rtl"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground"
                  placeholder={locale === 'ar' ? 'اسم المتجر بالعربية' : 'Nom de la boutique en arabe'}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Package className="w-3 h-3" />
                  {t.common.shopNameFrProfile}
                </label>
                <input
                  type="text"
                  value={formShopNameFr}
                  onChange={(e) => setFormShopNameFr(e.target.value)}
                  dir="ltr"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground"
                  placeholder={locale === 'ar' ? 'اسم المتجر بالفرنسية' : 'Nom de la boutique en français'}
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <label className="text-sm font-bold text-deal-navy">{t.common.hasDelivery}</label>
                <button
                  type="button"
                  onClick={() => setFormHasDelivery(!formHasDelivery)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${formHasDelivery ? 'bg-deal-teal' : 'bg-gray-300'}`}
                >
                  <motion.span
                    animate={{ x: formHasDelivery ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
                <span className="text-xs text-muted-foreground">
                  {formHasDelivery
                    ? (locale === 'ar' ? 'متاح' : 'Disponible')
                    : (locale === 'ar' ? 'غير متاح' : 'Non disponible')
                  }
                </span>
              </div>
            </>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={saving}
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-deal-orange to-deal-gold text-white text-sm font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserCog className="w-4 h-4" />
            )}
            {saving ? t.common.saving : t.common.saveProfile}
          </motion.button>
        </div>
      </motion.div>

      {/* Password Change Section (Placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-3d rounded-2xl bg-white p-5 sm:p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-deal-navy/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-deal-navy" />
          </div>
          <h3 className="text-lg font-bold text-deal-navy">{t.common.changePassword}</h3>
        </div>
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
          <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{t.common.passwordSectionNote}</p>
        </div>
      </motion.div>
    </div>
  );
}

function RoleIcon({ role }: { role: string }) {
  switch (role) {
    case 'craftsman':
      return <Wrench className="w-3 h-3" />;
    case 'merchant':
      return <Package className="w-3 h-3" />;
    case 'equipment_owner':
      return <Wrench className="w-3 h-3" />;
    case 'admin':
      return <Shield className="w-3 h-3" />;
    default:
      return <UserCog className="w-3 h-3" />;
  }
}
