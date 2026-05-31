import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where: Record<string, unknown> = {};

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

    const products = await db.product.findMany({
      where,
      include: {
        category: true,
        merchant: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            shopName: true,
            shopNameFr: true,
            rating: true,
            totalReviews: true,
            hasDelivery: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
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
      merchantId,
      categoryId,
      title,
      titleFr,
      description,
      descriptionFr,
      price,
      stock,
      unit,
    } = body;

    // Validate required fields
    if (!merchantId || !categoryId || !title || !description || price == null) {
      return NextResponse.json(
        { error: 'merchantId, categoryId, title, description, and price are required' },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        merchantId,
        categoryId,
        title,
        titleFr: titleFr || null,
        description,
        descriptionFr: descriptionFr || null,
        price: parseFloat(price),
        stock: stock != null ? parseInt(stock) : 0,
        unit: unit || 'piece',
      },
      include: {
        category: true,
        merchant: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            shopName: true,
            shopNameFr: true,
            rating: true,
            totalReviews: true,
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
