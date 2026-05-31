import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/complaints — list complaints (filtered by userId or all for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const where: Record<string, unknown> = {};
    if (userId) {
      where.userId = userId;
    }

    const complaints = await db.complaint.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Fetch complaints error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/complaints — Submit a complaint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, targetId, targetType, subject, subjectFr, description, descriptionFr } = body;

    if (!userId || !subject || !description) {
      return NextResponse.json(
        { error: 'userId, subject, and description are required' },
        { status: 400 }
      );
    }

    const complaint = await db.complaint.create({
      data: {
        userId,
        targetId: targetId || null,
        targetType: targetType || null,
        subject,
        subjectFr: subjectFr || null,
        description,
        descriptionFr: descriptionFr || null,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(complaint, { status: 201 });
  } catch (error) {
    console.error('Create complaint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/complaints/reply — Admin reply
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const body = await request.json();

    // ── Admin reply ──
    if (action === 'reply') {
      const { id, adminReply, adminReplyFr } = body;

      if (!id || !adminReply) {
        return NextResponse.json(
          { error: 'id and adminReply are required' },
          { status: 400 }
        );
      }

      const existing = await db.complaint.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json(
          { error: 'Complaint not found' },
          { status: 404 }
        );
      }

      const complaint = await db.complaint.update({
        where: { id },
        data: {
          adminReply,
          adminReplyFr: adminReplyFr || null,
          status: existing.status === 'PENDING' ? 'IN_PROGRESS' : existing.status,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              nameFr: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
        },
      });

      return NextResponse.json(complaint);
    }

    // ── Update status ──
    if (action === 'status') {
      const { id, status } = body;

      if (!id || !status) {
        return NextResponse.json(
          { error: 'id and status are required' },
          { status: 400 }
        );
      }

      const validStatuses = ['RESOLVED', 'REJECTED', 'IN_PROGRESS', 'PENDING'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }

      const existing = await db.complaint.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json(
          { error: 'Complaint not found' },
          { status: 404 }
        );
      }

      const complaint = await db.complaint.update({
        where: { id },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              nameFr: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
        },
      });

      return NextResponse.json(complaint);
    }

    return NextResponse.json(
      { error: 'action query param is required (reply or status)' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update complaint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
