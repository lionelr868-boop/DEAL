import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/notifications?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const notifications = await db.notificationDb.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/notifications — Create notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, titleFr, message, messageFr, link } = body;

    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: 'userId, title, and message are required' },
        { status: 400 }
      );
    }

    const notification = await db.notificationDb.create({
      data: {
        userId,
        type: type || 'system',
        title,
        titleFr: titleFr || null,
        message,
        messageFr: messageFr || null,
        link: link || null,
        isRead: false,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications/read — Mark as read (by id or read-all by userId)
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const bulkUserId = searchParams.get('userId');

    // PATCH /api/notifications/read-all?userId=xxx — Mark ALL as read
    if (bulkUserId) {
      const result = await db.notificationDb.updateMany({
        where: { userId: bulkUserId, isRead: false },
        data: { isRead: true },
      });

      return NextResponse.json({
        success: true,
        notificationsMarked: result.count,
      });
    }

    // PATCH /api/notifications/read?id=xxx — Mark single as read
    if (id) {
      const notification = await db.notificationDb.findUnique({ where: { id } });
      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }

      const updated = await db.notificationDb.update({
        where: { id },
        data: { isRead: true },
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json(
      { error: 'Either id or userId query param is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    const notification = await db.notificationDb.findUnique({ where: { id } });
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    await db.notificationDb.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
