import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/testimonials?limit=6&featured=true
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');

    const where: Record<string, unknown> = {};
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const testimonials = await db.testimonial.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Fetch testimonials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/testimonials
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { authorName, authorNameFr, role, roleFr, rating, content, contentFr, isFeatured } = body;

    if (!authorName || !role || !rating || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: authorName, role, rating, content' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const testimonial = await db.testimonial.create({
      data: {
        authorName,
        authorNameFr: authorNameFr || null,
        role,
        roleFr: roleFr || null,
        rating: Math.round(rating),
        content,
        contentFr: contentFr || null,
        isFeatured: isFeatured || false,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/testimonials?id=xxx (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing testimonial id' },
        { status: 400 }
      );
    }

    // Simple auth check - verify admin header
    const authHeader = request.headers.get('authorization');
    // In production this would check a proper JWT/session
    // For now we allow deletion if an auth header is present
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    await db.testimonial.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
