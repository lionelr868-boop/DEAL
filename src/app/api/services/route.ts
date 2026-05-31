import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const providerId = searchParams.get('providerId');

    const where: Record<string, unknown> = {};

    if (providerId) {
      where.providerId = providerId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleFr: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      const priceFilter: Record<string, unknown> = {};
      if (minPrice) priceFilter.gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice);
      where.price = priceFilter;
    }

    const services = await db.service.findMany({
      where,
      include: {
        category: true,
        provider: {
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

    return NextResponse.json(services);
  } catch (error) {
    console.error('Fetch services error:', error);
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
      providerId,
      categoryId,
      title,
      titleFr,
      description,
      descriptionFr,
      price,
      priceUnit,
    } = body;

    // Validate required fields
    if (!providerId || !categoryId || !title || !description || price == null) {
      return NextResponse.json(
        { error: 'providerId, categoryId, title, description, and price are required' },
        { status: 400 }
      );
    }

    const service = await db.service.create({
      data: {
        providerId,
        categoryId,
        title,
        titleFr: titleFr || null,
        description,
        descriptionFr: descriptionFr || null,
        price: parseFloat(price),
        priceUnit: priceUnit || 'service',
      },
      include: {
        category: true,
        provider: {
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

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
