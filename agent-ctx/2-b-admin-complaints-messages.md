---
Task ID: 2-b
Agent: Main Agent
Task: Add Complaints Management Tab and Messages Tab to Admin Dashboard

Work Log:
- Read worklog.md and all referenced files to understand project context
- Added i18n keys to ar.json and fr.json for complaints and messages UI
- Added complaints and messages tabs to admin sidebar in dashboard-wrapper.tsx
- Implemented full Complaints tab in admin-dashboard.tsx with:
  - Fetch all complaints from GET /api/complaints
  - Complaint cards with user info, subject, description, date, status badge
  - Status badges: PENDING (orange), IN_PROGRESS (amber), RESOLVED (green), REJECTED (red)
  - Expandable complaint detail view with Eye/ChevronUp toggle
  - Admin reply form (textarea + submit) via PATCH /api/complaints?action=reply
  - Status change buttons: Mark Resolved, Mark In Progress, Reject via PATCH /api/complaints?action=status
  - Loading states with Loader2 spinner
  - Toast notifications for success/error
  - Refresh button to re-fetch complaints
- Implemented full Messages tab in admin-dashboard.tsx with:
  - User list panel showing all platform users (excluding admin)
  - Conversation indicators with unread count badges
  - Chat panel with message bubbles (sent vs received styling)
  - Message input with Enter key support and Send button
  - Send messages via POST /api/messages
  - Fetch messages via GET /api/messages?userId=&otherUserId=
  - Mark messages as read via PATCH /api/messages
  - Empty state when no user selected
  - Loading states with Loader2 spinner

### Files Modified (4):

1. **`src/i18n/ar.json`** — Added 23 new dashboard keys for complaints/messages + messagesAdmin section
2. **`src/i18n/fr.json`** — Added matching French translations for complaints/messages + messagesAdmin section  
3. **`src/components/deal/dashboard-wrapper.tsx`** — Added AlertTriangle + MessageCircle icons; added complaints and messages sidebar items for admin role
4. **`src/components/deal/dashboard/admin-dashboard.tsx`** — Major additions:
   - New imports: AlertTriangle, MessageCircle, Send, CheckCircle2, XCircle, Clock4
   - New interfaces: ComplaintItem, MessageItem, ConversationItem
   - New config: complaintStatusConfig with status badges
   - New state: complaints, allUsers, conversations, chatMessages, loading flags, reply/status loading
   - New functions: fetchComplaints, fetchAllUsers, fetchConversations, fetchChatMessages, handleReplyComplaint, handleStatusChange, handleSendMessage
   - New effects: fetch complaints on tab switch, fetch users+conversations on messages tab switch
   - New UI: Full Complaints tab view (~220 lines), Full Messages tab view (~190 lines)

### Lint Results:
- 0 errors (1 pre-existing font warning only)
- All changes compiled successfully on dev server

### Stage Summary:
- ✅ Complaints tab fully functional with expand/reply/status management
- ✅ Messages tab with user list and real-time chat interface
- ✅ Sidebar navigation updated with new tabs
- ✅ Bilingual support (Arabic RTL + French)
- ✅ Consistent design patterns with existing tabs (gradients, cards, animations)
- ✅ 0 lint errors
