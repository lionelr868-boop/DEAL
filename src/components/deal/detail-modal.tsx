'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  User, Store, PackageCheck, CheckCircle2, XCircle, Clock,
  Wrench, Zap, Droplets, HardHat, Hammer, Wind, PaintBucket, Home,
  Heart, Share2, MessageCircle, Star, ChevronLeft, ChevronRight, ImageIcon,
  Loader2, CalendarDays, Send, PenLine, ShoppingBag,
} from 'lucide-react';
import { useI18n, useAppStore, useFavoritesStore } from '@/lib/store';
import { services, products, equipmentList } from '@/lib/data/mock';
import RatingStars from './rating-stars';
import { toast } from 'sonner';

const categoryIconMap: Record<string, React.ElementType> = {
  elec: Zap,
  plumb: Droplets,
  build: HardHat,
  carp: Hammer,
  hvac: Wind,
  metal: Wrench,
  paint: PaintBucket,
  clean: Home,
};

const serviceGradients = [
  'from-deal-orange to-amber-500',
  'from-deal-orange to-red-500',
  'from-amber-500 to-deal-orange',
  'from-red-500 to-deal-orange',
];

const productGradients = [
  'from-deal-teal to-emerald-500',
  'from-emerald-500 to-deal-teal',
  'from-deal-teal to-teal-600',
  'from-teal-600 to-deal-teal',
];

const equipmentGradients = [
  'from-deal-gold to-amber-600',
  'from-amber-500 to-deal-gold',
  'from-deal-gold to-yellow-500',
  'from-yellow-600 to-deal-gold',
];

const unitLabels: Record<string, Record<string, string>> = {
  bag: { ar: 'كيس', fr: 'sac' },
  m3: { ar: 'م³', fr: 'm³' },
  bar: { ar: 'قضيب', fr: 'barre' },
  piece: { ar: 'قطعة', fr: 'pièce' },
  roll: { ar: 'لفة', fr: 'rouleau' },
  sheet: { ar: 'لوح', fr: 'panneau' },
  bucket: { ar: 'دلو', fr: 'seau' },
  set: { ar: 'طقم', fr: 'jeu' },
};

const staticReviews = [
  {
    name: { ar: 'محمد بلقاسم', fr: 'Mohamed Belkacem' },
    rating: 5,
    text: { ar: 'خدمة ممتازة وسعر معقول جداً، أنصح بها بشدة!', fr: 'Excellent service et très bon prix, je recommande vivement !' },
    date: '2025-01-10',
  },
  {
    name: { ar: 'فاطمة الزهراء', fr: 'Fatima Zahra' },
    rating: 4,
    text: { ar: 'جودة العمل جيدة والتسليم في الوقت المحدد.', fr: 'Bonne qualité de travail et livraison à temps.' },
    date: '2025-01-08',
  },
  {
    name: { ar: 'يوسف بن عمر', fr: 'Youcef Ben Omar' },
    rating: 5,
    text: { ar: 'محترف جداً ومرتب في عمله، سأطلب منه مرة أخرى.', fr: 'Très professionnel et organisé, je ferai appel à lui à nouveau.' },
    date: '2025-01-05',
  },
];

const galleryPlaceholders = [
  'from-deal-orange/80 to-amber-400/80',
  'from-amber-600/80 to-deal-orange/80',
  'from-deal-orange/60 to-red-400/60',
  'from-red-500/80 to-deal-orange/80',
];

const productGalleryPlaceholders = [
  'from-deal-teal/80 to-emerald-400/80',
  'from-emerald-600/80 to-deal-teal/80',
  'from-deal-teal/60 to-teal-400/60',
  'from-teal-500/80 to-deal-teal/80',
];

const equipmentGalleryPlaceholders = [
  'from-deal-gold/80 to-amber-400/80',
  'from-amber-600/80 to-deal-gold/80',
  'from-deal-gold/60 to-yellow-400/60',
  'from-yellow-500/80 to-deal-gold/80',
];

type PriceTab = 'daily' | 'weekly' | 'monthly';

export default function DetailModal() {
  const { t, locale, getLocalizedValue } = useI18n();
  const {
    showDetailModal, setShowDetailModal, detailType, selectedItemId,
    setDetailType, setSelectedItemId, setShowProfileModal, currentUser,
    setProfileProviderName, setProfileSpecialty, setProfileRating, setProfileReviewsCount,
  } = useAppStore();
  const { toggleFavorite, isFavorite, addNotification } = useFavoritesStore();

  const [priceTab, setPriceTab] = useState<PriceTab>('daily');
  const [activeImage, setActiveImage] = useState(0);

  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTimePref, setBookingTimePref] = useState('morning');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userReviews, setUserReviews] = useState<Array<{ name: string; rating: number; text: string; date: string }>>([]);

  // Order form state
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderDeliveryAddress, setOrderDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  // Find the item based on type and ID
  const service = detailType === 'service' ? services.find(s => s.id === selectedItemId) : null;
  const product = detailType === 'product' ? products.find(p => p.id === selectedItemId) : null;
  const equipment = detailType === 'equipment' ? equipmentList.find(e => e.id === selectedItemId) : null;

  const item = service || product || equipment;
  if (!item || !detailType) return null;

  const itemId = item.id;
  const favorited = isFavorite(itemId);

  const gradient = detailType === 'service'
    ? serviceGradients[parseInt(itemId.replace(/\D/g, '') || '0', 10) % serviceGradients.length]
    : detailType === 'product'
      ? productGradients[parseInt(itemId.replace(/\D/g, '') || '0', 10) % productGradients.length]
      : equipmentGradients[parseInt(itemId.replace(/\D/g, '') || '0', 10) % equipmentGradients.length];

  const galleryGradients = detailType === 'service'
    ? galleryPlaceholders
    : detailType === 'product'
      ? productGalleryPlaceholders
      : equipmentGalleryPlaceholders;

  const title = getLocalizedValue(item.title, item.titleFr);
  const description = getLocalizedValue(item.description, item.descriptionFr);
  const rating = 'rating' in item ? item.rating : 0;
  const totalReviews = 'totalReviews' in item ? item.totalReviews : 0;

  // Similar items
  const similarItems = detailType === 'service'
    ? services.filter(s => s.id !== itemId).slice(0, 3)
    : detailType === 'product'
      ? products.filter(p => p.id !== itemId).slice(0, 3)
      : equipmentList.filter(e => e.id !== itemId).slice(0, 3);

  const handleToggleFavorite = () => {
    toggleFavorite(itemId);
    if (!favorited) {
      toast.success(t.common.addedToFavorites);
    } else {
      toast.success(t.common.removedFromFavorites);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    toast.success(locale === 'ar' ? 'تم نسخ الرابط!' : 'Lien copié !');
  };

  const handleContact = (_name: { ar: string; fr: string }) => {
    setShowContactForm(true);
    setShowBookingForm(false);
    setShowReviewForm(false);
    setShowOrderForm(false);
  };

  const handleOrder = (_itemName: string) => {
    if (!currentUser) {
      toast.error(t.common.loginRequired);
      return;
    }
    setShowOrderForm(true);
    setShowBookingForm(false);
    setShowContactForm(false);
    setShowReviewForm(false);
  };

  const handleBooking = (_itemName: string) => {
    if (!currentUser) {
      toast.error(t.common.loginRequired);
      return;
    }
    setShowBookingForm(true);
    setShowContactForm(false);
    setShowReviewForm(false);
  };

  const submitBooking = async () => {
    if (!bookingDate || !currentUser) return;
    setBookingLoading(true);
    try {
      const price = service?.price || product?.price || equipment?.dailyPrice || 0;
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: currentUser.id,
          providerId: currentUser.id,
          type: detailType === 'equipment' ? 'EQUIPMENT' : 'SERVICE',
          serviceId: service?.id || null,
          equipmentId: equipment?.id || null,
          startDate: bookingDate,
          totalPrice: price,
          description: bookingTimePref,
          notes: bookingNotes,
        }),
      });
      if (res.ok) {
        addNotification({
          message: { ar: `تم تأكيد طلب: ${title}`, fr: `Demande confirmée: ${title}` },
          type: 'booking',
        });
        toast.success(detailType === 'product' ? t.common.orderSuccess : t.common.bookingSuccess);
        setShowBookingForm(false);
        setBookingDate('');
        setBookingNotes('');
        setBookingTimePref('morning');
      } else {
        toast.error(t.common.bookingError);
      }
    } catch {
      toast.error(t.common.bookingError);
    } finally {
      setBookingLoading(false);
    }
  };

  const submitReview = async () => {
    if (reviewRating === 0 || !currentUser) {
      if (!currentUser) toast.error(t.common.loginRequired);
      return;
    }
    setReviewLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: currentUser.id,
          targetId: currentUser.id,
          targetType: detailType === 'service' ? 'SERVICE' : detailType === 'product' ? 'PRODUCT' : 'EQUIPMENT',
          rating: reviewRating,
          comment: reviewComment,
          commentFr: reviewComment,
        }),
      });
      if (res.ok) {
        setUserReviews(prev => [{ name: currentUser.name, rating: reviewRating, text: reviewComment, date: new Date().toISOString().split('T')[0] }, ...prev]);
        toast.success(t.common.reviewSuccess);
        setShowReviewForm(false);
        setReviewRating(0);
        setReviewComment('');
      } else {
        toast.error(t.common.reviewError);
      }
    } catch {
      toast.error(t.common.reviewError);
    } finally {
      setReviewLoading(false);
    }
  };

  const submitOrder = async () => {
    if (!currentUser || !product) return;
    setOrderLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: currentUser.id,
          merchantId: currentUser.id,
          productId: product.id,
          quantity: orderQuantity,
          deliveryAddress: orderDeliveryAddress,
          notes: orderNotes,
        }),
      });
      if (res.ok) {
        addNotification({
          message: { ar: `تم تقديم طلب: ${title}`, fr: `Commande passée: ${title}` },
          type: 'booking',
        });
        toast.success(t.common.orderSuccess);
        setShowOrderForm(false);
        setOrderQuantity(1);
        setOrderDeliveryAddress('');
        setOrderNotes('');
      } else {
        toast.error(t.common.bookingError);
      }
    } catch {
      toast.error(t.common.bookingError);
    } finally {
      setOrderLoading(false);
    }
  };

  const submitContact = async () => {
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName, email: contactEmail, phone: contactPhone,
          message: contactMessage,
          recipientType: detailType === 'service' ? 'craftsman' : detailType === 'product' ? 'merchant' : 'equipment_owner',
          recipientId: currentUser?.id || 'unknown',
        }),
      });
      if (res.ok) {
        toast.success(t.common.sendContactSuccess);
        setShowContactForm(false);
        setContactName(''); setContactEmail(''); setContactPhone(''); setContactMessage('');
      } else {
        toast.error(t.common.sendContactError);
      }
    } catch {
      toast.error(t.common.sendContactError);
    } finally {
      setContactLoading(false);
    }
  };

  // Shared sub-components
  const StarSelector = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button key={star} type="button" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
          onClick={() => onChange(star === value ? 0 : star)} className="focus:outline-none">
          <Star className={`w-6 h-6 transition-colors ${star <= value ? 'fill-deal-gold text-deal-gold' : 'text-gray-300'}`} />
        </motion.button>
      ))}
    </div>
  );

  const BookingFormSection = () => (
    <AnimatePresence>
      {showBookingForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <div className="p-4 rounded-xl bg-deal-orange/5 border border-deal-orange/20 space-y-3">
            <h5 className="text-sm font-bold text-deal-navy flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-deal-orange" />{t.common.bookingForm}
            </h5>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t.common.selectDate}</label>
              <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t.common.selectTime}</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                {(['morning', 'afternoon', 'evening'] as const).map((tp) => (
                  <button key={tp} type="button" onClick={() => setBookingTimePref(tp)}
                    className={`flex-1 py-2 text-xs font-bold transition-all ${bookingTimePref === tp ? 'bg-deal-orange text-white' : 'bg-white text-muted-foreground hover:bg-gray-50'}`}>
                    {t.common[tp]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t.common.bookingNotes}</label>
              <textarea value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)}
                placeholder={t.common.bookingNotesPlaceholder} rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange" />
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                disabled={!bookingDate || bookingLoading} onClick={submitBooking}
                className="flex-1 btn-3d-sm text-white bg-deal-orange rounded-xl px-4 py-2.5 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                {bookingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarDays className="w-4 h-4" />}
                {t.common.submitBooking}
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowBookingForm(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-muted-foreground hover:bg-gray-50">
                {t.common.cancel}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ReviewFormSection = () => (
    <AnimatePresence>
      {showReviewForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <div className="p-4 rounded-xl bg-deal-gold/5 border border-deal-gold/20 space-y-3">
            <h5 className="text-sm font-bold text-deal-navy flex items-center gap-2">
              <PenLine className="w-4 h-4 text-deal-gold" />{t.common.reviewForm}
            </h5>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t.common.yourRating}</label>
              <StarSelector value={reviewRating} onChange={setReviewRating} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t.common.yourComment}</label>
              <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                placeholder={t.common.commentPlaceholder} rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-deal-gold/30 focus:border-deal-gold" />
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                disabled={reviewRating === 0 || reviewLoading} onClick={submitReview}
                className="flex-1 btn-3d-sm rounded-xl px-4 py-2.5 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: 'linear-gradient(180deg, #FBBF24 0%, #F59E0B 100%)', boxShadow: '0 4px 0 0 #D97706, 0 6px 8px rgba(245,158,11,0.25)', color: '#1E293B' }}>
                {reviewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {t.common.submitReview}
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-muted-foreground hover:bg-gray-50">
                {t.common.cancel}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const OrderFormSection = () => (
    <AnimatePresence>
      {showOrderForm && product && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <div className="p-4 rounded-xl bg-deal-teal/5 border border-deal-teal/20 space-y-3">
            <h5 className="text-sm font-bold text-deal-navy flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-deal-teal" />{locale === 'ar' ? 'نموذج الطلب' : "Formulaire de commande"}
            </h5>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">{locale === 'ar' ? 'الكمية' : 'Quantité'}</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-deal-navy">
                  -
                </button>
                <span className="text-lg font-black text-deal-navy min-w-[2ch] text-center">{orderQuantity}</span>
                <button type="button" onClick={() => setOrderQuantity(Math.min(100, orderQuantity + 1))}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-deal-navy">
                  +
                </button>
                <span className="ms-auto text-xs text-muted-foreground">
                  {product.stock.toLocaleString()} {unitLabels[product.unit]?.[locale] || product.unit} {locale === 'ar' ? 'متوفر' : 'disponible'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-deal-gold/10 border border-deal-gold/20">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-deal-navy">{locale === 'ar' ? 'المجموع' : 'Total'}</span>
                <span className="text-lg font-black text-deal-teal">
                  {(product.price * orderQuantity).toLocaleString()} {t.common.currency}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">{locale === 'ar' ? 'عنوان التوصيل' : 'Adresse de livraison'}</label>
              <input type="text" value={orderDeliveryAddress} onChange={(e) => setOrderDeliveryAddress(e.target.value)}
                placeholder={locale === 'ar' ? 'أدخل عنوان التوصيل...' : "Entrez l'adresse de livraison..."}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t.common.bookingNotes}</label>
              <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}
                placeholder={t.common.bookingNotesPlaceholder} rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal" />
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                disabled={orderQuantity < 1 || orderLoading} onClick={submitOrder}
                className="flex-1 btn-3d-sm text-white rounded-xl px-4 py-2.5 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: 'linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)', boxShadow: '0 4px 0 0 #0F766E, 0 6px 8px rgba(13,148,136,0.25)' }}>
                {orderLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageCheck className="w-4 h-4" />}
                {t.products.buyNow}
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowOrderForm(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-muted-foreground hover:bg-gray-50">
                {t.common.cancel}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ContactFormSection = () => (
    <AnimatePresence>
      {showContactForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <div className="p-4 rounded-xl bg-deal-teal/5 border border-deal-teal/20 space-y-3">
            <h5 className="text-sm font-bold text-deal-navy flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-deal-teal" />{t.common.contactForm}
            </h5>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground mb-0.5 block">{t.common.contactName}</label>
                <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder={t.common.contactName}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground mb-0.5 block">{t.common.contactEmail}</label>
                <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder={t.common.contactEmail}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground mb-0.5 block">{t.common.contactPhone}</label>
              <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder={t.common.contactPhone}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground mb-0.5 block">{t.common.contactMessage}</label>
              <textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)}
                placeholder={t.common.contactMessagePlaceholder} rows={2}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal" />
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                disabled={!contactName || !contactEmail || !contactMessage || contactLoading} onClick={submitContact}
                className="flex-1 btn-3d-sm text-white rounded-xl px-4 py-2.5 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: 'linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)', boxShadow: '0 4px 0 0 #0F766E, 0 6px 8px rgba(13,148,136,0.25)' }}>
                {contactLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {t.common.send}
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowContactForm(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-muted-foreground hover:bg-gray-50">
                {t.common.cancel}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ReviewsSection = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-deal-navy flex items-center gap-2">
          <Star className="w-4 h-4 fill-deal-gold text-deal-gold" />
          {t.common.reviews} ({totalReviews + userReviews.length})
        </h4>
        {currentUser && !showReviewForm && (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setShowReviewForm(true); setShowBookingForm(false); setShowContactForm(false); }}
            className="text-[10px] font-bold text-deal-gold bg-deal-gold/10 px-3 py-1 rounded-full hover:bg-deal-gold/20 transition-colors flex items-center gap-1">
            <PenLine className="w-3 h-3" />{t.common.writeReview}
          </motion.button>
        )}
      </div>
      <ReviewFormSection />
      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
        {userReviews.map((review, i) => (
          <motion.div key={`user-${i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-deal-gold/5 border border-deal-gold/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-deal-gold to-amber-500 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">{review.name.charAt(0)}</span>
                </div>
                <span className="text-xs font-bold text-deal-navy">{review.name}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{review.date}</span>
            </div>
            <RatingStars rating={review.rating} size="sm" showCount={false} />
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{review.text}</p>
          </motion.div>
        ))}
        {staticReviews.map((review, i) => (
          <motion.div key={`static-${i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">{getLocalizedValue(review.name.ar, review.name.fr).charAt(0)}</span>
                </div>
                <span className="text-xs font-bold text-deal-navy">{getLocalizedValue(review.name.ar, review.name.fr)}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{review.date}</span>
            </div>
            <RatingStars rating={review.rating} size="sm" showCount={false} />
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{getLocalizedValue(review.text.ar, review.text.fr)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const handleOpenSimilar = (similarItemId: string, type: 'service' | 'product' | 'equipment') => {
    setSelectedItemId(similarItemId);
    setDetailType(type);
    setActiveImage(0);
  };

  // --- SERVICE DETAIL ---
  if (detailType === 'service' && service) {
    const providerName = getLocalizedValue(service.providerName, service.providerNameFr);
    const categoryName = getLocalizedValue(service.categoryName, service.categoryNameFr);
    const CategoryIcon = categoryIconMap[service.categoryId] || Wrench;

    return (
      <Dialog open={showDetailModal} onOpenChange={(open) => { setShowDetailModal(open); if (!open) setActiveImage(0); }}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Gradient header with favorite & share buttons */}
          <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <div className="absolute inset-0 hero-pattern opacity-30" />
            <motion.div
              className="absolute w-20 h-20 rounded-full bg-white/10 top-4 start-4"
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-12 h-12 rounded-full bg-white/10 bottom-8 end-8"
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative w-20 h-20 rounded-3xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
            >
              <CategoryIcon className="w-10 h-10 text-deal-orange" />
            </motion.div>

            {/* Action buttons overlay */}
            <div className="absolute top-3 end-3 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-4 h-4 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleFavorite}
                className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </motion.button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-deal-orange bg-deal-orange/10 px-3 py-1 rounded-full">
                  {categoryName}
                </span>
                {service.isAvailable ? (
                  <span className="badge-3d bg-emerald-500 text-white text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {t.services.available}
                  </span>
                ) : (
                  <span className="badge-3d bg-red-500 text-white text-xs flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {t.services.unavailable}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-deal-navy leading-tight">{title}</h2>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

            {/* Image Gallery */}
            <div className="space-y-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`w-full h-40 rounded-xl bg-gradient-to-br ${galleryGradients[activeImage]} flex items-center justify-center`}
                >
                  <ImageIcon className="w-12 h-12 text-white/40" />
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-2">
                {galleryGradients.map((g, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImage(i)}
                    className={`flex-1 h-12 rounded-lg bg-gradient-to-br ${g} flex items-center justify-center transition-all ${
                      activeImage === i ? 'ring-2 ring-deal-orange ring-offset-2' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-white/50" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Provider info with clickable contact */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => handleContact({ ar: service.providerName, fr: service.providerNameFr })}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-deal-teal/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-deal-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-deal-navy">{providerName}</p>
                <RatingStars rating={service.providerRating} size="sm" showCount={false} />
              </div>
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
            </motion.div>

            <RatingStars rating={rating} size="md" reviewCount={totalReviews} />

            {/* Contact Provider Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleContact({ ar: service.providerName, fr: service.providerNameFr })}
              className="w-full btn-3d-sm text-white rounded-xl px-6 py-2.5 font-bold text-sm flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)',
                boxShadow: '0 4px 0 0 #0F766E, 0 6px 8px rgba(13,148,136,0.25)',
              }}
            >
              <MessageCircle className="w-4 h-4" />
              {t.common.contactProvider}
            </motion.button>

            <ReviewsSection />

            <BookingFormSection />
            <ContactFormSection />

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-muted-foreground">{t.services.price}</p>
                <p className="text-2xl font-black text-deal-orange">
                  {service.price.toLocaleString()} <span className="text-sm font-semibold">{t.common.currency}</span>
                </p>
                <p className="text-xs text-muted-foreground">{t.services.perService}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { handleBooking(service.title); }}
                className="btn-3d text-white bg-deal-orange rounded-xl px-8 py-3 font-bold text-base"
              >
                {showBookingForm ? t.common.cancel : t.services.book}
              </motion.button>
            </div>

            {/* Similar Items */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-deal-navy">
                {locale === 'ar' ? 'خدمات مشابهة' : 'Services similaires'}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {similarItems.map((sim) => (
                  <motion.button
                    key={sim.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenSimilar(sim.id, 'service')}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-deal-orange/30 hover:bg-deal-orange/5 transition-all text-start"
                  >
                    <div className="w-8 h-8 rounded-lg bg-deal-orange/10 flex items-center justify-center mb-2">
                      <Wrench className="w-4 h-4 text-deal-orange" />
                    </div>
                    <p className="text-[10px] font-bold text-deal-navy leading-tight line-clamp-2">
                      {getLocalizedValue(sim.title, sim.titleFr)}
                    </p>
                    <p className="text-[9px] text-deal-orange font-bold mt-1">
                      {sim.price.toLocaleString()} {t.common.currency}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  // --- PRODUCT DETAIL ---
  if (detailType === 'product' && product) {
    const merchantName = getLocalizedValue(product.merchantName, product.merchantNameFr);
    const categoryName = getLocalizedValue(product.categoryName, product.categoryNameFr);
    const unitLabel = unitLabels[product.unit]?.[locale] || product.unit;

    return (
      <Dialog open={showDetailModal} onOpenChange={(open) => { setShowDetailModal(open); if (!open) setActiveImage(0); }}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <div className="absolute inset-0 hero-pattern opacity-30" />
            <motion.div
              className="absolute w-20 h-20 rounded-full bg-white/10 top-4 end-4"
              animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-14 h-14 rounded-full bg-white/10 bottom-6 start-6"
              animate={{ y: [0, 10, 0], scale: [1, 0.9, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative w-20 h-20 rounded-3xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
            >
              <PackageCheck className="w-10 h-10 text-deal-teal" />
            </motion.div>

            <div className="absolute top-3 end-3 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-4 h-4 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleFavorite}
                className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </motion.button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-deal-teal bg-deal-teal/10 px-3 py-1 rounded-full">
                  {categoryName}
                </span>
                {product.stock > 0 ? (
                  <span className="badge-3d bg-emerald-500 text-white text-xs flex items-center gap-1">
                    <PackageCheck className="w-3 h-3" />
                    {t.products.inStock}: {product.stock}
                  </span>
                ) : (
                  <span className="badge-3d bg-red-500 text-white text-xs flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {t.products.outOfStock}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-deal-navy leading-tight">{title}</h2>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

            {/* Image Gallery */}
            <div className="space-y-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`w-full h-40 rounded-xl bg-gradient-to-br ${galleryGradients[activeImage]} flex items-center justify-center`}
                >
                  <ImageIcon className="w-12 h-12 text-white/40" />
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-2">
                {galleryGradients.map((g, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImage(i)}
                    className={`flex-1 h-12 rounded-lg bg-gradient-to-br ${g} flex items-center justify-center transition-all ${
                      activeImage === i ? 'ring-2 ring-deal-teal ring-offset-2' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-white/50" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Merchant info */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => handleContact({ ar: product.merchantName, fr: product.merchantNameFr })}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-deal-orange/10 flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5 text-deal-orange" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-deal-navy">{merchantName}</p>
                <p className="text-xs text-muted-foreground">{categoryName}</p>
              </div>
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
            </motion.div>

            <RatingStars rating={rating} size="md" reviewCount={totalReviews} />

            {/* Contact Provider Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleContact({ ar: product.merchantName, fr: product.merchantNameFr })}
              className="w-full btn-3d-sm text-white rounded-xl px-6 py-2.5 font-bold text-sm flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)',
                boxShadow: '0 4px 0 0 #0F766E, 0 6px 8px rgba(13,148,136,0.25)',
              }}
            >
              <MessageCircle className="w-4 h-4" />
              {t.common.contactProvider}
            </motion.button>

            {/* Stock bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t.products.stock}</span>
                <span>{product.stock.toLocaleString()} {unitLabel}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (product.stock / 500) * 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    product.stock > 100 ? 'bg-emerald-500' : product.stock > 20 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>

            <ReviewsSection />

            <OrderFormSection />
            <ContactFormSection />

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-muted-foreground">{t.products.price}</p>
                <p className="text-2xl font-black text-deal-teal">
                  {product.price.toLocaleString()} <span className="text-sm font-semibold">{t.common.currency}</span>
                </p>
                <p className="text-xs text-muted-foreground">/ {unitLabel}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={product.stock <= 0}
                onClick={() => { handleOrder(product.title); }}
                className="btn-3d-sm btn-3d-teal text-white rounded-xl px-8 py-3 font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showOrderForm ? t.common.cancel : t.products.buyNow}
              </motion.button>
            </div>

            {/* Similar Items */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-deal-navy">
                {locale === 'ar' ? 'منتجات مشابهة' : 'Produits similaires'}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {similarItems.map((sim) => (
                  <motion.button
                    key={sim.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenSimilar(sim.id, 'product')}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-deal-teal/30 hover:bg-deal-teal/5 transition-all text-start"
                  >
                    <div className="w-8 h-8 rounded-lg bg-deal-teal/10 flex items-center justify-center mb-2">
                      <PackageCheck className="w-4 h-4 text-deal-teal" />
                    </div>
                    <p className="text-[10px] font-bold text-deal-navy leading-tight line-clamp-2">
                      {getLocalizedValue(sim.title, sim.titleFr)}
                    </p>
                    <p className="text-[9px] text-deal-teal font-bold mt-1">
                      {sim.price.toLocaleString()} {t.common.currency}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  // --- EQUIPMENT DETAIL ---
  if (detailType === 'equipment' && equipment) {
    const ownerName = getLocalizedValue(equipment.ownerName, equipment.ownerNameFr);

    const priceMap: Record<PriceTab, number> = {
      daily: equipment.dailyPrice,
      weekly: equipment.weeklyPrice,
      monthly: equipment.monthlyPrice,
    };

    const periodLabel: Record<PriceTab, string> = {
      daily: t.equipment.daily,
      weekly: t.equipment.weekly,
      monthly: t.equipment.monthly,
    };

    return (
      <Dialog open={showDetailModal} onOpenChange={(open) => { setShowDetailModal(open); if (!open) setActiveImage(0); }}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <div className="absolute inset-0 hero-pattern opacity-30" />
            <motion.div
              className="absolute w-20 h-20 rounded-full bg-white/10 top-6 start-6"
              animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-16 h-16 rounded-full bg-white/10 bottom-4 end-10"
              animate={{ y: [0, 12, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative w-20 h-20 rounded-3xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
            >
              <Wrench className="w-10 h-10 text-deal-gold" />
            </motion.div>

            <div className="absolute top-3 end-3 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-4 h-4 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleFavorite}
                className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </motion.button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-deal-gold bg-deal-gold/10 px-3 py-1 rounded-full">
                  {t.sections.equipment}
                </span>
                {equipment.status === 'AVAILABLE' ? (
                  <span className="badge-3d bg-emerald-500 text-white text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {t.equipment.available}
                  </span>
                ) : (
                  <span className="badge-3d bg-amber-500 text-white text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t.equipment.rented}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-deal-navy leading-tight">{title}</h2>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

            {/* Image Gallery */}
            <div className="space-y-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`w-full h-40 rounded-xl bg-gradient-to-br ${galleryGradients[activeImage]} flex items-center justify-center`}
                >
                  <ImageIcon className="w-12 h-12 text-white/40" />
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-2">
                {galleryGradients.map((g, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImage(i)}
                    className={`flex-1 h-12 rounded-lg bg-gradient-to-br ${g} flex items-center justify-center transition-all ${
                      activeImage === i ? 'ring-2 ring-deal-gold ring-offset-2' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-white/50" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Owner info */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => handleContact({ ar: equipment.ownerName, fr: equipment.ownerNameFr })}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-deal-gold/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-deal-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-deal-navy">{ownerName}</p>
                <p className="text-xs text-muted-foreground">{t.equipment.available}</p>
              </div>
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
            </motion.div>

            <RatingStars rating={rating} size="md" reviewCount={totalReviews} />

            {/* Contact Provider Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleContact({ ar: equipment.ownerName, fr: equipment.ownerNameFr })}
              className="w-full btn-3d-sm text-white rounded-xl px-6 py-2.5 font-bold text-sm flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)',
                boxShadow: '0 4px 0 0 #0F766E, 0 6px 8px rgba(13,148,136,0.25)',
              }}
            >
              <MessageCircle className="w-4 h-4" />
              {t.common.contactProvider}
            </motion.button>

            {/* Price tabs */}
            <div className="space-y-3">
              <div className="flex rounded-xl overflow-hidden border border-amber-200 bg-amber-50/50">
                {(Object.keys(priceMap) as PriceTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPriceTab(tab)}
                    className={`flex-1 py-2.5 text-sm font-bold transition-all duration-200 ${
                      priceTab === tab
                        ? 'bg-deal-gold text-deal-navy shadow-md'
                        : 'text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    {periodLabel[tab]}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(priceMap) as PriceTab[]).map((tab) => (
                  <motion.div
                    key={tab}
                    onClick={() => setPriceTab(tab)}
                    whileHover={{ scale: 1.03 }}
                    className={`cursor-pointer rounded-xl p-3 text-center transition-all duration-200 border-2 ${
                      priceTab === tab
                        ? 'border-deal-gold bg-deal-gold/10 shadow-md'
                        : 'border-gray-100 bg-white hover:border-amber-200'
                    }`}
                  >
                    <p className="text-[10px] font-bold text-muted-foreground mb-1">{periodLabel[tab]}</p>
                    <p className="text-sm font-black text-deal-navy">
                      {priceMap[tab].toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{t.common.currency}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <ReviewsSection />

            <BookingFormSection />
            <ContactFormSection />

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-muted-foreground">{t.equipment.perDay}</p>
                <motion.p
                  key={priceTab}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-black text-deal-gold"
                >
                  {priceMap[priceTab].toLocaleString()} <span className="text-sm font-semibold">{t.common.currency}</span>
                </motion.p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={equipment.status !== 'AVAILABLE'}
                onClick={() => { handleBooking(equipment.title); }}
                className="btn-3d-sm btn-3d-gold text-deal-navy rounded-xl px-8 py-3 font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showBookingForm ? t.common.cancel : t.equipment.book}
              </motion.button>
            </div>

            {/* Similar Items */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-deal-navy">
                {locale === 'ar' ? 'معدات مشابهة' : 'Équipements similaires'}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {similarItems.map((sim) => (
                  <motion.button
                    key={sim.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenSimilar(sim.id, 'equipment')}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-deal-gold/30 hover:bg-deal-gold/5 transition-all text-start"
                  >
                    <div className="w-8 h-8 rounded-lg bg-deal-gold/10 flex items-center justify-center mb-2">
                      <Wrench className="w-4 h-4 text-deal-gold" />
                    </div>
                    <p className="text-[10px] font-bold text-deal-navy leading-tight line-clamp-2">
                      {getLocalizedValue(sim.title, sim.titleFr)}
                    </p>
                    <p className="text-[9px] text-deal-gold font-bold mt-1">
                      {sim.dailyPrice.toLocaleString()} {t.common.currency}/{t.equipment.daily}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
