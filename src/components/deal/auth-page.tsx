'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Mail, Lock, User, Phone, Loader2,
  Camera, Users, Wrench, Store, HardHat, Sparkles, X, MessageCircle,
  ShoppingCart, Settings, BarChart3, Package, Truck, ChevronRight,
  Eye, LogIn,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useI18n, useAppStore } from '@/lib/store';
import { toast } from 'sonner';

const dashboards = [
  {
    key: 'CUSTOMER',
    icon: ShoppingCart,
    color: '#FF6B35',
    gradient: 'from-deal-orange to-deal-orange-dark',
  },
  {
    key: 'CRAFTSMAN',
    icon: Wrench,
    color: '#0D9488',
    gradient: 'from-deal-teal to-deal-teal-dark',
  },
  {
    key: 'MERCHANT',
    icon: Store,
    color: '#F59E0B',
    gradient: 'from-deal-gold to-deal-gold-dark',
  },
  {
    key: 'EQUIPMENT_OWNER',
    icon: Truck,
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-purple-700',
  },
  {
    key: 'ADMIN',
    icon: Settings,
    color: '#EF4444',
    gradient: 'from-red-500 to-red-700',
  },
];

function getDashboardLabel(key: string, locale: string) {
  const lp = locale === 'ar' ? 'loginPage' : 'loginPage';
  const map: Record<string, string> = {
    CUSTOMER: locale === 'ar' ? 'customerDash' : 'customerDashFr',
    CRAFTSMAN: locale === 'ar' ? 'craftsmanDash' : 'craftsmanDashFr',
    MERCHANT: locale === 'ar' ? 'merchantDash' : 'merchantDashFr',
    EQUIPMENT_OWNER: locale === 'ar' ? 'equipOwnerDash' : 'equipOwnerDashFr',
    ADMIN: locale === 'ar' ? 'adminDash' : 'adminDashFr',
  };
  return map[key] || '';
}

function getDashboardIcon(key: string) {
  const map: Record<string, typeof Users> = {
    CUSTOMER: ShoppingCart,
    CRAFTSMAN: Settings,
    MERCHANT: BarChart3,
    EQUIPMENT_OWNER: Package,
  };
  return map[key] || Users;
}

export default function AuthPage() {
  const { locale, t } = useI18n();
  const {
    showAuthPage, setShowAuthPage, authMode, setAuthMode,
    setCurrentUser, setShowDashboard,
  } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedDashPreview, setSelectedDashPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLogin = authMode === 'login';
  const isRTL = locale === 'ar';

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMode = () => {
    setAuthMode(isLogin ? 'register' : 'login');
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', password: '', role: 'CUSTOMER', avatar: '' });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error(t.auth.requiredFields);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(t.auth.invalidCredentials); return; }
      setCurrentUser({ id: data.id, name: data.name, email: data.email, role: data.role });
      toast.success(t.auth.loginSuccess);
      resetForm();
      setShowAuthPage(false);
      setShowDashboard(true);
    } catch { toast.error(t.auth.invalidCredentials); }
    finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.name || !formData.role) {
      toast.error(t.auth.requiredFields);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email, password: formData.password, name: formData.name,
          phone: formData.phone, role: formData.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) toast.error(t.auth.emailExists);
        else toast.error(data.error || t.auth.requiredFields);
        return;
      }
      setCurrentUser({ id: data.id, name: data.name, email: data.email, role: data.role });
      toast.success(t.auth.registerSuccess);
      resetForm();
      setShowAuthPage(false);
      setShowDashboard(true);
    } catch { toast.error(t.auth.requiredFields); }
    finally { setLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) handleLogin();
    else handleRegister();
  };

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) handleChange('avatar', reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Demo accounts for each role
  const demoAccounts: Record<string, { email: string; password: string; name: string }> = {
    CUSTOMER: { email: 'customer1@deal.dz', password: 'pass123', name: 'أحمد بن علي' },
    CRAFTSMAN: { email: 'craftsman1@deal.dz', password: 'pass123', name: 'محمد الكهربائي' },
    MERCHANT: { email: 'merchant1@deal.dz', password: 'pass123', name: 'سعيد للمواد' },
    EQUIPMENT_OWNER: { email: 'equip1@deal.dz', password: 'pass123', name: 'رابح للمعدات' },
    ADMIN: { email: 'admin@deal.dz', password: 'admin123', name: 'مدير المنصة' },
  };

  const handleDashPreviewClick = async (role: string) => {
    // For register mode: pre-select role
    if (!isLogin) {
      handleChange('role', role);
      setSelectedDashPreview(role);
      setTimeout(() => setSelectedDashPreview(null), 2000);
      return;
    }
    // For login mode: quick demo login with that role's demo account
    const demo = demoAccounts[role];
    if (!demo) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demo.email, password: demo.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser({ id: data.id, name: data.name, email: data.email, role: data.role });
        toast.success(`${t.loginPage.tryDashboard || ''} ✓`);
        resetForm();
        setShowAuthPage(false);
        setShowDashboard(true);
      } else {
        toast.error(t.auth.invalidCredentials);
      }
    } catch {
      toast.error(t.auth.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'CUSTOMER', label: t.auth.customer, icon: Users, gradient: 'from-deal-orange/10 to-deal-orange/5', activeGradient: 'from-deal-orange to-deal-orange-dark' },
    { value: 'CRAFTSMAN', label: t.auth.craftsman, icon: Wrench, gradient: 'from-deal-teal/10 to-deal-teal/5', activeGradient: 'from-deal-teal to-deal-teal-dark' },
    { value: 'MERCHANT', label: t.auth.merchant, icon: Store, gradient: 'from-deal-gold/10 to-deal-gold/5', activeGradient: 'from-deal-gold to-deal-gold-dark' },
    { value: 'EQUIPMENT_OWNER', label: t.auth.equipmentOwner, icon: HardHat, gradient: 'from-purple-100 to-purple-50', activeGradient: 'from-purple-600 to-purple-700' },
  ];

  const welcomeText = locale === 'ar' ? t.loginPage.welcome : t.loginPage.welcomeFr;
  const subtitleText = locale === 'ar' ? t.loginPage.subtitle : t.loginPage.subtitleFr;
  const exploreText = isLogin
    ? (locale === 'ar' ? 'جرب لوحة التحكم بدخول تجريبي' : 'Essayez avec un accès démo')
    : (locale === 'ar' ? t.loginPage.exploreDashboards : t.loginPage.exploreDashboardsFr);
  const backText = locale === 'ar' ? t.loginPage.backToHome : t.loginPage.backToHomeFr;
  const uploadText = locale === 'ar' ? t.loginPage.uploadAvatar : t.loginPage.uploadAvatarFr;

  return (
    <AnimatePresence>
      {showAuthPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex"
        >
          {/* Backdrop blur */}
          <motion.div
            className="absolute inset-0 bg-deal-navy-dark/90 backdrop-blur-xl"
            onClick={() => { setShowAuthPage(false); }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Main content */}
          <motion.div
            className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row min-h-screen"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* LEFT: Branding Side */}
            <div className="relative flex-1 flex flex-col justify-center items-center p-8 lg:p-12 overflow-hidden">
              {/* Background patterns */}
              <div className="absolute inset-0 auth-page-pattern" />
              <div className="absolute inset-0">
                <svg className="absolute w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="authGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                      <circle cx="30" cy="30" r="1" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#authGrid)" />
                </svg>
              </div>

              {/* Floating shapes */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[15%] start-[10%] w-20 h-20 rounded-2xl border border-white/10 bg-white/[0.03]"
              />
              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-[20%] end-[15%] w-16 h-16 rounded-full border border-white/10 bg-white/[0.03]"
              />
              <motion.div
                animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[60%] start-[60%] w-12 h-12 rounded-lg border border-white/[0.07] bg-white/[0.02]"
              />

              {/* Content */}
              <div className="relative z-10 text-center max-w-md">
                {/* Logo */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-deal-orange/30 overflow-hidden">
                    <img
                      src="/logo.png"
                      alt="DEAL"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-3xl lg:text-4xl font-black text-white mb-3"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {welcomeText}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-base text-white/60 mb-8"
                >
                  {subtitleText}
                </motion.p>

                {/* Dashboard preview cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="space-y-3"
                >
                  <p className="text-sm font-bold text-white/40 mb-4 uppercase tracking-wider">{exploreText}</p>
                  {dashboards.map((dash, i) => {
                    const DashIcon = getDashboardIcon(dash.key);
                    const demo = demoAccounts[dash.key];
                    return (
                      <motion.button
                        key={dash.key}
                        initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        onClick={() => handleDashPreviewClick(dash.key)}
                        disabled={loading}
                        className={`w-full auth-dash-preview group transition-all duration-300 ${selectedDashPreview === dash.key ? 'ring-1 ring-white/30 bg-white/20 scale-[1.02]' : ''} ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/15'}`}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                          style={{ background: `linear-gradient(135deg, ${dash.color}, ${dash.color}99)` }}
                        >
                          {isLogin ? (
                            <LogIn className="w-4 h-4 text-white" />
                          ) : (
                            <DashIcon className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="text-start flex-1">
                          <p className="text-xs font-bold">{getDashboardLabel(dash.key, locale)}</p>
                          {isLogin && (
                            <p className="text-[10px] text-white/30 mt-0.5">{demo?.email}</p>
                          )}
                        </div>
                        {isLogin && (
                          <Eye className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                        )}
                        {!isLogin && (
                          <ChevronRight className={`w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors ms-auto ${isRTL ? 'rotate-180' : ''}`} />
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            </div>

            {/* RIGHT: Form Side */}
            <div className="relative flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-12 bg-white">
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAuthPage(false)}
                className="absolute top-4 end-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors shadow-sm z-20"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Back to home */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => setShowAuthPage(false)}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-deal-orange transition-colors mb-6"
              >
                {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {backText}
              </motion.button>

              {/* Mode toggle */}
              <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm mb-6">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all duration-300 ${
                    isLogin ? 'bg-deal-orange text-white shadow-md' : 'text-muted-foreground hover:text-deal-orange'
                  }`}
                >
                  {t.auth.loginTitle}
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all duration-300 ${
                    !isLogin ? 'bg-deal-orange text-white shadow-md' : 'text-muted-foreground hover:text-deal-orange'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.auth.registerTitle}
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.form
                  key={authMode}
                  initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pe-1"
                  onSubmit={handleSubmit}
                >
                  {/* Register fields */}
                  {!isLogin && (
                    <>
                      {/* Avatar upload */}
                      <div className="flex justify-center">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="relative group"
                        >
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed transition-all duration-300 ${
                            formData.avatar
                              ? 'border-deal-orange bg-deal-orange/5'
                              : 'border-gray-300 bg-gray-50 group-hover:border-deal-orange/50 group-hover:bg-deal-orange/5'
                          }`}>
                            {formData.avatar ? (
                              <img
                                src={formData.avatar}
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <Camera className="w-7 h-7 text-gray-400 group-hover:text-deal-orange transition-colors" />
                            )}
                          </div>
                          <div className="absolute -bottom-1 -end-1 w-6 h-6 rounded-full bg-deal-orange text-white flex items-center justify-center shadow-lg">
                            <Camera className="w-3 h-3" />
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </motion.button>
                      </div>
                      <p className="text-center text-xs text-muted-foreground -mt-2 mb-4">{uploadText}</p>

                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-deal-navy">{t.auth.name}</label>
                        <div className="relative">
                          <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder={t.auth.name}
                            className="ps-10 h-11 rounded-xl border-gray-200 focus:border-deal-orange focus:ring-deal-orange/20 transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-deal-navy">{t.auth.phone}</label>
                        <div className="relative">
                          <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder={t.auth.phone}
                            className="ps-10 h-11 rounded-xl border-gray-200 focus:border-deal-orange focus:ring-deal-orange/20 transition-all duration-200"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      {/* Role selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-deal-navy">{t.auth.role}</label>
                        <div className="grid grid-cols-2 gap-2">
                          {roles.map((role) => (
                            <motion.button
                              key={role.value}
                              type="button"
                              whileHover={{ scale: 1.03, y: -1 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleChange('role', role.value)}
                              className={`relative flex items-center gap-2 px-3 py-3 rounded-xl text-xs font-bold transition-all duration-300 overflow-hidden ${
                                formData.role === role.value
                                  ? `bg-gradient-to-br ${role.activeGradient} text-white shadow-lg`
                                  : `bg-gradient-to-br ${role.gradient} text-deal-navy border-2 border-gray-200 hover:border-deal-orange/50`
                              }`}
                            >
                              <role.icon className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{role.label}</span>
                              {formData.role === role.value && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                                />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-deal-navy">{t.auth.email}</label>
                    <div className="relative">
                      <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder={t.auth.email}
                        className="ps-10 h-11 rounded-xl border-gray-200 focus:border-deal-orange focus:ring-deal-orange/20 transition-all duration-200"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-deal-navy">{t.auth.password}</label>
                    <div className="relative">
                      <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        placeholder={t.auth.password}
                        className="ps-10 h-11 rounded-xl border-gray-200 focus:border-deal-orange focus:ring-deal-orange/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Forgot password (login only) */}
                  {isLogin && (
                    <button type="button" className="text-xs text-deal-orange hover:underline transition-colors">
                      {t.auth.forgotPassword}
                    </button>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={`w-full btn-neon rounded-xl py-3 font-bold text-base disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 ${
                      loading ? 'opacity-60' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.common.loading}
                      </>
                    ) : (
                      isLogin ? t.auth.login : t.auth.register
                    )}
                  </motion.button>

                  {/* Toggle mode */}
                  <p className="text-center text-sm text-muted-foreground">
                    {isLogin ? t.auth.noAccount : t.auth.hasAccount}{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-deal-orange font-bold hover:underline transition-colors"
                    >
                      {isLogin ? t.auth.orRegister : t.auth.orLogin}
                    </button>
                  </p>
                </motion.form>
              </AnimatePresence>
            </div>

            {/* Mobile: decorative bottom bar */}
            <div className="absolute bottom-0 inset-x-0 h-1 gradient-animated lg:hidden" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
