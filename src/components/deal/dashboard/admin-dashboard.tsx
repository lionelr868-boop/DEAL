'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users,
  Wrench,
  Package,
  Truck,
  ShoppingCart,
  DollarSign,
  UserCog,
  FolderTree,
  BarChart3,
  UserPlus,
  CalendarCheck,
  Star,
  Activity,
  Clock,
  Check,
  Ban,
  Loader2,
  ShieldCheck,
  ShieldX,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  Award,
  Briefcase,
  Eye,
  Power,
  PowerOff,
  AlertTriangle,
  MessageCircle,
  Send,
  CheckCircle2,
  XCircle,
  Clock4,
  Trash2,
  Plus,
  LayoutGrid,
  Tag,
  FileText,
  ToggleLeft,
  ToggleRight,
  Settings,
  Settings2,
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import ProfileTabContent from './profile-tab-content';
import { AnimatedCounter } from '../animated-counter';
import { toast } from 'sonner';

// ────────────────────────────────────────
// Animation Variants
// ────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' },
  }),
};

// ────────────────────────────────────────
// Shared Configs
// ────────────────────────────────────────
const roleColors: Record<string, { bg: string; text: string }> = {
  customer: { bg: 'bg-deal-orange/10', text: 'text-deal-orange' },
  craftsman: { bg: 'bg-deal-teal/10', text: 'text-deal-teal' },
  merchant: { bg: 'bg-deal-gold/10', text: 'text-deal-gold-dark' },
  equipment_owner: { bg: 'bg-purple-100', text: 'text-purple-600' },
  admin: { bg: 'bg-red-50', text: 'text-red-500' },
};

const roleLabels: Record<string, { ar: string; fr: string }> = {
  customer: { ar: 'عميل', fr: 'Client' },
  craftsman: { ar: 'حرفي', fr: 'Artisan' },
  merchant: { ar: 'تاجر', fr: 'Commerçant' },
  equipment_owner: { ar: 'مؤجر معدات', fr: 'Loueur' },
  admin: { ar: 'مدير', fr: 'Admin' },
};

const complaintStatusConfig: Record<string, { bg: string; text: string; icon: typeof CheckCircle2; labelAr: string; labelFr: string }> = {
  PENDING: { bg: 'bg-orange-100', text: 'text-orange-600', icon: Clock4, labelAr: 'قيد الانتظار', labelFr: 'En attente' },
  IN_PROGRESS: { bg: 'bg-amber-100', text: 'text-amber-600', icon: Clock, labelAr: 'قيد المعالجة', labelFr: 'En cours' },
  RESOLVED: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: CheckCircle2, labelAr: 'تم الحل', labelFr: 'Résolu' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-500', icon: XCircle, labelAr: 'مرفوض', labelFr: 'Rejeté' },
};

// ────────────────────────────────────────
// Interfaces
// ────────────────────────────────────────
interface DBUser {
  id: string;
  email: string;
  name: string;
  nameFr: string | null;
  phone: string | null;
  role: string;
  avatar: string | null;
  isVerified: boolean;
  isActive: boolean;
  rating: number | null;
  totalReviews: number;
  specialties: string | null;
  experience: number | null;
  hourlyRate: number | null;
  bio: string | null;
  bioFr: string | null;
  city: string;
  wilaya: string;
  shopName: string | null;
  shopNameFr: string | null;
  hasDelivery: boolean;
  createdAt: string;
}

interface ComplaintItem {
  id: string;
  userId: string;
  targetId: string | null;
  targetType: string | null;
  subject: string;
  subjectFr: string | null;
  description: string;
  descriptionFr: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  adminReply: string | null;
  adminReplyFr: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    nameFr: string | null;
    email: string;
    phone: string | null;
    avatar: string | null;
  };
}

interface MessageItem {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: { id: string; name: string; nameFr: string | null; avatar: string | null };
  receiver: { id: string; name: string; nameFr: string | null; avatar: string | null };
}

interface ConversationItem {
  otherUserId: string;
  otherUserName: string;
  otherUserNameFr: string | null;
  otherUserAvatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ContentItem {
  id: string;
  title: string;
  titleFr: string | null;
  price: number;
  isAvailable: boolean;
  providerName?: string;
  categoryName?: string;
  rating?: number;
  stock?: number;
  status?: string;
  createdAt: string;
}

interface CategoryItem {
  id: string;
  name: string;
  nameFr: string | null;
  icon: string | null;
  description: string | null;
  descriptionFr: string | null;
  sortOrder: number;
  _count?: { services?: number; products?: number };
}

interface ApiStats {
  users: Record<string, number>;
  services: number;
  products: number;
  equipment: number;
  bookings: number;
  orders: number;
  pendingComplaints: number;
  recentUsers: Array<{
    id: string;
    name: string;
    nameFr: string | null;
    role: string;
    avatar: string | null;
    createdAt: string;
  }>;
  recentActivity: Array<{
    type: string;
    text: string;
    textFr: string | null;
    createdAt: string;
  }>;
}

// ────────────────────────────────────────
// Tab Header Component
// ────────────────────────────────────────
function TabHeader({
  icon: Icon,
  iconColor,
  badgeColor,
  badge,
  title,
  subtitle,
  onRefresh,
  loading,
}: {
  icon: typeof Activity;
  iconColor: string;
  badgeColor: string;
  badge: string;
  title: string;
  subtitle: string;
  onRefresh: () => void;
  loading: boolean;
}) {
  const locale = useI18n().locale;
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-navy via-deal-navy-dark to-deal-navy p-6 text-white">
      <div className="absolute inset-0 hero-pattern opacity-20" />
      <div className={`absolute -top-10 ${locale === 'ar' ? '-end-10' : '-end-10'} w-48 h-48 rounded-full ${badgeColor} blur-2xl`} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          <span className={`text-xs font-bold ${iconColor} ${badgeColor.replace('blur-2xl', '/20')} px-2 py-0.5 rounded-full`}>{badge}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">{title}</h2>
            <p className="mt-1 text-white/70 text-sm">{subtitle}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            onClick={onRefresh}
            className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────
// Loading Spinner
// ────────────────────────────────────────
function LoadingSpinner({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-deal-orange animate-spin" />
      <span className="ms-3 text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

// ────────────────────────────────────────
// Empty State
// ────────────────────────────────────────
function EmptyState({ icon: Icon, message }: { icon: typeof Users; message: string }) {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

// ────────────────────────────────────────
// Main Component
// ────────────────────────────────────────
export default function AdminDashboard() {
  const { t, getLocalizedValue, locale } = useI18n();
  const { dashboardActiveTab, currentUser, setDashboardActiveTab } = useAppStore();

  // ── Shared state ──
  const [dbUsers, setDbUsers] = useState<DBUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [expandedUserDetail, setExpandedUserDetail] = useState<DBUser | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Stats
  const [apiStats, setApiStats] = useState<ApiStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Complaints
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [expandedComplaintId, setExpandedComplaintId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  // Messages
  const [allUsers, setAllUsers] = useState<DBUser[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<DBUser | null>(null);
  const [chatMessages, setChatMessages] = useState<MessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Content management
  const [contentTab, setContentTab] = useState<'services' | 'products' | 'equipment'>('services');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentSearch, setContentSearch] = useState('');
  const [contentActionLoading, setContentActionLoading] = useState<string | null>(null);

  // Categories
  const [serviceCategories, setServiceCategories] = useState<CategoryItem[]>([]);
  const [productCategories, setProductCategories] = useState<CategoryItem[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);
  const [showAddServiceCat, setShowAddServiceCat] = useState(false);
  const [showAddProductCat, setShowAddProductCat] = useState(false);
  const [catActionLoading, setCatActionLoading] = useState<string | null>(null);
  const [newServiceCat, setNewServiceCat] = useState({ name: '', nameFr: '', icon: '🔧', description: '', descriptionFr: '', sortOrder: 0 });
  const [newProductCat, setNewProductCat] = useState({ name: '', nameFr: '', icon: '🧱', description: '', descriptionFr: '', sortOrder: 0 });

  // Settings
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [platformName, setPlatformName] = useState('DEAL');
  const [contactEmail, setContactEmail] = useState('contact@deal.dz');
  const [supportPhone, setSupportPhone] = useState('+213 37 XX XX XX');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // ────────────────────────────────────────
  // API Fetchers
  // ────────────────────────────────────────
  const fetchUsers = useCallback(async (search?: string, role?: string) => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (role && role !== 'all') params.set('role', role);
      const res = await fetch(`/api/users?${params.toString()}`);
      if (res.ok) setDbUsers(await res.json());
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/stats');
      if (res.ok) setApiStats(await res.json());
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchComplaints = useCallback(async () => {
    setLoadingComplaints(true);
    try {
      const res = await fetch('/api/complaints');
      if (res.ok) setComplaints(await res.json());
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoadingComplaints(false);
    }
  }, []);

  const fetchAllUsers = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) setAllUsers(await res.json());
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/messages?userId=${currentUser.id}`);
      if (res.ok) setConversations(await res.json());
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  }, [currentUser]);

  const fetchChatMessages = useCallback(async (otherUserId: string) => {
    if (!currentUser) return;
    setLoadingChat(true);
    try {
      const res = await fetch(`/api/messages?userId=${currentUser.id}&otherUserId=${otherUserId}`);
      if (res.ok) {
        setChatMessages(await res.json());
        await fetch('/api/messages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id, otherUserId }),
        });
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoadingChat(false);
    }
  }, [currentUser]);

  const fetchContent = useCallback(async (type: 'services' | 'products' | 'equipment', search?: string) => {
    setContentLoading(true);
    try {
      const params = new URLSearchParams({ type });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/content?${params.toString()}`);
      if (res.ok) setContentItems(await res.json());
    } catch (err) {
      console.error('Failed to fetch content:', err);
    } finally {
      setContentLoading(false);
    }
  }, []);

  const fetchServiceCategories = useCallback(async () => {
    setCatsLoading(true);
    try {
      const res = await fetch('/api/service-categories');
      if (res.ok) setServiceCategories(await res.json());
    } catch (err) {
      console.error('Failed to fetch service categories:', err);
    } finally {
      setCatsLoading(false);
    }
  }, []);

  const fetchProductCategories = useCallback(async () => {
    setCatsLoading(true);
    try {
      const res = await fetch('/api/product-categories');
      if (res.ok) setProductCategories(await res.json());
    } catch (err) {
      console.error('Failed to fetch product categories:', err);
    } finally {
      setCatsLoading(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setPlatformName(data.platformName || 'DEAL');
        setContactEmail(data.contactEmail || 'contact@deal.dz');
        setSupportPhone(data.supportPhone || '');
        setMaintenanceMode(data.maintenanceMode || false);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  // ────────────────────────────────────────
  // Action Handlers
  // ────────────────────────────────────────
  const handleToggleActive = async (userId: string, currentState: boolean) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState }),
      });
      if (res.ok) {
        toast.success(!currentState ? (locale === 'ar' ? 'تم تفعيل الحساب' : 'Compte activé') : (locale === 'ar' ? 'تم تعطيل الحساب' : 'Compte désactivé'));
        await fetchUsers(userSearch || undefined, roleFilter);
        if (expandedUserId === userId) setExpandedUserId(null);
      }
    } catch {
      toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVerified = async (userId: string, currentState: boolean) => {
    setActionLoading(userId);
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentState }),
      });
      toast.success(!currentState ? (locale === 'ar' ? 'تم توثيق الحساب' : 'Compte vérifié') : (locale === 'ar' ? 'تم سحب التوثيق' : 'Vérification retirée'));
      await fetchUsers(userSearch || undefined, roleFilter);
      if (expandedUserId === userId) {
        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) setExpandedUserDetail(await res.json());
      }
    } catch {
      toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(locale === 'ar' ? `هل أنت متأكد من حذف "${userName}"؟ لا يمكن التراجع.` : `Voulez-vous vraiment supprimer "${userName}" ? Cette action est irréversible.`)) return;
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        toast.success(locale === 'ar' ? `تم حذف المستخدم بنجاح` : `Utilisateur supprimé avec succès`);
        await fetchUsers(userSearch || undefined, roleFilter);
        if (expandedUserId === userId) { setExpandedUserId(null); setExpandedUserDetail(null); }
      } else {
        const err = await res.json();
        toast.error(err.error || (locale === 'ar' ? 'فشل حذف المستخدم' : 'Échec de la suppression'));
      }
    } catch {
      toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExpandUser = async (userId: string) => {
    if (expandedUserId === userId) { setExpandedUserId(null); setExpandedUserDetail(null); return; }
    setExpandedUserId(userId);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) setExpandedUserDetail(await res.json());
    } catch (err) { console.error('Failed to fetch user detail:', err); }
    finally { setLoadingDetail(false); }
  };

  const handleReplyComplaint = async (complaint: ComplaintItem) => {
    if (!replyText.trim()) return;
    setReplyLoading(complaint.id);
    try {
      const res = await fetch('/api/complaints?action=reply', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: complaint.id, adminReply: replyText, adminReplyFr: replyText }),
      });
      if (res.ok) { toast.success(locale === 'ar' ? t.dashboard.replySentSuccess : 'Réponse envoyée avec succès'); setReplyText(''); await fetchComplaints(); }
    } catch { toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue'); }
    finally { setReplyLoading(null); }
  };

  const handleStatusChange = async (complaintId: string, status: string) => {
    setStatusLoading(complaintId);
    try {
      const res = await fetch('/api/complaints?action=status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: complaintId, status }),
      });
      if (res.ok) { toast.success(locale === 'ar' ? t.dashboard.statusUpdated : 'Statut mis à jour'); await fetchComplaints(); }
    } catch { toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue'); }
    finally { setStatusLoading(null); }
  };

  const handleSendMessage = async () => {
    if (!currentUser || !selectedChatUser || !messageInput.trim()) return;
    setSendingMessage(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: currentUser.id, receiverId: selectedChatUser.id, content: messageInput }),
      });
      if (res.ok) { setMessageInput(''); await fetchChatMessages(selectedChatUser.id); await fetchConversations(); }
    } catch { toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue'); }
    finally { setSendingMessage(false); }
  };

  // Content actions
  const handleToggleContentAvailability = async (type: string, id: string, current: boolean) => {
    setContentActionLoading(id);
    try {
      const res = await fetch(`/api/admin/content?type=${type}&id=${id}&field=isAvailable&value=${!current}`, { method: 'PATCH' });
      if (res.ok) {
        toast.success(!current ? (locale === 'ar' ? 'تم تفعيل العنصر' : 'Élément activé') : (locale === 'ar' ? 'تم تعطيل العنصر' : 'Élément désactivé'));
        await fetchContent(contentTab, contentSearch || undefined);
      }
    } catch { toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue'); }
    finally { setContentActionLoading(null); }
  };

  const handleDeleteContent = async (type: string, id: string, title: string) => {
    if (!confirm(locale === 'ar' ? `هل أنت متأكد من حذف "${title}"؟` : `Voulez-vous vraiment supprimer "${title}" ?`)) return;
    setContentActionLoading(id);
    try {
      const res = await fetch(`/api/admin/content?type=${type}&id=${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success(locale === 'ar' ? 'تم الحذف بنجاح' : 'Supprimé avec succès'); await fetchContent(contentTab, contentSearch || undefined); }
    } catch { toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue'); }
    finally { setContentActionLoading(null); }
  };

  // Category actions
  const handleAddCategory = async (catType: 'service' | 'product') => {
    const data = catType === 'service' ? newServiceCat : newProductCat;
    if (!data.name.trim()) { toast.error(locale === 'ar' ? 'يرجى إدخال اسم الفئة' : 'Veuillez saisir le nom'); return; }
    setCatActionLoading('add-' + catType);
    try {
      const res = await fetch(catType === 'service' ? '/api/service-categories' : '/api/product-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success(locale === 'ar' ? 'تمت إضافة الفئة بنجاح' : 'Catégorie ajoutée avec succès');
        if (catType === 'service') { setShowAddServiceCat(false); setNewServiceCat({ name: '', nameFr: '', icon: '🔧', description: '', descriptionFr: '', sortOrder: 0 }); await fetchServiceCategories(); }
        else { setShowAddProductCat(false); setNewProductCat({ name: '', nameFr: '', icon: '🧱', description: '', descriptionFr: '', sortOrder: 0 }); await fetchProductCategories(); }
      }
    } catch { toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue'); }
    finally { setCatActionLoading(null); }
  };

  const handleDeleteCategory = async (catType: 'service' | 'product', id: string, name: string) => {
    if (!confirm(locale === 'ar' ? `هل أنت متأكد من حذف "${name}"؟` : `Voulez-vous vraiment supprimer "${name}" ?`)) return;
    setCatActionLoading(id);
    try {
      const res = await fetch((catType === 'service' ? '/api/service-categories' : '/api/product-categories') + `?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(locale === 'ar' ? 'تم حذف الفئة بنجاح' : 'Catégorie supprimée');
        if (catType === 'service') await fetchServiceCategories();
        else await fetchProductCategories();
      }
    } catch { toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue'); }
    finally { setCatActionLoading(null); }
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformName, contactEmail, supportPhone, maintenanceMode }),
      });
      if (res.ok) toast.success(locale === 'ar' ? t.dashboard.settingsSaved : t.dashboard.settingsSaved);
    } catch { toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue'); }
    finally { setSettingsSaving(false); }
  };

  // ────────────────────────────────────────
  // Effects
  // ────────────────────────────────────────
  useEffect(() => { fetchStats(); }, [fetchStats]);

  useEffect(() => {
    if (dashboardActiveTab === 'users') fetchUsers(userSearch || undefined, roleFilter);
  }, [dashboardActiveTab, fetchUsers, userSearch, roleFilter]);

  useEffect(() => {
    if (dashboardActiveTab === 'complaints') fetchComplaints();
  }, [dashboardActiveTab, fetchComplaints]);

  useEffect(() => {
    if (dashboardActiveTab === 'messages') { fetchAllUsers(); fetchConversations(); }
  }, [dashboardActiveTab, fetchAllUsers, fetchConversations]);

  useEffect(() => {
    if (dashboardActiveTab === 'content') fetchContent(contentTab, contentSearch || undefined);
  }, [dashboardActiveTab, contentTab, fetchContent, contentSearch]);

  useEffect(() => {
    if (dashboardActiveTab === 'categories') { fetchServiceCategories(); fetchProductCategories(); }
  }, [dashboardActiveTab, fetchServiceCategories, fetchProductCategories]);

  useEffect(() => {
    if (dashboardActiveTab === 'settings') fetchSettings();
  }, [dashboardActiveTab, fetchSettings]);

  // ────────────────────────────────────────
  // Computed values
  // ────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    let result = dbUsers;
    if (statusFilter === 'active') result = result.filter(u => u.isActive);
    else if (statusFilter === 'inactive') result = result.filter(u => !u.isActive);
    if (verificationFilter === 'verified') result = result.filter(u => u.isVerified);
    else if (verificationFilter === 'unverified') result = result.filter(u => !u.isVerified);
    return result;
  }, [dbUsers, statusFilter, verificationFilter]);

  const userRoleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const u of dbUsers) { const r = u.role.toLowerCase(); counts[r] = (counts[r] || 0) + 1; }
    return counts;
  }, [dbUsers]);

  const platformStats = useMemo(() => [
    { label: t.dashboard.customers, value: String(apiStats?.users?.customers || 0), icon: Users, bg: 'bg-deal-orange/10', iconColor: 'text-deal-orange' },
    { label: t.dashboard.craftsmen, value: String(apiStats?.users?.craftsmen || 0), icon: Wrench, bg: 'bg-deal-teal/10', iconColor: 'text-deal-teal' },
    { label: t.dashboard.merchants, value: String(apiStats?.users?.merchants || 0), icon: Package, bg: 'bg-deal-gold/10', iconColor: 'text-deal-gold-dark' },
    { label: t.dashboard.equipmentOwners, value: String(apiStats?.users?.equipmentOwners || 0), icon: Truck, bg: 'bg-purple-50', iconColor: 'text-purple-500' },
    { label: t.dashboard.totalBookings, value: String(apiStats?.bookings || 0), icon: ShoppingCart, bg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { label: t.dashboard.totalRevenueCount, value: String(apiStats?.users?.total || 0), icon: DollarSign, bg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  ], [apiStats, t.dashboard]);

  const quickActions = [
    { label: t.dashboard.manageUsers, icon: UserCog, gradient: 'linear-gradient(180deg, #FF8C5A 0%, #FF6B35 100%)', shadow: '0 4px 0 0 #CC5529, 0 6px 8px rgba(255,107,53,0.25)', action: () => setDashboardActiveTab('users') },
    { label: t.dashboard.manageCategories, icon: FolderTree, gradient: 'linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)', shadow: '0 4px 0 0 #0F766E, 0 6px 8px rgba(13,148,136,0.25)', action: () => setDashboardActiveTab('categories') },
    { label: t.dashboard.viewReports, icon: BarChart3, gradient: 'linear-gradient(180deg, #FBBF24 0%, #F59E0B 100%)', shadow: '0 4px 0 0 #D97706, 0 6px 8px rgba(245,158,11,0.25)', action: () => setDashboardActiveTab('reports') },
    { label: locale === 'ar' ? 'إدارة المحتوى' : 'Gérer le contenu', icon: LayoutGrid, gradient: 'linear-gradient(180deg, #A78BFA 0%, #8B5CF6 100%)', shadow: '0 4px 0 0 #6D28D9, 0 6px 8px rgba(139,92,246,0.25)', action: () => setDashboardActiveTab('content') },
  ];

  const activityIconMap: Record<string, { icon: typeof Activity; color: string }> = {
    booking: { icon: CalendarCheck, color: 'bg-deal-orange' },
    order: { icon: ShoppingCart, color: 'bg-deal-teal' },
    review: { icon: Star, color: 'bg-deal-gold' },
    complaint: { icon: AlertTriangle, color: 'bg-red-500' },
    user: { icon: UserPlus, color: 'bg-purple-500' },
  };

  const contentTabLabels = {
    services: { ar: 'الخدمات', fr: 'Services', icon: Wrench },
    products: { ar: 'المنتجات', fr: 'Produits', icon: Package },
    equipment: { ar: 'المعدات', fr: 'Équipements', icon: Truck },
  };

  // ────────────────────────────────────────
  // Helper: get user display name
  // ────────────────────────────────────────
  const getUserName = (u: DBUser) => locale === 'fr' && u.nameFr ? u.nameFr : u.name;
  const getRoleConf = (role: string) => roleColors[(role || '').toLowerCase()] || roleColors.customer;
  const getRoleName = (role: string) => roleLabels[(role || '').toLowerCase()] || roleLabels.customer;

  // ══════════════════════════════════════
  // TAB: Profile
  // ══════════════════════════════════════
  if (dashboardActiveTab === 'profile') {
    return <ProfileTabContent role="admin" />;
  }

  // ══════════════════════════════════════
  // TAB: Complaints (keep existing)
  // ══════════════════════════════════════
  if (dashboardActiveTab === 'complaints') {
    return (
      <div className="space-y-6">
        <TabHeader icon={AlertTriangle} iconColor="text-amber-400" badgeColor="bg-amber-500/20" badge={t.dashboard.complaints} title={t.dashboard.complaints} subtitle={locale === 'ar' ? 'مراجعة وإدارة شكاوى المستخدمين' : 'Réviser et gérer les réclamations des utilisateurs'} onRefresh={fetchComplaints} loading={loadingComplaints} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          {loadingComplaints ? (
            <LoadingSpinner text={t.common.loading} />
          ) : complaints.length === 0 ? (
            <EmptyState icon={AlertTriangle} message={t.dashboard.noComplaints} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-muted-foreground">{complaints.length} {locale === 'ar' ? 'شكوى' : 'réclamation(s)'}</span>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                {complaints.map((complaint, i) => {
                  const statusConf = complaintStatusConfig[complaint.status] || complaintStatusConfig.PENDING;
                  const StatusIcon = statusConf.icon;
                  const isExpanded = expandedComplaintId === complaint.id;
                  const userName = locale === 'fr' && complaint.user.nameFr ? complaint.user.nameFr : complaint.user.name;
                  return (
                    <motion.div key={complaint.id} custom={i} variants={fadeInUp} initial="hidden" animate="visible" className="rounded-xl border border-gray-100 hover:border-gray-200 overflow-hidden transition-all">
                      <div className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpandedComplaintId(isExpanded ? null : complaint.id)}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-deal-orange to-amber-400 flex items-center justify-center flex-shrink-0"><span className="text-white font-bold text-xs">{userName.charAt(0)}</span></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-sm text-deal-navy truncate">{userName}</p>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${statusConf.bg} ${statusConf.text}`}><StatusIcon className="w-3 h-3" />{locale === 'ar' ? statusConf.labelAr : statusConf.labelFr}</span>
                              </div>
                              <p className="text-xs font-semibold text-deal-navy mt-0.5">{locale === 'fr' && complaint.subjectFr ? complaint.subjectFr : complaint.subject}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{locale === 'fr' && complaint.descriptionFr ? complaint.descriptionFr : complaint.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[10px] text-muted-foreground">{new Date(complaint.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-FR')}</span>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <Eye className="w-3.5 h-3.5 text-gray-500" />}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                            <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-4">
                              <div><h4 className="text-xs font-bold text-muted-foreground mb-1">{t.dashboard.description}</h4><p className="text-sm text-deal-navy leading-relaxed bg-gray-50 rounded-lg p-3">{locale === 'fr' && complaint.descriptionFr ? complaint.descriptionFr : complaint.description}</p></div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" /><span>{complaint.user.email}</span>
                                {complaint.user.phone && <span className="ms-3 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /><span dir="ltr">{complaint.user.phone}</span></span>}
                              </div>
                              {complaint.adminReply && (
                                <div className="rounded-lg bg-deal-teal/5 border border-deal-teal/20 p-3">
                                  <div className="flex items-center gap-1.5 mb-1.5"><MessageCircle className="w-3.5 h-3.5 text-deal-teal" /><span className="text-[10px] font-bold text-deal-teal">{t.dashboard.adminReply}</span></div>
                                  <p className="text-xs text-deal-navy leading-relaxed">{locale === 'fr' && complaint.adminReplyFr ? complaint.adminReplyFr : complaint.adminReply}</p>
                                </div>
                              )}
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-deal-navy">{t.dashboard.reply}</label>
                                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={t.dashboard.replyPlaceholder} rows={3} className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal text-deal-navy placeholder:text-muted-foreground resize-none" dir={locale === 'ar' ? 'rtl' : 'ltr'} />
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={!replyText.trim() || replyLoading === complaint.id} onClick={() => handleReplyComplaint(complaint)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-deal-teal to-teal-600 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50">
                                  {replyLoading === complaint.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}{t.dashboard.submitReply}
                                </motion.button>
                              </div>
                              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                <span className="text-[10px] font-bold text-muted-foreground self-center me-2">{t.admin.status}:</span>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={statusLoading === complaint.id || complaint.status === 'RESOLVED'} onClick={() => handleStatusChange(complaint.id, 'RESOLVED')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] font-bold shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-40">{statusLoading === complaint.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}{t.dashboard.markResolved}</motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={statusLoading === complaint.id || complaint.status === 'IN_PROGRESS'} onClick={() => handleStatusChange(complaint.id, 'IN_PROGRESS')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold shadow-sm hover:bg-amber-600 transition-colors disabled:opacity-40">{statusLoading === complaint.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}{t.dashboard.markInProgress}</motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={statusLoading === complaint.id || complaint.status === 'REJECTED'} onClick={() => handleStatusChange(complaint.id, 'REJECTED')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-[10px] font-bold shadow-sm hover:bg-red-600 transition-colors disabled:opacity-40">{statusLoading === complaint.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}{t.dashboard.rejectComplaint}</motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════
  // TAB: Messages (keep existing)
  // ══════════════════════════════════════
  if (dashboardActiveTab === 'messages') {
    return (
      <div className="space-y-6">
        <TabHeader icon={MessageCircle} iconColor="text-deal-teal" badgeColor="bg-deal-teal/20" badge={t.dashboard.messages} title={t.dashboard.messages} subtitle={locale === 'ar' ? 'تواصل مع مستخدمي المنصة' : 'Communiquez avec les utilisateurs de la plateforme'} onRefresh={() => { fetchAllUsers(); fetchConversations(); }} loading={loadingMessages} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 card-3d rounded-2xl bg-white overflow-hidden">
          <div className="border-e border-gray-100">
            <div className="p-3 border-b border-gray-100"><h3 className="text-xs font-bold text-muted-foreground">{locale === 'ar' ? 'المستخدمون' : 'Utilisateurs'}</h3></div>
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              {loadingMessages ? <LoadingSpinner text="" /> : allUsers.filter(u => u.id !== currentUser?.id).length === 0 ? <EmptyState icon={Users} message={t.dashboard.noConversations} /> : (
                allUsers.filter(u => u.id !== currentUser?.id).map((user) => {
                  const isSelected = selectedChatUser?.id === user.id;
                  const userName = getUserName(user);
                  const lastConv = conversations.find(c => c.otherUserId === user.id);
                  return (
                    <motion.button key={user.id} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }} onClick={() => { setSelectedChatUser(user); fetchChatMessages(user.id); }} className={`w-full flex items-center gap-3 px-3 py-3 border-b border-gray-50 transition-colors ${isSelected ? 'bg-deal-teal/5 border-s-2 border-s-deal-teal' : 'hover:bg-gray-50'}`}>
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center"><span className="text-white font-bold text-sm">{userName.charAt(0)}</span></div>
                        {lastConv && lastConv.unreadCount > 0 && <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{lastConv.unreadCount}</span>}
                      </div>
                      <div className="flex-1 min-w-0 text-start">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs text-deal-navy truncate">{userName}</p>
                          <span className={`text-[9px] font-bold ${getRoleConf(user.role).text}`}>{locale === 'ar' ? getRoleName(user.role).ar : getRoleName(user.role).fr}</span>
                        </div>
                        {lastConv && <p className="text-[10px] text-muted-foreground truncate mt-0.5">{lastConv.lastMessage}</p>}
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col">
            {selectedChatUser ? (
              <>
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center"><span className="text-white font-bold text-sm">{getUserName(selectedChatUser).charAt(0)}</span></div>
                  <div><p className="font-bold text-sm text-deal-navy">{getUserName(selectedChatUser)}</p><p className="text-[10px] text-muted-foreground">{selectedChatUser.email}</p></div>
                </div>
                <div className="flex-1 p-4 max-h-[400px] overflow-y-auto custom-scrollbar space-y-3">
                  {loadingChat ? <LoadingSpinner text="" /> : chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center"><MessageCircle className="w-10 h-10 text-gray-300 mb-2" /><p className="text-xs text-muted-foreground">{t.dashboard.noMessagesYet}</p></div>
                  ) : (
                    chatMessages.map((msg) => {
                      const isMine = msg.senderId === currentUser?.id;
                      return (
                        <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isMine ? 'bg-gradient-to-r from-deal-teal to-teal-600 text-white rounded-ee-sm' : 'bg-gray-100 text-deal-navy rounded-es-sm'}`}>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <p className={`text-[9px] mt-1 ${isMine ? 'text-white/60' : 'text-muted-foreground'}`}>{new Date(msg.createdAt).toLocaleTimeString(locale === 'ar' ? 'ar-DZ' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder={t.dashboard.typeMessage} className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal text-deal-navy placeholder:text-muted-foreground" dir={locale === 'ar' ? 'rtl' : 'ltr'} />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={!messageInput.trim() || sendingMessage} onClick={handleSendMessage} className="w-10 h-10 rounded-xl bg-gradient-to-r from-deal-teal to-teal-600 flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50">{sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-deal-teal/10 flex items-center justify-center mb-4"><MessageCircle className="w-8 h-8 text-deal-teal" /></div>
                <p className="text-sm font-bold text-deal-navy">{locale === 'ar' ? 'اختر مستخدمًا لبدء المحادثة' : 'Choisissez un utilisateur pour commencer'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════
  // TAB: Users (Enhanced)
  // ══════════════════════════════════════
  if (dashboardActiveTab === 'users') {
    return (
      <div className="space-y-6">
        <TabHeader icon={Users} iconColor="text-deal-teal" badgeColor="bg-deal-teal/20" badge={t.dashboard.manageUsers} title={t.dashboard.manageUsers} subtitle={locale === 'ar' ? 'إدارة جميع المستخدمين المسجلين' : 'Gérer tous les utilisateurs inscrits'} onRefresh={() => fetchUsers(userSearch || undefined, roleFilter)} loading={loadingUsers} />

        {/* Role count cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { role: 'customer', icon: Users, bg: 'bg-deal-orange/10', iconColor: 'text-deal-orange' },
            { role: 'craftsman', icon: Wrench, bg: 'bg-deal-teal/10', iconColor: 'text-deal-teal' },
            { role: 'merchant', icon: Package, bg: 'bg-deal-gold/10', iconColor: 'text-deal-gold-dark' },
            { role: 'equipment_owner', icon: Truck, bg: 'bg-purple-50', iconColor: 'text-purple-500' },
          ].map((card, i) => {
            const count = userRoleCounts[card.role] || 0;
            const Icon = card.icon;
            return (
              <motion.div key={card.role} custom={i} variants={fadeInUp} initial="hidden" animate="visible" whileHover={{ y: -2 }} className="rounded-xl p-3 bg-white border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}><Icon className={`w-4 h-4 ${card.iconColor}`} /></div>
                  <span className="text-[10px] font-bold text-muted-foreground">{locale === 'ar' ? getRoleName(card.role).ar : getRoleName(card.role).fr}</span>
                </div>
                <p className="text-lg font-black text-deal-navy">{count}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
              <input type="text" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder={locale === 'ar' ? 'ابحث بالاسم أو البريد...' : 'Rechercher par nom ou email...'} className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground" dir={locale === 'ar' ? 'rtl' : 'ltr'} />
            </div>
            <div className="relative">
              <Filter className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="ps-9 pe-8 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy appearance-none cursor-pointer min-w-[130px]">
                <option value="all">{locale === 'ar' ? 'جميع الأدوار' : 'Tous les rôles'}</option>
                <option value="customer">{locale === 'ar' ? 'عملاء' : 'Clients'}</option>
                <option value="craftsman">{locale === 'ar' ? 'حرفيون' : 'Artisans'}</option>
                <option value="merchant">{locale === 'ar' ? 'تجار' : 'Commerçants'}</option>
                <option value="equipment_owner">{locale === 'ar' ? 'مؤجر معدات' : 'Loueurs'}</option>
                <option value="admin">{locale === 'ar' ? 'مديرون' : 'Admins'}</option>
              </select>
              <ChevronDown className="absolute top-1/2 -translate-y-1/2 end-3 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 pe-8 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy appearance-none cursor-pointer min-w-[120px]">
                <option value="all">{locale === 'ar' ? 'الحالة' : 'Statut'}</option>
                <option value="active">{locale === 'ar' ? 'نشط' : 'Actif'}</option>
                <option value="inactive">{locale === 'ar' ? 'معطل' : 'Désactivé'}</option>
              </select>
              <ChevronDown className="absolute top-1/2 -translate-y-1/2 end-3 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)} className="px-3 pe-8 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy appearance-none cursor-pointer min-w-[120px]">
                <option value="all">{locale === 'ar' ? 'التوثيق' : 'Vérif.'}</option>
                <option value="verified">{locale === 'ar' ? 'موثق' : 'Vérifié'}</option>
                <option value="unverified">{locale === 'ar' ? 'غير موثق' : 'Non vérifié'}</option>
              </select>
              <ChevronDown className="absolute top-1/2 -translate-y-1/2 end-3 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Users List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          {loadingUsers ? <LoadingSpinner text={t.common.loading} /> : filteredUsers.length === 0 ? <EmptyState icon={Users} message={t.common.noResults} /> : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-muted-foreground">{filteredUsers.length} {locale === 'ar' ? 'مستخدم' : 'utilisateurs'}</span>
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                {filteredUsers.map((user, i) => {
                  const rConf = getRoleConf(user.role);
                  const rName = getRoleName(user.role);
                  const isExpanded = expandedUserId === user.id;
                  return (
                    <motion.div key={user.id} custom={i} variants={fadeInUp} initial="hidden" animate="visible" className="rounded-xl border border-gray-100 overflow-hidden">
                      <div className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => handleExpandUser(user.id)}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center flex-shrink-0"><span className="text-white text-xs font-bold">{getUserName(user).charAt(0)}</span></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-sm text-deal-navy truncate">{getUserName(user)}</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${rConf.bg} ${rConf.text}`}>{locale === 'ar' ? rName.ar : rName.fr}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {user.isActive ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600"><ShieldCheck className="w-3 h-3" />{locale === 'ar' ? 'نشط' : 'Act.'}</span> : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500"><ShieldX className="w-3 h-3" />{locale === 'ar' ? 'معطل' : 'Susp.'}</span>}
                            {user.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">{isExpanded ? <ChevronUp className="w-3 h-3 text-gray-500" /> : <ChevronDown className="w-3 h-3 text-gray-500" />}</motion.button>
                          </div>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                            <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                              {loadingDetail ? <LoadingSpinner text="" /> : expandedUserDetail ? (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="w-3.5 h-3.5" /><span>{expandedUserDetail.email}</span></div>
                                      {expandedUserDetail.phone && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="w-3.5 h-3.5" /><span dir="ltr">{expandedUserDetail.phone}</span></div>}
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="w-3.5 h-3.5" /><span>{expandedUserDetail.wilaya}, {expandedUserDetail.city}</span></div>
                                      <div className="flex items-center gap-2 text-xs"><Star className="w-3.5 h-3.5 text-deal-gold fill-deal-gold" /><span className="font-bold text-deal-navy">{expandedUserDetail.rating || 0}</span><span className="text-muted-foreground">({expandedUserDetail.totalReviews} {t.common.reviewsCount})</span></div>
                                    </div>
                                    <div className="space-y-2">
                                      {expandedUserDetail.specialties && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Briefcase className="w-3.5 h-3.5" /><span>{expandedUserDetail.specialties}</span></div>}
                                      {expandedUserDetail.experience && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="w-3.5 h-3.5" /><span>{expandedUserDetail.experience} {locale === 'ar' ? 'سنوات خبرة' : "ans d'expérience"}</span></div>}
                                      {expandedUserDetail.hourlyRate && <div className="flex items-center gap-2 text-xs text-muted-foreground"><DollarSign className="w-3.5 h-3.5" /><span>{expandedUserDetail.hourlyRate.toLocaleString()} {t.common.currency}/{locale === 'ar' ? 'ساعة' : 'h'}</span></div>}
                                      {(expandedUserDetail.shopName || expandedUserDetail.shopNameFr) && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Package className="w-3.5 h-3.5" /><span>{getLocalizedValue(expandedUserDetail.shopName, expandedUserDetail.shopNameFr)}</span></div>}
                                    </div>
                                  </div>
                                  {(expandedUserDetail.bio || expandedUserDetail.bioFr) && <p className="text-xs text-muted-foreground leading-relaxed bg-gray-50 rounded-lg p-2.5">{getLocalizedValue(expandedUserDetail.bio, expandedUserDetail.bioFr)}</p>}
                                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <span className="text-[10px] text-muted-foreground">{new Date(expandedUserDetail.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-FR')}</span>
                                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                      {user.role !== 'ADMIN' && (
                                        <>
                                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={actionLoading === user.id} onClick={() => handleToggleActive(user.id, user.isActive)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors disabled:opacity-50 ${user.isActive ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'}`}>{actionLoading === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : user.isActive ? <><PowerOff className="w-3 h-3" />{locale === 'ar' ? 'تعطيل' : 'Désact.'}</> : <><Power className="w-3 h-3" />{locale === 'ar' ? 'تفعيل' : 'Activ.'}</>}</motion.button>
                                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={actionLoading === user.id} onClick={() => handleToggleVerified(user.id, user.isVerified)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors disabled:opacity-50 ${user.isVerified ? 'bg-red-100 text-red-500 hover:bg-red-200' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}>{actionLoading === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : user.isVerified ? <><ShieldX className="w-3 h-3" />{locale === 'ar' ? 'إلغاء التوثيق' : 'Dévérifier'}</> : <><ShieldCheck className="w-3 h-3" />{locale === 'ar' ? 'توثيق' : 'Vérifier'}</>}</motion.button>
                                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={actionLoading === user.id} onClick={() => handleDeleteUser(user.id, getUserName(user))} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500 text-white text-[10px] font-bold shadow-sm hover:bg-red-600 transition-colors disabled:opacity-50">{actionLoading === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Trash2 className="w-3 h-3" />{t.common.delete}</>}</motion.button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : <p className="text-xs text-muted-foreground text-center py-2">{locale === 'ar' ? 'لم يتم العثور' : 'Non trouvé'}</p>}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════
  // TAB: Content Management
  // ══════════════════════════════════════
  if (dashboardActiveTab === 'content') {
    return (
      <div className="space-y-6">
        <TabHeader icon={LayoutGrid} iconColor="text-purple-400" badgeColor="bg-purple-500/20" badge={locale === 'ar' ? 'إدارة المحتوى' : 'Gestion du contenu'} title={locale === 'ar' ? 'إدارة المحتوى' : 'Gestion du contenu'} subtitle={locale === 'ar' ? 'عرض وإدارة الخدمات والمنتجات والمعدات' : 'Afficher et gérer les services, produits et équipements'} onRefresh={() => fetchContent(contentTab, contentSearch || undefined)} loading={contentLoading} />

        {/* Sub-tabs */}
        <div className="flex gap-2">
          {(Object.keys(contentTabLabels) as Array<keyof typeof contentTabLabels>).map((tab) => {
            const TabIcon = contentTabLabels[tab].icon;
            const isActive = contentTab === tab;
            return (
              <motion.button key={tab} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { setContentTab(tab); setContentSearch(''); }} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-deal-navy text-white shadow-md' : 'bg-white text-deal-navy border border-gray-200 hover:border-gray-300'}`}>
                <TabIcon className="w-4 h-4" />{locale === 'ar' ? contentTabLabels[tab].ar : contentTabLabels[tab].fr}
              </motion.button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-muted-foreground" />
          <input type="text" value={contentSearch} onChange={(e) => setContentSearch(e.target.value)} placeholder={locale === 'ar' ? 'ابحث في المحتوى...' : 'Rechercher dans le contenu...'} className="w-full ps-10 pe-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-navy/30 focus:border-deal-navy text-deal-navy placeholder:text-muted-foreground shadow-sm" dir={locale === 'ar' ? 'rtl' : 'ltr'} />
        </div>

        {/* Content List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          {contentLoading ? <LoadingSpinner text={t.common.loading} /> : contentItems.length === 0 ? <EmptyState icon={LayoutGrid} message={locale === 'ar' ? 'لا يوجد محتوى' : 'Aucun contenu'} /> : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-muted-foreground">{contentItems.length} {locale === 'ar' ? 'عنصر' : 'élément(s)'}</span>
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                {contentItems.map((item, i) => {
                  const title = getLocalizedValue(item.title, item.titleFr);
                  const ContentIcon = contentTabLabels[contentTab].icon;
                  return (
                    <motion.div key={item.id} custom={i} variants={fadeInUp} initial="hidden" animate="visible" className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deal-navy to-deal-navy-dark flex items-center justify-center flex-shrink-0"><ContentIcon className="w-5 h-5 text-white" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-deal-navy truncate">{title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.providerName && <span className="text-[10px] text-muted-foreground">{item.providerName}</span>}
                          <span className="text-[10px] font-bold text-deal-orange">{item.price.toLocaleString()} {t.common.currency}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${item.isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                          {item.isAvailable ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                          {item.isAvailable ? (locale === 'ar' ? 'متاح' : 'Dispo.') : (locale === 'ar' ? 'غير متاح' : 'Indispo.')}
                        </span>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={contentActionLoading === item.id} onClick={() => handleToggleContentAvailability(contentTab, item.id, item.isAvailable)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50" title={locale === 'ar' ? 'تبديل التوفر' : 'Basculer'}>{contentActionLoading === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3 text-gray-500" />}</motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={contentActionLoading === item.id} onClick={() => handleDeleteContent(contentTab, item.id, title)} className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors disabled:opacity-50" title={t.common.delete}>{contentActionLoading === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3 text-red-500" />}</motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════
  // TAB: Categories (Real CRUD)
  // ══════════════════════════════════════
  if (dashboardActiveTab === 'categories') {
    return (
      <div className="space-y-6">
        <TabHeader icon={FolderTree} iconColor="text-deal-teal" badgeColor="bg-deal-teal/20" badge={t.dashboard.manageCategories} title={t.dashboard.manageCategories} subtitle={locale === 'ar' ? 'إضافة وتعديل وحذف فئات الخدمات والمنتجات' : 'Ajouter, modifier et supprimer les catégories'} onRefresh={() => { fetchServiceCategories(); fetchProductCategories(); }} loading={catsLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2"><h3 className="text-lg font-bold text-deal-navy">{t.dashboard.serviceCategories}</h3><Wrench className="w-5 h-5 text-deal-orange" /></div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddServiceCat(!showAddServiceCat)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-deal-teal text-white text-xs font-bold shadow-sm hover:bg-deal-teal/90 transition-colors"><Plus className="w-3.5 h-3.5" />{t.common.add}</motion.button>
            </div>

            {/* Add form */}
            <AnimatePresence>
              {showAddServiceCat && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={newServiceCat.name} onChange={(e) => setNewServiceCat({ ...newServiceCat, name: e.target.value })} placeholder={locale === 'ar' ? 'الاسم (عربي)' : 'Nom (Ar)'} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 text-deal-navy" />
                      <input type="text" value={newServiceCat.nameFr} onChange={(e) => setNewServiceCat({ ...newServiceCat, nameFr: e.target.value })} placeholder={locale === 'ar' ? 'الاسم (فرنسي)' : 'Nom (Fr)'} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 text-deal-navy" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={newServiceCat.icon} onChange={(e) => setNewServiceCat({ ...newServiceCat, icon: e.target.value })} placeholder={locale === 'ar' ? 'الأيقونة (إيموجي)' : 'Icône (emoji)'} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 text-deal-navy" />
                      <input type="number" value={newServiceCat.sortOrder} onChange={(e) => setNewServiceCat({ ...newServiceCat, sortOrder: parseInt(e.target.value) || 0 })} placeholder={locale === 'ar' ? 'ترتيب' : 'Ordre'} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 text-deal-navy" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={newServiceCat.description} onChange={(e) => setNewServiceCat({ ...newServiceCat, description: e.target.value })} placeholder={locale === 'ar' ? 'الوصف (عربي)' : 'Desc. (Ar)'} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 text-deal-navy" />
                      <input type="text" value={newServiceCat.descriptionFr} onChange={(e) => setNewServiceCat({ ...newServiceCat, descriptionFr: e.target.value })} placeholder={locale === 'ar' ? 'الوصف (فرنسي)' : 'Desc. (Fr)'} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 text-deal-navy" />
                    </div>
                    <div className="flex gap-2">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={catActionLoading === 'add-service'} onClick={() => handleAddCategory('service')} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-deal-teal text-white text-xs font-bold disabled:opacity-50">{catActionLoading === 'add-service' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}{t.common.save}</motion.button>
                      <button onClick={() => setShowAddServiceCat(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-deal-navy text-xs font-bold">{t.common.cancel}</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {serviceCategories.length === 0 ? (
                <EmptyState icon={FolderTree} message={locale === 'ar' ? 'لا توجد فئات خدمات' : 'Aucune catégorie de services'} />
              ) : serviceCategories.map((cat, i) => (
                <motion.div key={cat.id} custom={i} variants={fadeInUp} initial="hidden" animate="visible" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="text-2xl">{cat.icon || '📁'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-deal-navy">{getLocalizedValue(cat.name, cat.nameFr)}</p>
                    <p className="text-[10px] text-muted-foreground">{locale === 'ar' ? 'ترتيب' : 'Ordre'}: {cat.sortOrder} · {cat._count?.services || 0} {locale === 'ar' ? 'خدمة' : 'services'}</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={catActionLoading === cat.id} onClick={() => handleDeleteCategory('service', cat.id, cat.name)} className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors disabled:opacity-50">{catActionLoading === cat.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3 text-red-500" />}</motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Product Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2"><h3 className="text-lg font-bold text-deal-navy">{t.dashboard.productCategories}</h3><Package className="w-5 h-5 text-deal-teal" /></div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddProductCat(!showAddProductCat)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-deal-teal text-white text-xs font-bold shadow-sm hover:bg-deal-teal/90 transition-colors"><Plus className="w-3.5 h-3.5" />{t.common.add}</motion.button>
            </div>

            <AnimatePresence>
              {showAddProductCat && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={newProductCat.name} onChange={(e) => setNewProductCat({ ...newProductCat, name: e.target.value })} placeholder={locale === 'ar' ? 'الاسم (عربي)' : 'Nom (Ar)'} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 text-deal-navy" />
                      <input type="text" value={newProductCat.nameFr} onChange={(e) => setNewProductCat({ ...newProductCat, nameFr: e.target.value })} placeholder={locale === 'ar' ? 'الاسم (فرنسي)' : 'Nom (Fr)'} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 text-deal-navy" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={newProductCat.icon} onChange={(e) => setNewProductCat({ ...newProductCat, icon: e.target.value })} placeholder={locale === 'ar' ? 'الأيقونة (إيموجي)' : 'Icône (emoji)'} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 text-deal-navy" />
                      <input type="number" value={newProductCat.sortOrder} onChange={(e) => setNewProductCat({ ...newProductCat, sortOrder: parseInt(e.target.value) || 0 })} placeholder={locale === 'ar' ? 'ترتيب' : 'Ordre'} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 text-deal-navy" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={newProductCat.description} onChange={(e) => setNewProductCat({ ...newProductCat, description: e.target.value })} placeholder={locale === 'ar' ? 'الوصف (عربي)' : 'Desc. (Ar)'} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 text-deal-navy" />
                      <input type="text" value={newProductCat.descriptionFr} onChange={(e) => setNewProductCat({ ...newProductCat, descriptionFr: e.target.value })} placeholder={locale === 'ar' ? 'الوصف (فرنسي)' : 'Desc. (Fr)'} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 text-deal-navy" />
                    </div>
                    <div className="flex gap-2">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={catActionLoading === 'add-product'} onClick={() => handleAddCategory('product')} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-deal-teal text-white text-xs font-bold disabled:opacity-50">{catActionLoading === 'add-product' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}{t.common.save}</motion.button>
                      <button onClick={() => setShowAddProductCat(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-deal-navy text-xs font-bold">{t.common.cancel}</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {productCategories.length === 0 ? (
                <EmptyState icon={FolderTree} message={locale === 'ar' ? 'لا توجد فئات منتجات' : 'Aucune catégorie de produits'} />
              ) : productCategories.map((cat, i) => (
                <motion.div key={cat.id} custom={i} variants={fadeInUp} initial="hidden" animate="visible" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="text-2xl">{cat.icon || '📦'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-deal-navy">{getLocalizedValue(cat.name, cat.nameFr)}</p>
                    <p className="text-[10px] text-muted-foreground">{locale === 'ar' ? 'ترتيب' : 'Ordre'}: {cat.sortOrder} · {cat._count?.products || 0} {locale === 'ar' ? 'منتج' : 'produits'}</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={catActionLoading === cat.id} onClick={() => handleDeleteCategory('product', cat.id, cat.name)} className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors disabled:opacity-50">{catActionLoading === cat.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3 text-red-500" />}</motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════
  // TAB: Reports
  // ══════════════════════════════════════
  if (dashboardActiveTab === 'reports') {
    const maxVal = Math.max(apiStats?.users?.customers || 1, apiStats?.users?.craftsmen || 1, apiStats?.users?.merchants || 1, apiStats?.users?.equipmentOwners || 1, apiStats?.users?.admins || 1);
    const maxContent = Math.max(apiStats?.services || 1, apiStats?.products || 1, apiStats?.equipment || 1);

    return (
      <div className="space-y-6">
        <TabHeader icon={BarChart3} iconColor="text-deal-gold" badgeColor="bg-deal-gold/20" badge={t.dashboard.viewReports} title={t.dashboard.platformStats} subtitle={locale === 'ar' ? 'إحصائيات شاملة للمنصة' : 'Statistiques complètes de la plateforme'} onRefresh={fetchStats} loading={statsLoading} />

        {/* Key number cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: locale === 'ar' ? 'الشكاوى المعلقة' : 'Réclamations en attente', value: apiStats?.pendingComplaints || 0, icon: AlertTriangle, bg: 'bg-orange-100', iconColor: 'text-orange-600' },
            { label: t.dashboard.totalBookings, value: apiStats?.bookings || 0, icon: ShoppingCart, bg: 'bg-deal-teal/10', iconColor: 'text-deal-teal' },
            { label: t.dashboard.totalOrders, value: apiStats?.orders || 0, icon: FileText, bg: 'bg-deal-gold/10', iconColor: 'text-deal-gold-dark' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} custom={i} variants={fadeInUp} initial="hidden" animate="visible" whileHover={{ y: -2 }} className="rounded-2xl p-4 bg-white border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}><Icon className={`w-5 h-5 ${stat.iconColor}`} /></div>
                  <div><p className="text-2xl font-black text-deal-navy">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart: Users by role */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
            <h3 className="text-lg font-bold text-deal-navy mb-5">{locale === 'ar' ? 'المستخدمون حسب الدور' : 'Utilisateurs par rôle'}</h3>
            {statsLoading ? <LoadingSpinner text="" /> : (
              <div className="space-y-3">
                {[
                  { label: t.dashboard.customers, value: apiStats?.users?.customers || 0, color: 'bg-deal-orange' },
                  { label: t.dashboard.craftsmen, value: apiStats?.users?.craftsmen || 0, color: 'bg-deal-teal' },
                  { label: t.dashboard.merchants, value: apiStats?.users?.merchants || 0, color: 'bg-deal-gold' },
                  { label: t.dashboard.equipmentOwners, value: apiStats?.users?.equipmentOwners || 0, color: 'bg-purple-500' },
                  { label: t.dashboard.platformSettings, value: apiStats?.users?.admins || 0, color: 'bg-red-500' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1"><span className="text-xs font-medium text-deal-navy">{item.label}</span><span className="text-xs font-bold text-deal-navy">{item.value}</span></div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.max((item.value / maxVal) * 100, 2)}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className={`h-full rounded-full ${item.color}`} /></div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Bar chart: Content count */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
            <h3 className="text-lg font-bold text-deal-navy mb-5">{locale === 'ar' ? 'المحتوى حسب النوع' : 'Contenu par type'}</h3>
            {statsLoading ? <LoadingSpinner text="" /> : (
              <div className="space-y-3">
                {[
                  { label: t.dashboard.serviceCategories, value: apiStats?.services || 0, color: 'bg-deal-orange' },
                  { label: t.dashboard.productCategories, value: apiStats?.products || 0, color: 'bg-deal-teal' },
                  { label: t.dashboard.totalEquipment, value: apiStats?.equipment || 0, color: 'bg-purple-500' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1"><span className="text-xs font-medium text-deal-navy">{item.label}</span><span className="text-xs font-bold text-deal-navy">{item.value}</span></div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.max((item.value / maxContent) * 100, 2)}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className={`h-full rounded-full ${item.color}`} /></div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5"><h3 className="text-lg font-bold text-deal-navy">{t.dashboard.activityFeed}</h3><Activity className="w-5 h-5 text-muted-foreground" /></div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {!apiStats?.recentActivity || apiStats.recentActivity.length === 0 ? (
              <EmptyState icon={Activity} message={locale === 'ar' ? 'لا يوجد نشاط' : 'Aucune activité'} />
            ) : apiStats.recentActivity.map((item, i) => {
              const iconConf = activityIconMap[item.type] || activityIconMap.user;
              const Icon = iconConf.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeInUp} initial="hidden" animate="visible" className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${iconConf.color} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}><Icon className="w-4 h-4 text-white" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-deal-navy">{getLocalizedValue(item.text, item.textFr)}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(item.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════
  // TAB: Settings (Real Persistence)
  // ══════════════════════════════════════
  if (dashboardActiveTab === 'settings') {
    return (
      <div className="space-y-6">
        <TabHeader icon={Settings} iconColor="text-purple-400" badgeColor="bg-purple-500/20" badge={t.dashboard.platformSettings} title={t.dashboard.settings} subtitle={locale === 'ar' ? 'إعدادات المنصة العامة' : 'Paramètres généraux de la plateforme'} onRefresh={fetchSettings} loading={settingsLoading} />

        {settingsLoading ? <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-6"><LoadingSpinner text={t.common.loading} /></motion.div> : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-deal-navy mb-1.5 block">{t.dashboard.platformName}</label>
                <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal text-deal-navy" dir={locale === 'ar' ? 'rtl' : 'ltr'} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-deal-navy mb-1.5 block">{t.dashboard.contactEmail}</label>
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /><input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal text-deal-navy" dir="ltr" /></div>
                </div>
                <div>
                  <label className="text-xs font-bold text-deal-navy mb-1.5 block">{t.dashboard.supportPhone}</label>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><input type="tel" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal text-deal-navy" dir="ltr" /></div>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${maintenanceMode ? 'bg-red-500' : 'bg-gray-200'} flex items-center justify-center transition-colors`}>{maintenanceMode ? <PowerOff className="w-5 h-5 text-white" /> : <Power className="w-5 h-5 text-gray-400" />}</div>
                    <div><p className="text-sm font-bold text-deal-navy">{t.dashboard.maintenanceMode}</p><p className="text-[10px] text-muted-foreground">{maintenanceMode ? (locale === 'ar' ? 'الوضع النشط - المنصة غير متاحة' : 'Mode actif - Plateforme indisponible') : (locale === 'ar' ? 'الوضع العادي - المنصة متاحة' : 'Mode normal - Plateforme disponible')}</p></div>
                  </div>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setMaintenanceMode(!maintenanceMode)} className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}><motion.div animate={{ x: maintenanceMode ? 28 : 4 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" /></motion.button>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={settingsSaving} onClick={handleSaveSettings} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-deal-teal to-teal-600 text-white text-sm font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50">{settingsSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}{t.dashboard.saveSettings}</motion.button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════
  // TAB: Overview (default)
  // ══════════════════════════════════════
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-navy via-deal-navy-dark to-deal-navy p-6 text-white">
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full bg-deal-orange/20 blur-2xl" />
        <div className="absolute -bottom-10 -start-10 w-40 h-40 rounded-full bg-deal-teal/20 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-deal-teal" />
            <span className="text-xs font-bold text-deal-teal bg-deal-teal/20 px-2 py-0.5 rounded-full">{t.auth.admin}</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black">{t.dashboard.platformStats}</h2>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={statsLoading} onClick={fetchStats} className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"><RefreshCw className={`w-4 h-4 text-white ${statsLoading ? 'animate-spin' : ''}`} /></motion.button>
          </div>
          <p className="mt-1 text-white/70 text-sm sm:text-base">{t.dashboard.welcome} • {t.dashboard.today}</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {platformStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} custom={i} variants={fadeInUp} initial="hidden" animate="visible" whileHover={{ y: -4, scale: 1.03 }} className="card-3d rounded-2xl p-3 sm:p-4 bg-white text-center">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}><Icon className={`w-5 h-5 ${stat.iconColor}`} /></div>
              <p className="text-xl sm:text-2xl font-black text-deal-navy">{!statsLoading && <AnimatedCounter target={stat.value} duration={1000} />}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5 truncate">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users (from API) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5"><h3 className="text-lg font-bold text-deal-navy">{t.dashboard.recentUsers}</h3><Users className="w-5 h-5 text-muted-foreground" /></div>
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {statsLoading ? (
              <LoadingSpinner text="" />
            ) : !apiStats?.recentUsers || apiStats.recentUsers.length === 0 ? (
              <EmptyState icon={Users} message={locale === 'ar' ? 'لا يوجد مستخدمون' : 'Aucun utilisateur'} />
            ) : apiStats.recentUsers.map((user, i) => {
              const rConf = getRoleConf(user.role);
              const rName = getRoleName(user.role);
              const userName = getLocalizedValue(user.name, user.nameFr);
              return (
                <motion.div key={user.id} custom={i} variants={fadeInUp} initial="hidden" animate="visible" whileHover={{ x: 4 }} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center flex-shrink-0"><span className="text-white font-bold text-sm">{userName.charAt(0)}</span></div>
                  <div className="flex-1 min-w-0"><p className="font-bold text-sm text-deal-navy truncate">{userName}</p><p className="text-[10px] text-muted-foreground">{new Date(user.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-FR')}</p></div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${rConf.bg} ${rConf.text}`}>{locale === 'ar' ? rName.ar : rName.fr}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Activity Feed (from API) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="lg:col-span-2 card-3d rounded-2xl bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5"><h3 className="text-lg font-bold text-deal-navy">{t.dashboard.activityFeed}</h3><Activity className="w-5 h-5 text-muted-foreground" /></div>
          <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
            {statsLoading ? (
              <LoadingSpinner text="" />
            ) : !apiStats?.recentActivity || apiStats.recentActivity.length === 0 ? (
              <EmptyState icon={Activity} message={locale === 'ar' ? 'لا يوجد نشاط' : 'Aucune activité'} />
            ) : apiStats.recentActivity.map((item, i) => {
              const iconConf = activityIconMap[item.type] || activityIconMap.user;
              const Icon = iconConf.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeInUp} initial="hidden" animate="visible" whileHover={{ x: 4 }} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg ${iconConf.color} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}><Icon className="w-4 h-4 text-white" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-deal-navy leading-relaxed">{getLocalizedValue(item.text, item.textFr)}</p>
                    <div className="flex items-center gap-1 mt-1"><Clock className="w-3 h-3 text-muted-foreground" /><span className="text-[11px] text-muted-foreground">{new Date(item.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
        <h3 className="text-lg font-bold text-deal-navy mb-4">{t.dashboard.quickActions}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button key={action.label} custom={i} variants={fadeInUp} initial="hidden" animate="visible" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} onClick={action.action} className="text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all" style={{ background: action.gradient, boxShadow: action.shadow }}>
                <Icon className="w-4 h-4 inline-block me-2" />{action.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
