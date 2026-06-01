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
} from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import ProfileTabContent from './profile-tab-content';
import { AnimatedCounter } from '../animated-counter';
import { toast } from 'sonner';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' },
  }),
};

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

const complaintStatusConfig: Record<string, { bg: string; text: string; icon: typeof CheckCircle2; labelAr: string; labelFr: string }> = {
  PENDING: { bg: 'bg-orange-100', text: 'text-orange-600', icon: Clock4, labelAr: 'قيد الانتظار', labelFr: 'En attente' },
  IN_PROGRESS: { bg: 'bg-amber-100', text: 'text-amber-600', icon: Clock, labelAr: 'قيد المعالجة', labelFr: 'En cours' },
  RESOLVED: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: CheckCircle2, labelAr: 'تم الحل', labelFr: 'Résolu' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-500', icon: XCircle, labelAr: 'مرفوض', labelFr: 'Rejeté' },
};

export default function AdminDashboard() {
  const { t, getLocalizedValue, locale } = useI18n();
  const { dashboardActiveTab, currentUser, setDashboardActiveTab } = useAppStore();

  const [dbUsers, setDbUsers] = useState<DBUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // User management filters
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [expandedUserDetail, setExpandedUserDetail] = useState<DBUser | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Stats from API
  const [apiStats, setApiStats] = useState<{ users: Record<string, number>; services: number; products: number; equipment: number; bookings: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Complaints state
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [expandedComplaintId, setExpandedComplaintId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  // Messages state
  const [allUsers, setAllUsers] = useState<DBUser[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<DBUser | null>(null);
  const [chatMessages, setChatMessages] = useState<MessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchUsers = useCallback(async (search?: string, role?: string) => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (role && role !== 'all') params.set('role', role);
      const res = await fetch(`/api/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDbUsers(data);
      }
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
      if (res.ok) {
        const data = await res.json();
        setApiStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch complaints
  const fetchComplaints = useCallback(async () => {
    setLoadingComplaints(true);
    try {
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoadingComplaints(false);
    }
  }, []);

  // Fetch all users for messaging
  const fetchAllUsers = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Fetch conversations for admin
  const fetchConversations = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/messages?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  }, [currentUser]);

  // Fetch chat messages
  const fetchChatMessages = useCallback(async (otherUserId: string) => {
    if (!currentUser) return;
    setLoadingChat(true);
    try {
      const res = await fetch(`/api/messages?userId=${currentUser.id}&otherUserId=${otherUserId}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
        // Mark as read
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

  // Handle complaint reply
  const handleReplyComplaint = async (complaint: ComplaintItem) => {
    if (!replyText.trim()) return;
    setReplyLoading(complaint.id);
    try {
      const res = await fetch('/api/complaints?action=reply', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: complaint.id, adminReply: replyText, adminReplyFr: replyText }),
      });
      if (res.ok) {
        toast.success(locale === 'ar' ? t.dashboard.replySentSuccess : 'Réponse envoyée avec succès');
        setReplyText('');
        await fetchComplaints();
      }
    } catch {
      toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue');
    } finally {
      setReplyLoading(null);
    }
  };

  // Handle complaint status change
  const handleStatusChange = async (complaintId: string, status: string) => {
    setStatusLoading(complaintId);
    try {
      const res = await fetch('/api/complaints?action=status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: complaintId, status }),
      });
      if (res.ok) {
        toast.success(locale === 'ar' ? t.dashboard.statusUpdated : 'Statut mis à jour avec succès');
        await fetchComplaints();
      }
    } catch {
      toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue');
    } finally {
      setStatusLoading(null);
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!currentUser || !selectedChatUser || !messageInput.trim()) return;
    setSendingMessage(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: currentUser.id, receiverId: selectedChatUser.id, content: messageInput }),
      });
      if (res.ok) {
        setMessageInput('');
        await fetchChatMessages(selectedChatUser.id);
        await fetchConversations();
        toast.success(locale === 'ar' ? t.dashboard.messageSentSuccess : 'Message envoyé avec succès');
      }
    } catch {
      toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue');
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    if (dashboardActiveTab === 'users') {
      fetchUsers(userSearch || undefined, roleFilter);
    }
  }, [dashboardActiveTab, fetchUsers, userSearch, roleFilter]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (dashboardActiveTab === 'complaints') {
      fetchComplaints();
    }
  }, [dashboardActiveTab, fetchComplaints]);

  useEffect(() => {
    if (dashboardActiveTab === 'messages') {
      fetchAllUsers();
      fetchConversations();
    }
  }, [dashboardActiveTab, fetchAllUsers, fetchConversations]);

  const handleToggleActive = async (userId: string, currentState: boolean) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState }),
      });
      if (res.ok) {
        toast.success(
          !currentState
            ? (locale === 'ar' ? 'تم تفعيل الحساب' : 'Compte activé')
            : (locale === 'ar' ? 'تم تعطيل الحساب' : 'Compte désactivé')
        );
        await fetchUsers(userSearch || undefined, roleFilter);
        if (expandedUserId === userId) setExpandedUserId(null);
      }
    } catch {
      toast.error(locale === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: true }),
      });
      await fetchUsers(userSearch || undefined, roleFilter);
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: false }),
      });
      await fetchUsers(userSearch || undefined, roleFilter);
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  const handleExpandUser = async (userId: string) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      setExpandedUserDetail(null);
      return;
    }
    setExpandedUserId(userId);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setExpandedUserDetail(data as DBUser);
      }
    } catch (err) {
      console.error('Failed to fetch user detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Filtered users for display
  const filteredUsers = useMemo(() => {
    if (!userSearch) return dbUsers;
    const q = userSearch.toLowerCase();
    return dbUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.nameFr && u.nameFr.toLowerCase().includes(q)) ||
        u.email.toLowerCase().includes(q)
    );
  }, [dbUsers, userSearch]);

  // User role counts for stats cards
  const userRoleCounts = useMemo(() => {
    const counts: Record<string, { total: number; active: number; suspended: number }> = {};
    for (const u of dbUsers) {
      const role = u.role.toLowerCase();
      if (!counts[role]) counts[role] = { total: 0, active: 0, suspended: 0 };
      counts[role].total++;
      if (u.isActive) counts[role].active++;
      else counts[role].suspended++;
    }
    return counts;
  }, [dbUsers]);

  // Fallback stats
  const fallbackStats = [
    { label: t.dashboard.customers, value: '0', icon: Users, bg: 'bg-deal-orange/10', iconColor: 'text-deal-orange', key: 'customers' },
    { label: t.dashboard.craftsmen, value: '0', icon: Wrench, bg: 'bg-deal-teal/10', iconColor: 'text-deal-teal', key: 'craftsmen' },
    { label: t.dashboard.merchants, value: '0', icon: Package, bg: 'bg-deal-gold/10', iconColor: 'text-deal-gold-dark', key: 'merchants' },
    { label: t.dashboard.equipmentOwners, value: '0', icon: Truck, bg: 'bg-purple-50', iconColor: 'text-purple-500', key: 'equipmentOwners' },
    { label: t.dashboard.totalBookings, value: '0', icon: ShoppingCart, bg: 'bg-amber-50', iconColor: 'text-amber-600', key: 'bookings' },
    { label: t.dashboard.totalRevenueCount, value: '0', icon: DollarSign, bg: 'bg-emerald-50', iconColor: 'text-emerald-500', key: 'revenue' },
  ];

  const platformStats = apiStats
    ? [
        { label: t.dashboard.customers, value: String(apiStats.users.customers || 0), icon: Users, bg: 'bg-deal-orange/10', iconColor: 'text-deal-orange', key: 'customers' },
        { label: t.dashboard.craftsmen, value: String(apiStats.users.craftsmen || 0), icon: Wrench, bg: 'bg-deal-teal/10', iconColor: 'text-deal-teal', key: 'craftsmen' },
        { label: t.dashboard.merchants, value: String(apiStats.users.merchants || 0), icon: Package, bg: 'bg-deal-gold/10', iconColor: 'text-deal-gold-dark', key: 'merchants' },
        { label: t.dashboard.equipmentOwners, value: String(apiStats.users.equipmentOwners || 0), icon: Truck, bg: 'bg-purple-50', iconColor: 'text-purple-500', key: 'equipmentOwners' },
        { label: t.dashboard.totalBookings, value: String(apiStats.bookings || 0), icon: ShoppingCart, bg: 'bg-amber-50', iconColor: 'text-amber-600', key: 'bookings' },
        { label: t.dashboard.totalRevenueCount, value: String(apiStats.users.total || 0), icon: DollarSign, bg: 'bg-emerald-50', iconColor: 'text-emerald-500', key: 'revenue' },
      ]
    : fallbackStats;

  const statsReady = useMemo(() => !statsLoading, [statsLoading]);

  const recentUsers = [
    { id: '1', name: { ar: 'أحمد بن محمد', fr: 'Ahmed Ben Mohamed' }, role: 'craftsman', date: '2025-01-15' },
    { id: '2', name: { ar: 'فاطمة بوعلام', fr: 'Fatima Boualem' }, role: 'customer', date: '2025-01-15' },
    { id: '3', name: { ar: 'كريم مؤسسة البناء', fr: 'Karim Entreprise Bâtiment' }, role: 'merchant', date: '2025-01-14' },
    { id: '4', name: { ar: 'يوسف المعدات', fr: 'Youcef Équipements' }, role: 'equipment_owner', date: '2025-01-14' },
    { id: '5', name: { ar: 'سارة بن عمر', fr: 'Sara Ben Omar' }, role: 'customer', date: '2025-01-13' },
    { id: '6', name: { ar: 'نادر الدهان', fr: 'Nadir Peinture' }, role: 'craftsman', date: '2025-01-13' },
  ];

  const activityFeed = [
    { id: '1', icon: UserPlus, color: 'bg-deal-teal', text: { ar: 'أحمد بن محمد سجل كحرفي', fr: "Ahmed Ben Mohamed s'est inscrit en tant qu'artisan" }, time: { ar: 'منذ 5 دقائق', fr: 'Il y a 5 min' } },
    { id: '2', icon: CalendarCheck, color: 'bg-deal-orange', text: { ar: 'حجز جديد: تمديد كهربائي', fr: 'Nouvelle réservation: Installation électrique' }, time: { ar: 'منذ 15 دقيقة', fr: 'Il y a 15 min' } },
    { id: '3', icon: Star, color: 'bg-deal-gold', text: { ar: 'تقييم 5 نجوم لخدمة السباكة', fr: 'Avis 5 étoiles pour service de plomberie' }, time: { ar: 'منذ ساعة', fr: 'Il y a 1h' } },
    { id: '4', icon: ShoppingCart, color: 'bg-deal-teal', text: { ar: 'طلب جديد: 50 كيس إسمنت', fr: 'Nouvelle commande: 50 sacs de ciment' }, time: { ar: 'منذ ساعتين', fr: 'Il y a 2h' } },
    { id: '5', icon: UserPlus, color: 'bg-deal-orange', text: { ar: 'مؤسسة البناء الحديثة سجلت كتاجر', fr: "Entreprise Bâti Moderne s'est inscrite en tant que commerçant" }, time: { ar: 'منذ 3 ساعات', fr: 'Il y a 3h' } },
    { id: '6', icon: Truck, color: 'bg-deal-gold', text: { ar: 'إيجار جديد: حفارة كاتربيلر', fr: 'Nouvelle location: Excavatrice Caterpillar' }, time: { ar: 'منذ 4 ساعات', fr: 'Il y a 4h' } },
    { id: '7', icon: Star, color: 'bg-deal-teal', text: { ar: 'تقييم 4 نجوم لخدمة الدهان', fr: 'Avis 4 étoiles pour service de peinture' }, time: { ar: 'منذ 5 ساعات', fr: 'Il y a 5h' } },
    { id: '8', icon: CalendarCheck, color: 'bg-deal-orange', text: { ar: 'حجز مؤكد: تركيب تكييف', fr: 'Réservation confirmée: Installation climatisation' }, time: { ar: 'منذ 6 ساعات', fr: 'Il y a 6h' } },
  ];

  // Settings state
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [platformName, setPlatformName] = useState('DEAL');
  const [contactEmail, setContactEmail] = useState('contact@deal.dz');
  const [supportPhone, setSupportPhone] = useState('+213 37 XX XX XX');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = () => {
    setSettingsLoading(true);
    setTimeout(() => {
      toast.success(locale === 'ar' ? t.dashboard.settingsSaved : t.dashboard.settingsSaved);
      setSettingsLoading(false);
    }, 800);
  };

  // Category data derived from i18n
  const serviceCategoryList = useMemo(() => [
    { id: 'elec', ar: t.categories.electrical, fr: t.categories.electrical, icon: '⚡', color: 'bg-deal-orange/10', textColor: 'text-deal-orange' },
    { id: 'plumb', ar: t.categories.plumbing, fr: t.categories.plumbing, icon: '🔧', color: 'bg-deal-teal/10', textColor: 'text-deal-teal' },
    { id: 'build', ar: t.categories.construction, fr: t.categories.construction, icon: '🏗️', color: 'bg-deal-gold/10', textColor: 'text-deal-gold-dark' },
    { id: 'carp', ar: t.categories.carpentry, fr: t.categories.carpentry, icon: '🪚', color: 'bg-purple-100', textColor: 'text-purple-600' },
    { id: 'hvac', ar: t.categories.hvac, fr: t.categories.hvac, icon: '❄️', color: 'bg-blue-100', textColor: 'text-blue-600' },
    { id: 'metal', ar: t.categories.metalwork, fr: t.categories.metalwork, icon: '⚒️', color: 'bg-gray-100', textColor: 'text-gray-600' },
    { id: 'paint', ar: t.categories.painting, fr: t.categories.painting, icon: '🎨', color: 'bg-pink-100', textColor: 'text-pink-600' },
    { id: 'clean', ar: t.categories.cleaning, fr: t.categories.cleaning, icon: '🧹', color: 'bg-emerald-50', textColor: 'text-emerald-600' },
  ], [t.categories]);

  const productCategoryList = useMemo(() => [
    { id: 'building', ar: t.categories.building, fr: t.categories.building, icon: '🧱', color: 'bg-deal-teal/10', textColor: 'text-deal-teal' },
    { id: 'electrical_materials', ar: t.categories.electrical_materials, fr: t.categories.electrical_materials, icon: '🔌', color: 'bg-deal-orange/10', textColor: 'text-deal-orange' },
    { id: 'wood', ar: t.categories.wood, fr: t.categories.wood, icon: '🪵', color: 'bg-amber-100', textColor: 'text-amber-600' },
    { id: 'plumbing_materials', ar: t.categories.plumbing_materials, fr: t.categories.plumbing_materials, icon: '🚿', color: 'bg-blue-100', textColor: 'text-blue-600' },
    { id: 'paints', ar: t.categories.paints, fr: t.categories.paints, icon: '🎨', color: 'bg-pink-100', textColor: 'text-pink-600' },
    { id: 'tools', ar: t.categories.tools, fr: t.categories.tools, icon: '🔧', color: 'bg-gray-100', textColor: 'text-gray-600' },
  ], [t.categories]);

  const quickActions = [
    { label: t.dashboard.manageUsers, icon: UserCog, color: 'bg-deal-orange', action: () => setDashboardActiveTab('users') },
    { label: t.dashboard.manageCategories, icon: FolderTree, color: 'bg-deal-teal', action: () => setDashboardActiveTab('categories') },
    { label: t.dashboard.viewReports, icon: BarChart3, color: 'bg-deal-gold', action: () => setDashboardActiveTab('reports') },
  ];

  // --- Complaints Tab ---
  if (dashboardActiveTab === 'complaints') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-navy via-deal-navy-dark to-deal-navy p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full bg-amber-500/20 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full">{t.dashboard.complaints}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">{t.dashboard.complaints}</h2>
                <p className="mt-1 text-white/70 text-sm">{locale === 'ar' ? 'مراجعة وإدارة شكاوى المستخدمين' : 'Réviser et gérer les réclamations des utilisateurs'}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loadingComplaints}
                onClick={fetchComplaints}
                className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-white ${loadingComplaints ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Complaints List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          {loadingComplaints ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-deal-orange animate-spin" />
              <span className="ms-3 text-sm text-muted-foreground">{t.common.loading}</span>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{t.dashboard.noComplaints}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-muted-foreground">
                  {complaints.length} {locale === 'ar' ? 'شكوى' : 'réclamation(s)'}
                </span>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                {complaints.map((complaint, i) => {
                  const statusConf = complaintStatusConfig[complaint.status] || complaintStatusConfig.PENDING;
                  const StatusIcon = statusConf.icon;
                  const isExpanded = expandedComplaintId === complaint.id;
                  const userName = locale === 'fr' && complaint.user.nameFr ? complaint.user.nameFr : complaint.user.name;
                  return (
                    <motion.div
                      key={complaint.id}
                      custom={i}
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      className="rounded-xl border border-gray-100 hover:border-gray-200 overflow-hidden transition-all"
                    >
                      {/* Complaint Card Header */}
                      <div
                        className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                        onClick={() => setExpandedComplaintId(isExpanded ? null : complaint.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-deal-orange to-amber-400 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-xs">{userName.charAt(0)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-sm text-deal-navy truncate">{userName}</p>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${statusConf.bg} ${statusConf.text}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {locale === 'ar' ? statusConf.labelAr : statusConf.labelFr}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-deal-navy mt-0.5">
                                {locale === 'fr' && complaint.subjectFr ? complaint.subjectFr : complaint.subject}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                {locale === 'fr' && complaint.descriptionFr ? complaint.descriptionFr : complaint.description}
              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(complaint.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-FR')}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <Eye className="w-3.5 h-3.5 text-gray-500" />}
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Complaint Detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-4">
                              {/* Full Description */}
                              <div>
                                <h4 className="text-xs font-bold text-muted-foreground mb-1">{t.dashboard.description}</h4>
                                <p className="text-sm text-deal-navy leading-relaxed bg-gray-50 rounded-lg p-3">
                                  {locale === 'fr' && complaint.descriptionFr ? complaint.descriptionFr : complaint.description}
                                </p>
                              </div>

                              {/* User Info */}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{complaint.user.email}</span>
                                {complaint.user.phone && (
                                  <span className="ms-3 flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span dir="ltr">{complaint.user.phone}</span>
                                  </span>
                                )}
                              </div>

                              {/* Existing Admin Reply */}
                              {complaint.adminReply && (
                                <div className="rounded-lg bg-deal-teal/5 border border-deal-teal/20 p-3">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <MessageCircle className="w-3.5 h-3.5 text-deal-teal" />
                                    <span className="text-[10px] font-bold text-deal-teal">{t.dashboard.adminReply}</span>
                                  </div>
                                  <p className="text-xs text-deal-navy leading-relaxed">
                                    {locale === 'fr' && complaint.adminReplyFr ? complaint.adminReplyFr : complaint.adminReply}
                                  </p>
                                </div>
                              )}

                              {/* Reply Form */}
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-deal-navy">{t.dashboard.reply}</label>
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder={t.dashboard.replyPlaceholder}
                                  rows={3}
                                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal text-deal-navy placeholder:text-muted-foreground resize-none"
                                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                                />
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  disabled={!replyText.trim() || replyLoading === complaint.id}
                                  onClick={() => handleReplyComplaint(complaint)}
                                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-deal-teal to-teal-600 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                                >
                                  {replyLoading === complaint.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Send className="w-3.5 h-3.5" />
                                  )}
                                  {t.dashboard.submitReply}
                                </motion.button>
                              </div>

                              {/* Status Actions */}
                              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                <span className="text-[10px] font-bold text-muted-foreground self-center me-2">{t.admin.status}:</span>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  disabled={statusLoading === complaint.id || complaint.status === 'RESOLVED'}
                                  onClick={() => handleStatusChange(complaint.id, 'RESOLVED')}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] font-bold shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-40"
                                >
                                  {statusLoading === complaint.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                  {t.dashboard.markResolved}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  disabled={statusLoading === complaint.id || complaint.status === 'IN_PROGRESS'}
                                  onClick={() => handleStatusChange(complaint.id, 'IN_PROGRESS')}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold shadow-sm hover:bg-amber-600 transition-colors disabled:opacity-40"
                                >
                                  {statusLoading === complaint.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}
                                  {t.dashboard.markInProgress}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  disabled={statusLoading === complaint.id || complaint.status === 'REJECTED'}
                                  onClick={() => handleStatusChange(complaint.id, 'REJECTED')}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-[10px] font-bold shadow-sm hover:bg-red-600 transition-colors disabled:opacity-40"
                                >
                                  {statusLoading === complaint.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                  {t.dashboard.rejectComplaint}
                                </motion.button>
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

  // --- Messages Tab ---
  if (dashboardActiveTab === 'messages') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-navy via-deal-navy-dark to-deal-navy p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full bg-deal-teal/20 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-deal-teal" />
              <span className="text-xs font-bold text-deal-teal bg-deal-teal/20 px-2 py-0.5 rounded-full">{t.dashboard.messages}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">{t.dashboard.messages}</h2>
                <p className="mt-1 text-white/70 text-sm">{locale === 'ar' ? 'تواصل مع مستخدمي المنصة' : 'Communiquez avec les utilisateurs de la plateforme'}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loadingMessages}
                onClick={() => { fetchAllUsers(); fetchConversations(); }}
                className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-white ${loadingMessages ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Messages Layout: User list + Chat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 card-3d rounded-2xl bg-white overflow-hidden">
          {/* User List Panel */}
          <div className="border-e border-gray-100">
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-muted-foreground">{locale === 'ar' ? 'المستخدمون' : 'Utilisateurs'}</h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              {loadingMessages ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-deal-teal animate-spin" />
                </div>
              ) : allUsers.filter(u => u.id !== currentUser?.id).length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{t.dashboard.noConversations}</p>
                </div>
              ) : (
                allUsers
                  .filter(u => u.id !== currentUser?.id)
                  .map((user) => {
                    const isSelected = selectedChatUser?.id === user.id;
                    const userName = locale === 'fr' && user.nameFr ? user.nameFr : user.name;
                    const roleConf = roleColors[user.role] || roleColors.customer;
                    const roleName = roleLabels[user.role] || roleLabels.customer;
                    const lastConv = conversations.find(c => c.otherUserId === user.id);
                    return (
                      <motion.button
                        key={user.id}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedChatUser(user);
                          fetchChatMessages(user.id);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 border-b border-gray-50 transition-colors ${
                          isSelected
                            ? 'bg-deal-teal/5 border-s-2 border-s-deal-teal'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{userName.charAt(0)}</span>
                          </div>
                          {lastConv && lastConv.unreadCount > 0 && (
                            <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                              {lastConv.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-xs text-deal-navy truncate">{userName}</p>
                            <span className={`text-[9px] font-bold ${roleConf.text}`}>{locale === 'ar' ? roleName.ar : roleName.fr}</span>
                          </div>
                          {lastConv && (
                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">{lastConv.lastMessage}</p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="md:col-span-2 flex flex-col">
            {selectedChatUser ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {(locale === 'fr' && selectedChatUser.nameFr ? selectedChatUser.nameFr : selectedChatUser.name).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-deal-navy">
                      {locale === 'fr' && selectedChatUser.nameFr ? selectedChatUser.nameFr : selectedChatUser.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{selectedChatUser.email}</p>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 max-h-[400px] overflow-y-auto custom-scrollbar space-y-3">
                  {loadingChat ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 text-deal-teal animate-spin" />
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageCircle className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="text-xs text-muted-foreground">{t.dashboard.noMessagesYet}</p>
                    </div>
                  ) : (
                    chatMessages.map((msg) => {
                      const isMine = msg.senderId === currentUser?.id;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                            isMine
                              ? 'bg-gradient-to-r from-deal-teal to-teal-600 text-white rounded-ee-sm'
                              : 'bg-gray-100 text-deal-navy rounded-es-sm'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <p className={`text-[9px] mt-1 ${isMine ? 'text-white/60' : 'text-muted-foreground'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString(locale === 'ar' ? 'ar-DZ' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      placeholder={t.dashboard.typeMessage}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal text-deal-navy placeholder:text-muted-foreground"
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!messageInput.trim() || sendingMessage}
                      onClick={handleSendMessage}
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-deal-teal to-teal-600 flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                    >
                      {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-deal-teal/10 flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-deal-teal" />
                </div>
                <p className="text-sm font-bold text-deal-navy">{(t as unknown as { messagesAdmin: { selectUserToChat: string } }).messagesAdmin.selectUserToChat}</p>
                <p className="text-xs text-muted-foreground mt-1">{locale === 'ar' ? 'اختر مستخدمًا من القائمة لبدء المحادثة' : 'Choisissez un utilisateur dans la liste pour commencer'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Profile Tab ---
  if (dashboardActiveTab === 'profile') {
    return <ProfileTabContent role="admin" />;
  }

  // --- Users Management Tab ---
  if (dashboardActiveTab === 'users') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-navy via-deal-navy-dark to-deal-navy p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full bg-deal-teal/20 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-deal-teal" />
              <span className="text-xs font-bold text-deal-teal bg-deal-teal/20 px-2 py-0.5 rounded-full">{t.dashboard.manageUsers}</span>
            </div>
            <h2 className="text-2xl font-black">{t.dashboard.manageUsers}</h2>
            <p className="mt-1 text-white/70 text-sm">{locale === 'ar' ? 'إدارة جميع المستخدمين المسجلين' : 'Gérer tous les utilisateurs inscrits'}</p>
          </div>
        </motion.div>

        {/* User Count Stats by Role */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { role: 'customer', icon: Users, bg: 'bg-deal-orange/10', iconColor: 'text-deal-orange' },
            { role: 'craftsman', icon: Wrench, bg: 'bg-deal-teal/10', iconColor: 'text-deal-teal' },
            { role: 'merchant', icon: Package, bg: 'bg-deal-gold/10', iconColor: 'text-deal-gold-dark' },
            { role: 'equipment_owner', icon: Truck, bg: 'bg-purple-50', iconColor: 'text-purple-500' },
          ].map((card, i) => {
            const data = userRoleCounts[card.role] || { total: 0, active: 0, suspended: 0 };
            const Icon = card.icon;
            return (
              <motion.div
                key={card.role}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -2 }}
                className="rounded-xl p-3 bg-white border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {locale === 'ar' ? (roleLabels[card.role]?.ar || card.role) : (roleLabels[card.role]?.fr || card.role)}
                  </span>
                </div>
                <div className="flex items-end gap-3">
                  <div>
                    <p className="text-lg font-black text-deal-navy">{data.total}</p>
                    <p className="text-[9px] text-muted-foreground">{locale === 'ar' ? 'إجمالي' : 'Total'}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600">
                      {data.active} {locale === 'ar' ? 'نشط' : 'Act.'}
                    </span>
                    {data.suspended > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-500">
                        {data.suspended} {locale === 'ar' ? 'معطل' : 'Susp.'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${locale === 'ar' ? 'start-3' : 'start-3'}`} />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder={locale === 'ar' ? 'ابحث بالاسم أو البريد...' : 'Rechercher par nom ou email...'}
                className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy placeholder:text-muted-foreground"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            {/* Role Filter */}
            <div className="relative">
              <Filter className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${locale === 'ar' ? 'start-3' : 'start-3'}`} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="ps-9 pe-8 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-orange/30 focus:border-deal-orange text-deal-navy appearance-none cursor-pointer min-w-[140px]"
              >
                <option value="all">{locale === 'ar' ? 'جميع الأدوار' : 'Tous les rôles'}</option>
                <option value="customer">{locale === 'ar' ? 'عملاء' : 'Clients'}</option>
                <option value="craftsman">{locale === 'ar' ? 'حرفيون' : 'Artisans'}</option>
                <option value="merchant">{locale === 'ar' ? 'تجار' : 'Commerçants'}</option>
                <option value="equipment_owner">{locale === 'ar' ? 'مؤجر معدات' : 'Loueurs'}</option>
                <option value="admin">{locale === 'ar' ? 'مديرون' : 'Admins'}</option>
              </select>
              <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none ${locale === 'ar' ? 'end-3' : 'end-3'}`} />
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
          {loadingUsers ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-deal-orange animate-spin" />
              <span className="ms-3 text-sm text-muted-foreground">{t.common.loading}</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{t.common.noResults}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-muted-foreground">
                  {filteredUsers.length} {locale === 'ar' ? 'مستخدم' : 'utilisateurs'}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-start py-3 px-2 text-xs font-bold text-muted-foreground">{locale === 'ar' ? 'الاسم' : 'Nom'}</th>
                      <th className="text-start py-3 px-2 text-xs font-bold text-muted-foreground hidden sm:table-cell">Email</th>
                      <th className="text-start py-3 px-2 text-xs font-bold text-muted-foreground">{locale === 'ar' ? 'الدور' : 'Rôle'}</th>
                      <th className="text-start py-3 px-2 text-xs font-bold text-muted-foreground">{locale === 'ar' ? 'الحالة' : 'Statut'}</th>
                      <th className="text-end py-3 px-2 text-xs font-bold text-muted-foreground">{locale === 'ar' ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, i) => {
                      const role = roleColors[user.role] || roleColors.customer;
                      const roleName = roleLabels[user.role] || roleLabels.customer;
                      const userName = locale === 'fr' && user.nameFr ? user.nameFr : user.name;
                      const isExpanded = expandedUserId === user.id;
                      return (
                        <motion.tr
                          key={user.id}
                          custom={i}
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-3 px-2">
                            <button
                              onClick={() => handleExpandUser(user.id)}
                              className="flex items-center gap-2 hover:gap-3 transition-all"
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">{userName.charAt(0)}</span>
                              </div>
                              <div className="text-start min-w-0">
                                <span className="font-semibold text-deal-navy text-xs truncate block max-w-[120px]">{userName}</span>
                                <span className="text-[10px] text-muted-foreground sm:hidden truncate block max-w-[120px]">{user.email}</span>
                              </div>
                            </button>
                          </td>
                          <td className="py-3 px-2 text-xs text-muted-foreground hidden sm:table-cell truncate max-w-[160px]">{user.email}</td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${role.bg} ${role.text}`}>
                              {locale === 'ar' ? roleName.ar : roleName.fr}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              {user.isActive ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                  <ShieldCheck className="w-3 h-3" />
                                  {locale === 'ar' ? 'نشط' : 'Actif'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500">
                                  <ShieldX className="w-3 h-3" />
                                  {locale === 'ar' ? 'معطل' : 'Désactivé'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-end gap-1">
                              {/* View button */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleExpandUser(user.id)}
                                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                title={t.common.viewDetails}
                              >
                                <Eye className="w-3 h-3 text-gray-500" />
                              </motion.button>
                              {/* Toggle active */}
                              {user.role !== 'admin' && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  disabled={actionLoading === user.id}
                                  onClick={() => handleToggleActive(user.id, user.isActive)}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 ${
                                    user.isActive
                                      ? 'bg-amber-100 hover:bg-amber-200'
                                      : 'bg-emerald-100 hover:bg-emerald-200'
                                  }`}
                                  title={user.isActive
                                    ? (locale === 'ar' ? 'تعطيل الحساب' : 'Désactiver')
                                    : (locale === 'ar' ? 'تفعيل الحساب' : 'Activer')
                                  }
                                >
                                  {actionLoading === user.id ? (
                                    <Loader2 className="w-3 h-3 text-gray-500 animate-spin" />
                                  ) : user.isActive ? (
                                    <PowerOff className="w-3 h-3 text-amber-600" />
                                  ) : (
                                    <Power className="w-3 h-3 text-emerald-600" />
                                  )}
                                </motion.button>
                              )}
                              {/* Verify/Unverify */}
                              {!user.isVerified && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  disabled={actionLoading === user.id}
                                  onClick={() => handleApproveUser(user.id)}
                                  className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                  title={locale === 'ar' ? 'قبول' : 'Approuver'}
                                >
                                  {actionLoading === user.id ? <Loader2 className="w-3 h-3 text-white animate-spin" /> : <Check className="w-3 h-3 text-white" />}
                                </motion.button>
                              )}
                              {user.isVerified && user.role !== 'admin' && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  disabled={actionLoading === user.id}
                                  onClick={() => handleSuspendUser(user.id)}
                                  className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                                  title={locale === 'ar' ? 'سحب التوثيق' : 'Retirer vérification'}
                                >
                                  {actionLoading === user.id ? <Loader2 className="w-3 h-3 text-white animate-spin" /> : <Ban className="w-3 h-3 text-white" />}
                                </motion.button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Expanded User Detail */}
              <AnimatePresence>
                {expandedUserId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {loadingDetail ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-deal-orange animate-spin" />
                      </div>
                    ) : expandedUserDetail ? (
                      <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 space-y-5">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-deal-navy flex items-center gap-2">
                            <Award className="w-4 h-4 text-deal-orange" />
                            {locale === 'ar' ? 'تفاصيل المستخدم' : 'Détails de l\'utilisateur'}
                          </h4>
                          <button
                            onClick={() => setExpandedUserId(null)}
                            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                          >
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* User info */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {getLocalizedValue(expandedUserDetail.name, expandedUserDetail.nameFr).charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-bold text-deal-navy text-sm">
                                  {getLocalizedValue(expandedUserDetail.name, expandedUserDetail.nameFr)}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${(roleColors[expandedUserDetail.role] || roleColors.customer).bg} ${(roleColors[expandedUserDetail.role] || roleColors.customer).text}`}>
                                    {locale === 'ar' ? (roleLabels[expandedUserDetail.role] || roleLabels.customer).ar : (roleLabels[expandedUserDetail.role] || roleLabels.customer).fr}
                                  </span>
                                  {expandedUserDetail.isVerified && (
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{expandedUserDetail.email}</span>
                              </div>
                              {expandedUserDetail.phone && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Phone className="w-3.5 h-3.5" />
                                  <span dir="ltr">{expandedUserDetail.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{expandedUserDetail.wilaya}, {expandedUserDetail.city}</span>
                              </div>
                            </div>
                          </div>

                          {/* Professional Info */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs">
                              <Star className="w-3.5 h-3.5 text-deal-gold fill-deal-gold" />
                              <span className="font-bold text-deal-navy">{expandedUserDetail.rating || 0}</span>
                              <span className="text-muted-foreground">
                                ({expandedUserDetail.totalReviews} {t.common.reviewsCount})
                              </span>
                            </div>

                            {expandedUserDetail.specialties && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Briefcase className="w-3.5 h-3.5" />
                                <span>{expandedUserDetail.specialties}</span>
                              </div>
                            )}

                            {expandedUserDetail.experience && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{expandedUserDetail.experience} {locale === 'ar' ? 'سنوات خبرة' : "ans d'expérience"}</span>
                              </div>
                            )}

                            {expandedUserDetail.hourlyRate && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>{expandedUserDetail.hourlyRate.toLocaleString()} {t.common.currency}/{locale === 'ar' ? 'ساعة' : 'h'}</span>
                              </div>
                            )}

                            {(expandedUserDetail.shopName || expandedUserDetail.shopNameFr) && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Package className="w-3.5 h-3.5" />
                                <span>{getLocalizedValue(expandedUserDetail.shopName, expandedUserDetail.shopNameFr)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bio */}
                        {(expandedUserDetail.bio || expandedUserDetail.bioFr) && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {getLocalizedValue(expandedUserDetail.bio, expandedUserDetail.bioFr)}
                            </p>
                          </div>
                        )}

                        {/* Registration Date */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">
                            {locale === 'ar' ? 'تاريخ التسجيل' : 'Inscrit le'}: {new Date(expandedUserDetail.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-FR')}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              expandedUserDetail.isActive
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-red-100 text-red-500'
                            }`}>
                              {expandedUserDetail.isActive
                                ? (locale === 'ar' ? 'حساب نشط' : 'Compte actif')
                                : (locale === 'ar' ? 'حساب معطل' : 'Compte désactivé')
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs text-muted-foreground">
                        {locale === 'ar' ? 'لم يتم العثور على التفاصيل' : 'Détails non trouvés'}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // --- Categories Tab ---
  if (dashboardActiveTab === 'categories') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-navy via-deal-navy-dark to-deal-navy p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full bg-deal-teal/20 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <FolderTree className="w-5 h-5 text-deal-teal" />
              <span className="text-xs font-bold text-deal-teal bg-deal-teal/20 px-2 py-0.5 rounded-full">{t.dashboard.categoryDistribution}</span>
            </div>
            <h2 className="text-2xl font-black">{t.dashboard.manageCategories} 📂</h2>
            <p className="mt-1 text-white/70 text-sm">{locale === 'ar' ? 'عرض فئات الخدمات والمنتجات' : 'Affichage des catégories de services et produits'}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.serviceCategories}</h3>
              <Wrench className="w-5 h-5 text-deal-orange" />
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {serviceCategoryList.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-deal-navy">{locale === 'ar' ? cat.ar : cat.fr}</p>
                    <p className="text-[10px] text-muted-foreground">ID: {cat.id}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${cat.color} ${cat.textColor}`}>
                    <span className={cat.textColor}>{locale === 'ar' ? 'خدمات' : 'Services'}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Product Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.productCategories}</h3>
              <Package className="w-5 h-5 text-deal-teal" />
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {productCategoryList.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-deal-navy">{locale === 'ar' ? cat.ar : cat.fr}</p>
                    <p className="text-[10px] text-muted-foreground">ID: {cat.id}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${cat.color} ${cat.textColor}`}>
                    <span className={cat.textColor}>{locale === 'ar' ? 'منتجات' : 'Produits'}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- Reports Tab ---
  if (dashboardActiveTab === 'reports') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-navy via-deal-navy-dark to-deal-navy p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full bg-deal-gold/20 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-deal-gold" />
              <span className="text-xs font-bold text-deal-gold bg-deal-gold/20 px-2 py-0.5 rounded-full">{t.dashboard.viewReports}</span>
            </div>
            <h2 className="text-2xl font-black">{t.dashboard.platformStats} 📊</h2>
            <p className="mt-1 text-white/70 text-sm">{locale === 'ar' ? 'إحصائيات شاملة للمنصة' : 'Statistiques complètes de la plateforme'}</p>
          </div>
        </motion.div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-deal-gold animate-spin" />
            </div>
          ) : (
            [
              { label: t.dashboard.customers, value: String(apiStats?.users?.customers || 0), icon: Users, bg: 'bg-deal-orange/10', iconColor: 'text-deal-orange' },
              { label: t.dashboard.craftsmen, value: String(apiStats?.users?.craftsmen || 0), icon: Wrench, bg: 'bg-deal-teal/10', iconColor: 'text-deal-teal' },
              { label: t.dashboard.merchants, value: String(apiStats?.users?.merchants || 0), icon: Package, bg: 'bg-deal-gold/10', iconColor: 'text-deal-gold-dark' },
              { label: t.dashboard.equipmentOwners, value: String(apiStats?.users?.equipmentOwners || 0), icon: Truck, bg: 'bg-purple-50', iconColor: 'text-purple-500' },
              { label: t.dashboard.totalServicesCount, value: String(apiStats?.services || 0), icon: Wrench, bg: 'bg-deal-orange/10', iconColor: 'text-deal-orange' },
              { label: t.dashboard.totalProductsCount, value: String(apiStats?.products || 0), icon: Package, bg: 'bg-deal-teal/10', iconColor: 'text-deal-teal' },
              { label: t.dashboard.totalEquipmentCount, value: String(apiStats?.equipment || 0), icon: Truck, bg: 'bg-deal-gold/10', iconColor: 'text-deal-gold-dark' },
              { label: t.dashboard.totalBookingsCount, value: String(apiStats?.bookings || 0), icon: ShoppingCart, bg: 'bg-amber-50', iconColor: 'text-amber-600' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="card-3d rounded-2xl p-4 sm:p-5 bg-white"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-black text-deal-navy truncate"><AnimatedCounter target={stat.value} duration={1000} /></p>
                      <p className="text-[11px] sm:text-sm text-muted-foreground font-medium truncate">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-3d rounded-2xl bg-white p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.activityFeed}</h3>
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {activityFeed.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    custom={i}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-deal-navy">{locale === 'ar' ? item.text.ar : item.text.fr}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{locale === 'ar' ? item.time.ar : item.time.fr}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Revenue Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-3d rounded-2xl bg-white p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.revenue}</h3>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-deal-navy">{locale === 'ar' ? 'إجمالي المستخدمين' : 'Total utilisateurs'}</span>
                  <span className="text-lg font-black text-emerald-600">{apiStats?.users?.total || 0}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-deal-orange/10 to-amber-50 border border-deal-orange/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-deal-navy">{locale === 'ar' ? 'إجمالي الحجوزات' : 'Total réservations'}</span>
                  <span className="text-lg font-black text-deal-orange">{apiStats?.bookings || 0}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-deal-gold/10 to-yellow-50 border border-deal-gold/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-deal-navy">{locale === 'ar' ? 'الخدمات + المنتجات' : 'Services + Produits'}</span>
                  <span className="text-lg font-black text-deal-gold-dark">{(apiStats?.services || 0) + (apiStats?.products || 0)}</span>
                </div>
 </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-deal-navy">{locale === 'ar' ? 'المعدات' : 'Équipements'}</span>
                  <span className="text-lg font-black text-purple-600">{apiStats?.equipment || 0}</span>
                </div>
 </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- Settings Tab ---
  if (dashboardActiveTab === 'settings') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-navy via-deal-navy-dark to-deal-navy p-6 text-white">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full bg-purple-500/20 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-bold text-purple-400 bg-purple-400/20 px-2 py-0.5 rounded-full">{t.dashboard.platformSettings}</span>
            </div>
            <h2 className="text-2xl font-black">{t.dashboard.settings} ⚙️</h2>
            <p className="mt-1 text-white/70 text-sm">{locale === 'ar' ? 'إعدادات المنصة العامة' : 'Paramètres généraux de la plateforme'}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d rounded-2xl bg-white p-5 sm:p-6 space-y-6">
          <h3 className="text-lg font-bold text-deal-navy mb-4">{t.dashboard.platformSettings}</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-deal-navy mb-1.5">{t.dashboard.platformName}</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal text-deal-navy"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-deal-navy mb-1.5">{t.dashboard.contactEmail}</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal text-deal-navy"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-deal-navy mb-1.5">{t.dashboard.supportPhone}</label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/30 focus:border-deal-teal text-deal-navy"
                    dir="ltr"
 />
                </div>
              </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${maintenanceMode ? 'bg-red-500' : 'bg-gray-200'} flex items-center justify-center transition-colors`}>
                    {maintenanceMode ? <PowerOff className="w-5 h-5 text-white" /> : <Power className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-deal-navy">{t.dashboard.maintenanceMode}</p>
                    <p className="text-[10px] text-muted-foreground">{maintenanceMode
                      ? (locale === 'ar' ? 'الوضع النشط - المنصة غير متاحة للمستخدمين' : 'Mode actif - La plateforme est indisponible')
                      : (locale === 'ar' ? 'الوضع العادي - المنصة متاحة' : 'Mode normal - Plateforme disponible')}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}
                >
                  <motion.div
                    animate={{ x: maintenanceMode ? 28 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </motion.button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={settingsLoading}
              onClick={handleSaveSettings}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-deal-teal to-deal-teal-dark text-white text-sm font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
            >
              {settingsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {t.dashboard.saveSettings}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Overview Tab (default) ---
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deal-navy via-deal-navy-dark to-deal-navy p-6 text-white"
      >
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full bg-deal-orange/20 blur-2xl" />
        <div className="absolute -bottom-10 -start-10 w-40 h-40 rounded-full bg-deal-teal/20 blur-2xl" />
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-deal-teal" />
              <span className="text-xs font-bold text-deal-teal bg-deal-teal/20 px-2 py-0.5 rounded-full">{t.auth.admin}</span>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-black">
                {t.dashboard.platformStats} 👑
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={statsLoading}
                onClick={fetchStats}
                className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-white ${statsLoading ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
            <p className="mt-1 text-white/70 text-sm sm:text-base">
              {t.dashboard.welcome} • {t.dashboard.today}
            </p>
          </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {platformStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4, scale: 1.03 }}
              className="card-3d rounded-2xl p-3 sm:p-4 bg-white text-center"
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <p className="text-xl sm:text-2xl font-black text-deal-navy">{statsReady && <AnimatedCounter target={stat.value} duration={1000} />}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5 truncate">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card-3d rounded-2xl bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.recentUsers}</h3>
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {recentUsers.map((user, i) => {
              const role = roleColors[user.role] || roleColors.customer;
              const roleName = roleLabels[user.role] || roleLabels.customer;
              return (
                <motion.div
                  key={user.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-deal-orange to-deal-teal flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {getLocalizedValue(user.name.ar, user.name.fr).charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-deal-navy truncate">
                      {getLocalizedValue(user.name.ar, user.name.fr)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{user.date}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${role.bg} ${role.text}`}>
                    {getLocalizedValue(roleName.ar, roleName.fr)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-2 card-3d rounded-2xl bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-deal-navy">{t.dashboard.activityFeed}</h3>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
            {activityFeed.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-deal-navy leading-relaxed">
                      {getLocalizedValue(activity.text.ar, activity.text.fr)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">
                        {getLocalizedValue(activity.time.ar, activity.time.fr)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="card-3d rounded-2xl bg-white p-5 sm:p-6"
      >
        <h3 className="text-lg font-bold text-deal-navy mb-4">{t.dashboard.quickActions}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-3d-sm text-white text-xs sm:text-sm"
                style={{
                  background: action.color === 'bg-deal-orange'
                    ? 'linear-gradient(180deg, #FF8C5A 0%, #FF6B35 100%)'
                    : action.color === 'bg-deal-teal'
                      ? 'linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)'
                      : 'linear-gradient(180deg, #FBBF24 0%, #F59E0B 100%)',
                  boxShadow: action.color === 'bg-deal-orange'
                    ? '0 4px 0 0 #CC5529, 0 6px 8px rgba(255,107,53,0.25)'
                    : action.color === 'bg-deal-teal'
                      ? '0 4px 0 0 #0F766E, 0 6px 8px rgba(13,148,136,0.25)'
                      : '0 4px 0 0 #D97706, 0 6px 8px rgba(245,158,11,0.25)',
                  color: action.color === 'bg-deal-gold' ? '#1E293B' : '#FFF',
                }}
              >
                <Icon className="w-4 h-4 inline-block me-2" />
                {action.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
