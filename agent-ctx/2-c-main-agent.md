---
Task ID: 2-c
Agent: Main Agent
Task: Add complaint button to detail modal, enhance messaging widget with new conversations

Work Log:
- Read worklog.md and all referenced files (detail-modal.tsx, messaging-widget.tsx, store.ts, mock.ts, i18n files, complaint-modal.tsx, users API)
- Added `messagingTargetUserId` and `setMessagingTargetUserId` to Zustand store (AppState)
- Added 6 new i18n strings to both ar.json and fr.json (newMessage, selectUser, startConversation, reportProblem, contactViaMessage, noProviders)
- Added `Flag` icon import to detail-modal.tsx
- Added complaint button (Flag icon, red style, with tooltip) in ALL THREE detail views (service, product, equipment)
- Added `handleComplaint` function that checks login and opens complaint modal
- Added `handleMessageProvider` function with provider name-to-ID mapping to open messaging widget
- Enhanced messaging widget with 3 views: conversations, messages, newMessage
- Added "New Message" (+) button in chat header when viewing conversations list
- Added provider selection panel with search functionality
- Filters /api/users response to show only CRAFTSMAN, MERCHANT, EQUIPMENT_OWNER roles
- Shows provider name, specialty/shop name, rating badge
- Empty state shows "Start Conversation" button
- Widget watches `messagingTargetUserId` from store and auto-opens conversation
- After opening target conversation, clears the target to prevent re-triggering
- Back button support in all views
- RTL-compatible (start/end positioning, ChevronRight rotation)
- 0 lint errors (1 pre-existing font warning only)

### Files Modified (4):

1. **`src/lib/store.ts`**:
   - Added `messagingTargetUserId: string | null` to AppState interface and initial state
   - Added `setMessagingTargetUserId: (id: string | null) => void` to AppState interface and implementation

2. **`src/i18n/ar.json`**:
   - Added: `common.newMessage` → "رسالة جديدة"
   - Added: `common.selectUser` → "اختر المستخدم"
   - Added: `common.startConversation` → "بدء محادثة"
   - Added: `common.reportProblem` → "إبلاغ عن مشكلة"
   - Added: `common.contactViaMessage` → "تواصل عبر الرسائل"
   - Added: `common.noProviders` → "لا يوجد مزودون متاحون"

3. **`src/i18n/fr.json`**:
   - Added: `common.newMessage` → "Nouveau message"
   - Added: `common.selectUser` → "Sélectionner un utilisateur"
   - Added: `common.startConversation` → "Démarrer une conversation"
   - Added: `common.reportProblem` → "Signaler un problème"
   - Added: `common.contactViaMessage` → "Contacter par message"
   - Added: `common.noProviders` → "Aucun prestataire disponible"

4. **`src/components/deal/detail-modal.tsx`**:
   - Imported `Flag` from lucide-react
   - Destructured `setShowComplaintModal`, `setMessagingTargetUserId` from useAppStore
   - Added `handleComplaint()` — checks login, opens complaint modal
   - Added `handleMessageProvider(providerName)` — maps provider names to user IDs, sets messagingTargetUserId, closes detail modal
   - Added complaint button (Flag icon, bg-red-500/30, hover:bg-red-500/50, title tooltip) in service, product, and equipment detail view headers
   - Provider name mapping covers all mock data providers (6 craftsmen, 3 merchants, 2 equipment owners)

5. **`src/components/deal/messaging-widget.tsx`** (full rewrite):
   - Added `WidgetView` type: 'conversations' | 'messages' | 'newMessage'
   - Added `ProviderUser` interface for fetched provider data
   - Watches `messagingTargetUserId` — auto-opens widget and conversation when set
   - "New Message" button (+ icon) in header, visible in conversations view
   - Provider selection panel: search bar, filtered list, avatar/name/subtitle/rating
   - Filters providers to CRAFTSMAN, MERCHANT, EQUIPMENT_OWNER only (excludes CUSTOMER, ADMIN)
   - Shows "Start Conversation" button in empty conversations state
   - Back button with RTL-aware ChevronRight rotation
   - Increased max-height to 520px for provider list
   - Loading state with Loader2 spinner

### Stage Summary:
- ✅ Complaint button in all 3 detail modal views (service, product, equipment)
- ✅ Messaging widget enhanced with new conversation capability
- ✅ Provider search and selection panel
- ✅ Detail modal → messaging widget integration via store
- ✅ 0 lint errors
- ✅ Bilingual (Arabic RTL + French) support
- ✅ Login-required checks for complaint and messaging
