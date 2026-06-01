'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, ChevronRight, User, Plus, Search, Loader2 } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ProviderUser {
  id: string;
  name: string;
  nameFr: string;
  role: string;
  avatar?: string | null;
  specialties?: string | null;
  rating?: number | null;
  shopName?: string | null;
  shopNameFr?: string | null;
}

type WidgetView = 'conversations' | 'messages' | 'newMessage';

export default function MessagingWidget() {
  const { t, locale, getLocalizedValue } = useI18n();
  const { currentUser, selectedItemId, detailType, messagingTargetUserId, setMessagingTargetUserId } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<WidgetView>('conversations');
  const [providers, setProviders] = useState<ProviderUser[]>([]);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [providerSearch, setProviderSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === 'ar';

  // Watch for messaging target from detail modal
  useEffect(() => {
    if (messagingTargetUserId && currentUser) {
      setIsOpen(true);
      openConversation(messagingTargetUserId);
      setMessagingTargetUserId(null);
    }
  }, [messagingTargetUserId, currentUser]);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadConversations();
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await fetch(`/api/messages?userId=${currentUser?.id}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch { /* ignore */ }
  };

  const openConversation = async (otherUserId: string) => {
    setActiveConv(otherUserId);
    setView('messages');
    try {
      const res = await fetch(`/api/messages?userId=${currentUser?.id}&otherUserId=${otherUserId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch { /* ignore */ }

    // Mark as read
    try {
      await fetch('/api/messages/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id, otherUserId }),
      });
    } catch { /* ignore */ }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv || !currentUser) return;

    const msgContent = newMessage.trim();
    setNewMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: activeConv,
          content: msgContent,
        }),
      });

      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        loadConversations();
      }
    } catch {
      toast.error('Error sending message');
      setNewMessage(msgContent);
    } finally {
      setLoading(false);
    }
  };

  const loadProviders = async () => {
    setProvidersLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const allUsers: ProviderUser[] = await res.json();
        // Filter to only providers (craftsmen, merchants, equipment_owners) — not customers or admin
        const filtered = allUsers.filter(
          (u) => ['CRAFTSMAN', 'MERCHANT', 'EQUIPMENT_OWNER'].includes(u.role) && u.id !== currentUser?.id
        );
        setProviders(filtered);
      }
    } catch { /* ignore */ } finally {
      setProvidersLoading(false);
    }
  };

  const handleNewMessage = () => {
    setView('newMessage');
    setActiveConv(null);
    setProviderSearch('');
    loadProviders();
  };

  const handleSelectProvider = (provider: ProviderUser) => {
    openConversation(provider.id);
  };

  const handleBack = () => {
    setActiveConv(null);
    setView('conversations');
    loadConversations();
  };

  const getProviderDisplayName = (provider: ProviderUser) => {
    return getLocalizedValue(provider.name, provider.nameFr);
  };

  const getProviderSubtitle = (provider: ProviderUser) => {
    if (provider.role === 'CRAFTSMAN') {
      return provider.specialties || '';
    }
    if (provider.role === 'MERCHANT') {
      return getLocalizedValue(provider.shopName || '', provider.shopNameFr || '');
    }
    return getLocalizedValue(provider.name, provider.nameFr);
  };

  const filteredProviders = providers.filter((p) => {
    if (!providerSearch.trim()) return true;
    const search = providerSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(search) ||
      p.nameFr.toLowerCase().includes(search) ||
      (p.shopName?.toLowerCase().includes(search)) ||
      (p.shopNameFr?.toLowerCase().includes(search)) ||
      (p.specialties?.toLowerCase().includes(search))
    );
  });

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!currentUser) return null;

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) { setView('conversations'); setActiveConv(null); loadConversations(); } }}
        className="fixed bottom-6 end-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-deal-teal to-deal-teal-dark text-white shadow-lg shadow-deal-teal/30 flex items-center justify-center hover:shadow-xl hover:shadow-deal-teal/40 transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Notification dot */}
        {totalUnread > 0 && !isOpen && (
          <div className="absolute -top-1 -end-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
            {totalUnread}
          </div>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 end-6 z-50 w-[340px] sm:w-[400px] max-h-[520px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
            style={{ background: 'white' }}
          >
            {/* Header */}
            <div className="gradient-animated p-4 text-white relative">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {locale === 'ar' ? 'الرسائل' : 'Messages'}
              </h3>
              <p className="text-xs text-white/70 mt-1">
                {view === 'newMessage'
                  ? t.common.selectUser
                  : activeConv
                    ? (locale === 'ar' ? 'المحادثة الجارية' : 'Conversation en cours')
                    : (locale === 'ar' ? 'اختر محادثة' : 'Choisir une conversation')
                }
              </p>

              {/* New Message button — show only in conversations view */}
              {view === 'conversations' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNewMessage}
                  className="absolute top-3.5 end-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  title={t.common.newMessage}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            {/* Back button when in conversation or new message */}
            {(activeConv || view === 'newMessage') && (
              <button
                onClick={handleBack}
                className="absolute top-14 start-3 z-10 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
              </button>
            )}

            <div className="flex flex-col" style={{ height: '420px' }}>
              {view === 'newMessage' ? (
                /* New Message - Provider Selection */
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Search bar */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={providerSearch}
                        onChange={(e) => setProviderSearch(e.target.value)}
                        placeholder={locale === 'ar' ? 'ابحث عن مزود...' : 'Rechercher un prestataire...'}
                        className="w-full h-9 ps-9 pe-3 rounded-xl bg-gray-100 border-none text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {providersLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-deal-teal" />
                      </div>
                    ) : filteredProviders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <User className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-sm text-muted-foreground">{t.common.noProviders}</p>
                      </div>
                    ) : (
                      filteredProviders.map((provider) => (
                        <motion.button
                          key={provider.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectProvider(provider)}
                          className="w-full flex items-center gap-3 p-3.5 hover:bg-deal-teal/5 transition-colors border-b border-gray-50 text-start"
                        >
                          <div className="w-10 h-10 rounded-full bg-deal-teal/10 flex items-center justify-center flex-shrink-0">
                            {provider.avatar ? (
                              <img src={provider.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-sm font-bold text-deal-teal">
                                {getProviderDisplayName(provider).charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-deal-navy truncate">
                              {getProviderDisplayName(provider)}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {getProviderSubtitle(provider)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {provider.rating && (
                              <span className="text-[10px] font-bold text-deal-gold bg-deal-gold/10 px-1.5 py-0.5 rounded-full">
                                {provider.rating.toFixed(1)}
                              </span>
                            )}
                            <MessageCircle className="w-4 h-4 text-deal-teal" />
                          </div>
                        </motion.button>
                      ))
                    )}
                  </div>
                </div>
              ) : !activeConv ? (
                /* Conversations list */
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        {locale === 'ar' ? 'لا توجد رسائل بعد' : 'Aucun message'}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNewMessage}
                        className="mt-3 text-xs font-bold text-deal-teal bg-deal-teal/10 px-4 py-1.5 rounded-full hover:bg-deal-teal/20 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        {t.common.startConversation}
                      </motion.button>
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <button
                        key={conv.otherUserId}
                        onClick={() => openConversation(conv.otherUserId)}
                        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-start"
                      >
                        <div className="w-10 h-10 rounded-full bg-deal-teal/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-deal-teal" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-deal-navy truncate">{conv.otherUserName}</p>
                            <span className="text-[10px] text-muted-foreground">{formatTime(conv.lastMessageTime)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <div className="w-5 h-5 rounded-full bg-deal-orange text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {conv.unreadCount}
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              ) : (
                /* Messages view */
                <>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {messages.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground mt-8">
                        {locale === 'ar' ? 'ابدأ المحادثة...' : 'Commencez la conversation...'}
                      </p>
                    )}
                    {messages.map((msg) => {
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
                              ? 'bg-gradient-to-br from-deal-teal to-deal-teal-dark text-white rounded-br-md'
                              : 'bg-gray-100 text-deal-navy rounded-bl-md'
                          }`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${isMine ? 'text-white/60' : 'text-gray-400'}`}>
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={sendMessage} className="p-3 border-t border-gray-100 flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={locale === 'ar' ? 'اكتب رسالتك...' : 'Écrivez votre message...'}
                      className="flex-1 h-10 px-4 rounded-xl bg-gray-100 border-none text-sm focus:outline-none focus:ring-2 focus:ring-deal-teal/20 transition-all"
                      dir="auto"
                    />
                    <motion.button
                      type="submit"
                      disabled={loading || !newMessage.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-deal-teal to-deal-teal-dark text-white flex items-center justify-center disabled:opacity-40 shadow-md"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
