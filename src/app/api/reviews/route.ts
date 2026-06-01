import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('targetId');

    const where: Record<string, unknown> = {};

    if (targetId) {
      where.targetId = targetId;
    }

    const reviews = await db.review.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authorId, targetId, targetType, rating, comment, commentFr } = body;

    // Validate required fields
    if (!authorId || !targetId || !targetType || rating == null) {
      return NextResponse.json(
        { error: 'authorId, targetId, targetType, and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating is 1-5
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const validTargetTypes = ['USER', 'SERVICE', 'PRODUCT', 'EQUIPMENT'];
    if (!validTargetTypes.includes(targetType)) {
      return NextResponse.json(
        { error: `Invalid targetType. Must be one of: ${validTargetTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Create the review
    const review = await db.review.create({
      data: {
        authorId,
        targetId,
        targetType,
        rating: ratingNum,
        comment: comment || null,
        commentFr: commentFr || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
          },
        },
      },
    });

    // Update target user's average rating
    const allReviews = await db.review.findMany({
      where: { targetId },
      select: { rating: true },
    });

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

    await db.user.update({
      where: { id: targetId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews: allReviews.length,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
