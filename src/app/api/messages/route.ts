import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/messages — conversation list or conversation messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const otherUserId = searchParams.get('otherUserId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // ── Conversation between two users ──
    if (otherUserId) {
      const messages = await db.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        },
        include: {
          sender: {
            select: { id: true, name: true, nameFr: true, avatar: true },
          },
          receiver: {
            select: { id: true, name: true, nameFr: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      return NextResponse.json(messages);
    }

    // ── All conversations for a user (list of other users + last message) ──
    // Step 1: Find all messages involving this user
    const allMessages = await db.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: { id: true, name: true, nameFr: true, avatar: true },
        },
        receiver: {
          select: { id: true, name: true, nameFr: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Step 2: Group by conversation partner and pick last message
    const conversationMap = new Map<string, {
      otherUserId: string;
      otherUserName: string;
      otherUserNameFr: string | null;
      otherUserAvatar: string | null;
      lastMessage: string;
      lastMessageTime: string;
      unreadCount: number;
    }>();

    for (const msg of allMessages) {
      const isSender = msg.senderId === userId;
      const partnerId = isSender ? msg.receiverId : msg.senderId;
      const partnerName = isSender
        ? msg.receiver.name
        : msg.sender.name;
      const partnerNameFr = isSender
        ? msg.receiver.nameFr
        : msg.sender.nameFr;
      const partnerAvatar = isSender
        ? msg.receiver.avatar
        : msg.sender.avatar;

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          otherUserId: partnerId,
          otherUserName: partnerName,
          otherUserNameFr: partnerNameFr,
          otherUserAvatar: partnerAvatar,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt.toISOString(),
          unreadCount: 0,
        });
      }

      // Count unread (messages TO this user that haven't been read)
      if (!isSender && !msg.isRead) {
        const entry = conversationMap.get(partnerId)!;
        entry.unreadCount++;
      }
    }

    const conversations = Array.from(conversationMap.values());

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/messages — Send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, content } = body;

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: 'senderId, receiverId, and content are required' },
        { status: 400 }
      );
    }

    if (senderId === receiverId) {
      return NextResponse.json(
        { error: 'Cannot send message to yourself' },
        { status: 400 }
      );
    }

    const message = await db.message.create({
      data: {
        senderId,
        receiverId,
        content,
        isRead: false,
      },
      include: {
        sender: {
          select: { id: true, name: true, nameFr: true, avatar: true },
        },
        receiver: {
          select: { id: true, name: true, nameFr: true, avatar: true },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/messages/read — Mark messages as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, otherUserId } = body;

    if (!userId || !otherUserId) {
      return NextResponse.json(
        { error: 'userId and otherUserId are required' },
        { status: 400 }
      );
    }

    // Mark all unread messages from otherUserId to userId as read
    const result = await db.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      success: true,
      messagesMarked: result.count,
    });
  } catch (error) {
    console.error('Mark messages read error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
