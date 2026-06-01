'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Plus,
  X,
  Loader2,
  ImageIcon,
  Trash2,
  Upload,
  Camera,
  Check,
  Wrench,
  Package,
  Truck,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import { toast } from 'sonner';

type ItemType = 'service' | 'product' | 'equipment';

interface Category {
  id: string;
  name: string;
  nameFr?: string | null;
}

export default function AddItemPage({ type }: { type: ItemType }) {
  const { t, locale } = useI18n();
  const { currentUser, setShowAddItemPage } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Service fields
  const [title, setTitle] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionFr, setDescriptionFr] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // Product extra fields
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('piece');

  // Equipment extra fields
  const [weeklyPrice, setWeeklyPrice] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');

  // Categories fetched from API
  const [categories, setCategories] = useState<Category[]>([]);

  // Track if categories have been loaded
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const loadCategories = useCallback(async () => {
    if (categoriesLoaded) return;

    try {
      let endpoint = '';
      if (type === 'service') {
        endpoint = '/api/service-categories';
      } else if (type === 'product') {
        endpoint = '/api/product-categories';
      }

      if (endpoint) {
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (data.length > 0) {
            setCategoryId(data[0].id);
          }
        }
      }
    } catch {
      // fallback categories
      if (type === 'service') {
        setCategories([
          { id: 'elec', name: 'كهرباء', nameFr: 'Électricité' },
          { id: 'plumb', name: 'سباكة', nameFr: 'Plomberie' },
          { id: 'build', name: 'بناء', nameFr: 'Construction' },
          { id: 'carp', name: 'نجارة', nameFr: 'Menuiserie' },
          { id: 'hvac', name: 'تبريد وتكييف', nameFr: 'Climatisation' },
          { id: 'metal', name: 'حدادة', nameFr: 'Ferronnerie' },
          { id: 'paint', name: 'دهان', nameFr: 'Peinture' },
          { id: 'clean', name: 'صيانة', nameFr: 'Entretien' },
        ]);
      } else if (type === 'product') {
        setCategories([
          { id: 'building', name: 'مواد بناء', nameFr: 'Matériaux de construction' },
          { id: 'electrical_materials', name: 'مواد كهربائية', nameFr: 'Matériaux électriques' },
          { id: 'wood', name: 'أخشاب', nameFr: 'Bois' },
          { id: 'plumbing_materials', name: 'مواد سباكة', nameFr: 'Matériaux de plomberie' },
          { id: 'paints', name: 'دهانات', nameFr: 'Peintures' },
          { id: 'tools', name: 'أدوات', nameFr: 'Outils' },
        ]);
      }
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }
    } finally {
      setCategoriesLoaded(true);
    }
  }, [type, categoriesLoaded, categories]);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImages(prev => [...prev, ...data.urls]);
        toast.success(t.addItem.uploadSuccess);
      } else {
        toast.error(t.addItem.uploadError);
      }
    } catch {
      toast.error(t.addItem.uploadError);
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !price.trim() || !currentUser?.id) {
      toast.error(t.addItem.requiredFields);
      return;
    }

    if (type !== 'equipment' && !categoryId) {
      toast.error(t.addItem.requiredFields);
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      let body: Record<string, unknown> = {};

      if (type === 'service') {
        endpoint = '/api/services';
        body = {
          providerId: currentUser.id,
          categoryId,
          title: title.trim(),
          titleFr: titleFr.trim() || null,
          description: description.trim(),
          descriptionFr: descriptionFr.trim() || null,
          price: parseFloat(price),
          images: images.length > 0 ? images.join(',') : null,
        };
      } else if (type === 'product') {
        endpoint = '/api/products';
        body = {
          merchantId: currentUser.id,
          categoryId,
          title: title.trim(),
          titleFr: titleFr.trim() || null,
          description: description.trim(),
          descriptionFr: descriptionFr.trim() || null,
          price: parseFloat(price),
          stock: parseInt(stock) || 0,
          unit,
          images: images.length > 0 ? images.join(',') : null,
        };
      } else if (type === 'equipment') {
        endpoint = '/api/equipment';
        body = {
          ownerId: currentUser.id,
          title: title.trim(),
          titleFr: titleFr.trim() || null,
          description: description.trim(),
          descriptionFr: descriptionFr.trim() || null,
          dailyPrice: parseFloat(price),
          weeklyPrice: weeklyPrice ? parseFloat(weeklyPrice) : null,
          monthlyPrice: monthlyPrice ? parseFloat(monthlyPrice) : null,
          images: images.length > 0 ? images.join(',') : null,
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(t.dashboard.addedSuccessfully);
        setShowAddItemPage(null);
      } else {
        const errData = await res.json().catch(() => ({ error: 'Failed' }));
        toast.error(errData.error || t.addItem.submitError);
      }
    } catch {
      toast.error(t.addItem.submitError);
    } finally {
      setLoading(false);
    }
  };

  const getTypeInfo = () => {
    switch (type) {
      case 'service':
        return {
          title: t.addItem.addService,
          subtitle: t.addItem.addServiceSub,
          icon: Wrench,
          gradient: 'from-deal-orange to-deal-gold',
          focusColor: 'focus:ring-deal-orange/30 focus:border-deal-orange',
        };
      case 'product':
        return {
          title: t.addItem.addProduct,
          subtitle: t.addItem.addProductSub,
          icon: Package,
          gradient: 'from-deal-teal to-emerald-400',
          focusColor: 'focus:ring-deal-teal/30 focus:border-deal-teal',
        };
      case 'equipment':
        return {
          title: t.addItem.addEquipment,
          subtitle: t.addItem.addEquipmentSub,
          icon: Truck,
          gradient: 'from-deal-gold to-amber-400',
          focusColor: 'focus:ring-deal-gold/30 focus:border-deal-gold',
        };
    }
  };

  const typeInfo = getTypeInfo();
  const TypeIcon = typeInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-navy via-slate-800 to-deal-navy p-6 sm:p-8 text-white">
        <div className="absolute inset-0 hero-pattern opacity-10" />
        <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-10 -start-10 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${typeInfo.gradient} flex items-center justify-center shadow-lg`}>
            <TypeIcon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-black">{typeInfo.title}</h2>
            <p className="text-sm text-white/60 mt-0.5">{typeInfo.subtitle}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddItemPage(null)}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Image Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-3d rounded-2xl bg-white p-5 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-deal-orange" />
          <h3 className="text-lg font-bold text-deal-navy">{t.addItem.photos}</h3>
          <span className="text-xs text-muted-foreground">({t.addItem.optional})</span>
        </div>

        {/* Upload area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            images.length > 0
              ? 'border-deal-teal/40 bg-deal-teal/5'
              : 'border-gray-200 hover:border-deal-orange/40 hover:bg-deal-orange/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          {uploadingImages ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-deal-orange animate-spin" />
              <p className="text-sm font-semibold text-deal-navy">{t.addItem.uploading}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl ${images.length > 0 ? 'bg-deal-teal/10' : 'bg-deal-orange/10'} flex items-center justify-center`}>
                <Upload className={`w-7 h-7 ${images.length > 0 ? 'text-deal-teal' : 'text-deal-orange'}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-deal-navy">{t.addItem.clickToUpload}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.addItem.uploadHint}</p>
              </div>
            </div>
          )}
        </div>

        {/* Image previews */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
              >
                <img
                  src={img}
                  alt={`${t.common.items} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeImage(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
                {index === 0 && (
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-deal-orange text-white text-[9px] font-bold">
                    {t.addItem.main}
                  </div>
                )}
              </motion.div>
            ))}
            {/* Add more button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-deal-orange/40 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-gray-50/50"
            >
              <Plus className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-semibold">{t.addItem.addMore}</span>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Bilingual Form Fields */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-3d rounded-2xl bg-white p-5 sm:p-6 space-y-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <ImageIcon className="w-5 h-5 text-deal-teal" />
          <h3 className="text-lg font-bold text-deal-navy">{t.addItem.details}</h3>
        </div>

        {/* Arabic Title */}
        <div>
          <label className="block text-sm font-semibold text-deal-navy mb-2">
            🇩🇿 {t.addItem.titleAr} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.addItem.titlePlaceholderAr}
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 ${typeInfo.focusColor} transition-all`}
            dir="rtl"
          />
        </div>

        {/* French Title */}
        <div>
          <label className="block text-sm font-semibold text-deal-navy mb-2">
            🇫🇷 {t.addItem.titleFr}
          </label>
          <input
            type="text"
            value={titleFr}
            onChange={(e) => setTitleFr(e.target.value)}
            placeholder={t.addItem.titlePlaceholderFr}
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 ${typeInfo.focusColor} transition-all`}
            dir="ltr"
          />
        </div>

        {/* Arabic Description */}
        <div>
          <label className="block text-sm font-semibold text-deal-navy mb-2">
            🇩🇿 {t.addItem.descAr} <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.addItem.descPlaceholderAr}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 ${typeInfo.focusColor} transition-all resize-none`}
            dir="rtl"
          />
        </div>

        {/* French Description */}
        <div>
          <label className="block text-sm font-semibold text-deal-navy mb-2">
            🇫🇷 {t.addItem.descFr}
          </label>
          <textarea
            value={descriptionFr}
            onChange={(e) => setDescriptionFr(e.target.value)}
            placeholder={t.addItem.descPlaceholderFr}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 ${typeInfo.focusColor} transition-all resize-none`}
            dir="ltr"
          />
        </div>

        {/* Category (services & products only) */}
        {type !== 'equipment' && (
          <div>
            <label className="block text-sm font-semibold text-deal-navy mb-2">
              {t.addItem.category} <span className="text-red-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 ${typeInfo.focusColor} transition-all`}
            >
              <option value="">{t.addItem.selectCategory}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {locale === 'fr' && cat.nameFr ? cat.nameFr : cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </motion.div>

      {/* Pricing Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-3d rounded-2xl bg-white p-5 sm:p-6 space-y-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">💰</span>
          <h3 className="text-lg font-bold text-deal-navy">{t.addItem.pricing}</h3>
        </div>

        {/* Main Price */}
        <div>
          <label className="block text-sm font-semibold text-deal-navy mb-2">
            {type === 'equipment' ? t.dashboard.dailyPriceField : t.dashboard.priceField} <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 ${typeInfo.focusColor} transition-all pe-16`}
              dir="ltr"
            />
            <span className="absolute end-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
              {t.common.currency}
            </span>
          </div>
        </div>

        {/* Product: Stock & Unit */}
        {type === 'product' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-deal-navy mb-2">
                  {t.addItem.stock}
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 ${typeInfo.focusColor} transition-all`}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-deal-navy mb-2">
                  {t.common.unit}
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 ${typeInfo.focusColor} transition-all`}
                >
                  <option value="piece">{t.addItem.unitPiece}</option>
                  <option value="kg">{t.addItem.unitKg}</option>
                  <option value="meter">{t.addItem.unitMeter}</option>
                  <option value="box">{t.addItem.unitBox}</option>
                  <option value="bag">{t.addItem.unitBag}</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Equipment: Weekly & Monthly prices */}
        {type === 'equipment' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-deal-navy mb-2">
                {t.common.weeklyPrice}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={weeklyPrice}
                  onChange={(e) => setWeeklyPrice(e.target.value)}
                  placeholder="0"
                  className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 ${typeInfo.focusColor} transition-all pe-16`}
                  dir="ltr"
                />
                <span className="absolute end-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  {t.common.currency}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-deal-navy mb-2">
                {t.common.monthlyPrice}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(e.target.value)}
                  placeholder="0"
                  className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 ${typeInfo.focusColor} transition-all pe-16`}
                  dir="ltr"
                />
                <span className="absolute end-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  {t.common.currency}
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 pb-8"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading || !title.trim() || !price.trim()}
          onClick={handleSubmit}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r ${typeInfo.gradient} text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.addItem.submitting}
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              {t.addItem.publish}
            </>
          )}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddItemPage(null)}
          className="px-6 py-4 rounded-xl bg-gray-100 text-deal-navy text-sm font-bold hover:bg-gray-200 transition-colors"
        >
          {t.common.cancel}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
