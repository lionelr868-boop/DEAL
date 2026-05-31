'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Phone, Loader2, Users, Wrench, Store, HardHat, Sparkles } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function AuthModal() {
  const { t, locale } = useI18n();
  const {
    showAuthModal, setShowAuthModal, authMode, setAuthMode,
    setCurrentUser, setShowDashboard,
  } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [loading, setLoading] = useState(false);

  const isLogin = authMode === 'login';
  const isRTL = locale === 'ar';

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMode = () => {
    setAuthMode(isLogin ? 'register' : 'login');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'CUSTOMER',
    });
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

      if (!res.ok) {
        toast.error(t.auth.invalidCredentials);
        return;
      }

      setCurrentUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });

      toast.success(t.auth.loginSuccess);
      resetForm();
      setShowAuthModal(false);
      setShowDashboard(true);
    } catch {
      toast.error(t.auth.invalidCredentials);
    } finally {
      setLoading(false);
    }
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
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          toast.error(t.auth.emailExists);
        } else {
          toast.error(data.error || t.auth.requiredFields);
        }
        return;
      }

      setCurrentUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });

      toast.success(t.auth.registerSuccess);
      resetForm();
      setShowAuthModal(false);
      setShowDashboard(true);
    } catch {
      toast.error(t.auth.requiredFields);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const roles = [
    { value: 'CUSTOMER', label: t.auth.customer, icon: Users, gradient: 'from-deal-orange/10 to-deal-orange/5', activeGradient: 'from-deal-orange to-deal-orange-dark' },
    { value: 'CRAFTSMAN', label: t.auth.craftsman, icon: Wrench, gradient: 'from-deal-teal/10 to-deal-teal/5', activeGradient: 'from-deal-teal to-deal-teal-dark' },
    { value: 'MERCHANT', label: t.auth.merchant, icon: Store, gradient: 'from-deal-gold/10 to-deal-gold/5', activeGradient: 'from-deal-gold to-deal-gold-dark' },
    { value: 'EQUIPMENT_OWNER', label: t.auth.equipmentOwner, icon: HardHat, gradient: 'from-purple-100 to-purple-50', activeGradient: 'from-purple-600 to-purple-700' },
  ];

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Decorative gradient top bar */}
        <div className="h-2 gradient-animated" />

        {/* Decorative background pattern */}
        <div className="auth-pattern" />

        <div className="relative p-6 space-y-5">
          {/* Mode toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all duration-300 ${
                isLogin
                  ? 'bg-deal-orange text-white shadow-md'
                  : 'text-muted-foreground hover:text-deal-orange'
              }`}
            >
              {t.auth.loginTitle}
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all duration-300 ${
                !isLogin
                  ? 'bg-deal-orange text-white shadow-md'
                  : 'text-muted-foreground hover:text-deal-orange'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t.auth.registerTitle}
            </button>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>{isLogin ? t.auth.loginTitle : t.auth.registerTitle}</DialogTitle>
            <DialogDescription>
              {isLogin ? t.auth.orRegister : t.auth.orLogin}
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            <motion.form
              key={authMode}
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              {/* Register fields */}
              {!isLogin && (
                <>
                  {/* Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-deal-navy">{t.auth.name}</Label>
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
                    <Label className="text-sm font-semibold text-deal-navy">{t.auth.phone}</Label>
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

                  {/* Role selection - enhanced with icons and gradients */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-deal-navy">{t.auth.role}</Label>
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
                          {/* Subtle shine on active */}
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
                <Label className="text-sm font-semibold text-deal-navy">{t.auth.email}</Label>
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
                <Label className="text-sm font-semibold text-deal-navy">{t.auth.password}</Label>
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

              {/* Submit button - enhanced with shimmer on loading */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full relative overflow-hidden rounded-xl py-3 font-bold text-base disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 ${
                  loading
                    ? 'btn-3d btn-shimmer text-deal-navy/80'
                    : 'btn-3d text-white bg-deal-orange'
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

              {/* Toggle mode link */}
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
      </DialogContent>
    </Dialog>
  );
}
