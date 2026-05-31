'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';

export default function AuthModal() {
  const { t, locale } = useI18n();
  const { showAuthModal, setShowAuthModal, authMode, setAuthMode } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER',
  });

  const isLogin = authMode === 'login';
  const isRTL = locale === 'ar';

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMode = () => {
    setAuthMode(isLogin ? 'register' : 'login');
  };

  const roles = [
    { value: 'CUSTOMER', label: t.auth.customer },
    { value: 'CRAFTSMAN', label: t.auth.craftsman },
    { value: 'MERCHANT', label: t.auth.merchant },
    { value: 'EQUIPMENT_OWNER', label: t.auth.equipmentOwner },
  ];

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Decorative gradient top bar */}
        <div className="h-2 gradient-animated" />

        <div className="p-6 space-y-5">
          {/* Mode toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
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
              onSubmit={(e) => e.preventDefault()}
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
                        className="ps-10 h-11 rounded-xl border-gray-200 focus:border-deal-orange focus:ring-deal-orange/20"
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
                        className="ps-10 h-11 rounded-xl border-gray-200 focus:border-deal-orange focus:ring-deal-orange/20"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Role selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-deal-navy">{t.auth.role}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {roles.map((role) => (
                        <motion.button
                          key={role.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleChange('role', role.value)}
                          className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                            formData.role === role.value
                              ? 'bg-deal-orange text-white shadow-md shadow-deal-orange/30 border-deal-orange'
                              : 'bg-white text-deal-navy border-gray-200 hover:border-deal-orange/50'
                          } border-2`}
                        >
                          {role.label}
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
                    className="ps-10 h-11 rounded-xl border-gray-200 focus:border-deal-orange focus:ring-deal-orange/20"
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
                    className="ps-10 h-11 rounded-xl border-gray-200 focus:border-deal-orange focus:ring-deal-orange/20"
                  />
                </div>
              </div>

              {/* Forgot password (login only) */}
              {isLogin && (
                <button type="button" className="text-xs text-deal-orange hover:underline">
                  {t.auth.forgotPassword}
                </button>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-3d text-white bg-deal-orange rounded-xl py-3 font-bold text-base"
              >
                {isLogin ? t.auth.login : t.auth.register}
              </motion.button>

              {/* Toggle mode link */}
              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? t.auth.noAccount : t.auth.hasAccount}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-deal-orange font-bold hover:underline"
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
