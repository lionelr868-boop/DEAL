'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2, Send, X } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function ComplaintModal() {
  const { t, locale } = useI18n();
  const { showComplaintModal, setShowComplaintModal, currentUser, selectedItemId, detailType } = useAppStore();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) {
      toast.error(t.auth.requiredFields);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          targetId: selectedItemId,
          targetType: detailType,
          subject,
          subjectFr: locale === 'ar' ? '' : subject,
          description,
          descriptionFr: locale === 'ar' ? '' : description,
        }),
      });

      if (!res.ok) throw new Error('Failed');

      toast.success(locale === 'ar' ? 'تم إرسال الشكوى بنجاح' : 'Réclamation envoyée avec succès');
      setSubject('');
      setDescription('');
      setShowComplaintModal(false);
    } catch {
      toast.error('Error submitting complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showComplaintModal} onOpenChange={setShowComplaintModal}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Red gradient top bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />

        <div className="relative p-6 space-y-5">
          {/* Header with icon */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-deal-navy">
                  {locale === 'ar' ? 'تقديم شكوى' : 'Soumettre une réclamation'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {locale === 'ar' ? 'سنساعدك في حل المشكلة' : 'Nous vous aiderons à résoudre le problème'}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-deal-navy">
                {locale === 'ar' ? 'موضوع الشكوى' : 'Sujet'}
              </Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={locale === 'ar' ? 'وصف المشكلة باختصار...' : 'Décrivez brièvement le problème...'}
                className="h-11 rounded-xl border-gray-200 focus:border-red-400 focus:ring-red-400/20 transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-deal-navy">
                {locale === 'ar' ? 'وصف تفصيلي' : 'Description détaillée'}
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={locale === 'ar' ? 'اشرح المشكلة بالتفصيل...' : 'Expliquez le problème en détail...'}
                rows={4}
                className="rounded-xl border-gray-200 focus:border-red-400 focus:ring-red-400/20 transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.common.loading}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {locale === 'ar' ? 'إرسال الشكوى' : 'Envoyer'}
                </>
              )}
            </motion.button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
