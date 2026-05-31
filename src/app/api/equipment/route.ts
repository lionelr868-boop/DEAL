import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const ownerId = searchParams.get('ownerId');

    const where: Record<string, unknown> = {};

    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (status) {
      where.status = status;
    }

    const equipment = await db.equipment.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            rating: true,
            totalReviews: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Fetch equipment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      ownerId,
      title,
      titleFr,
      description,
      descriptionFr,
      dailyPrice,
      weeklyPrice,
      monthlyPrice,
    } = body;

    // Validate required fields
    if (!ownerId || !title || !description || dailyPrice == null) {
      return NextResponse.json(
        { error: 'ownerId, title, description, and dailyPrice are required' },
        { status: 400 }
      );
    }

    const equipment = await db.equipment.create({
      data: {
        ownerId,
        title,
        titleFr: titleFr || null,
        description,
        descriptionFr: descriptionFr || null,
        dailyPrice: parseFloat(dailyPrice),
        weeklyPrice: weeklyPrice != null ? parseFloat(weeklyPrice) : null,
        monthlyPrice: monthlyPrice != null ? parseFloat(monthlyPrice) : null,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            rating: true,
            totalReviews: true,
          },
        },
      },
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    console.error('Create equipment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
