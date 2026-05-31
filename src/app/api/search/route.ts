import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const type = searchParams.get('type') || 'all';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');

    if (!q) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const results: Array<{
      id: string;
      type: 'service' | 'product' | 'equipment';
      title: string;
      titleFr: string | null;
      description: string;
      descriptionFr: string | null;
      price: number;
      rating: number;
      totalReviews: number;
      isAvailable: boolean;
      createdAt: string;
      category?: string;
      categoryFr?: string | null;
    }> = [];

    const searchFilter: Prisma.StringFilter = {
      contains: q,
    };

    // Build price and rating filters
    const priceFilter: Prisma.FloatFilter | undefined = (() => {
      const conditions: Prisma.FloatFilter[] = [];
      if (minPrice) {
        conditions.push({ gte: parseFloat(minPrice) });
      }
      if (maxPrice) {
        conditions.push({ lte: parseFloat(maxPrice) });
      }
      if (conditions.length === 0) return undefined;
      return { ...conditions[0], ...(conditions[1] || {}) };
    })();

    const ratingFilter: Prisma.FloatFilter | undefined = minRating
      ? { gte: parseFloat(minRating) }
      : undefined;

    const serviceWhere: Prisma.ServiceWhereInput = {
      OR: [
        { title: searchFilter },
        { titleFr: searchFilter },
        { description: searchFilter },
        { descriptionFr: searchFilter },
      ],
      ...(category ? { categoryId: category } : {}),
      ...(priceFilter ? { price: priceFilter } : {}),
      ...(ratingFilter ? { rating: ratingFilter } : {}),
      isAvailable: true,
    };

    const productWhere: Prisma.ProductWhereInput = {
      OR: [
        { title: searchFilter },
        { titleFr: searchFilter },
        { description: searchFilter },
        { descriptionFr: searchFilter },
      ],
      ...(category ? { categoryId: category } : {}),
      ...(priceFilter ? { price: priceFilter } : {}),
      ...(ratingFilter ? { rating: ratingFilter } : {}),
      isAvailable: true,
    };

    const equipmentWhere: Prisma.EquipmentWhereInput = {
      OR: [
        { title: searchFilter },
        { titleFr: searchFilter },
        { description: searchFilter },
        { descriptionFr: searchFilter },
      ],
      ...(priceFilter ? { dailyPrice: priceFilter } : {}),
      ...(ratingFilter ? { rating: ratingFilter } : {}),
      status: 'AVAILABLE',
    };

    // Search services
    if (type === 'all' || type === 'service') {
      const services = await db.service.findMany({
        where: serviceWhere,
        include: { category: { select: { name: true, nameFr: true } } },
        orderBy: { rating: 'desc' },
        take: 20,
      });

      for (const s of services) {
        results.push({
          id: s.id,
          type: 'service',
          title: s.title,
          titleFr: s.titleFr,
          description: s.description,
          descriptionFr: s.descriptionFr,
          price: s.price,
          rating: s.rating,
          totalReviews: s.totalReviews,
          isAvailable: s.isAvailable,
          createdAt: s.createdAt.toISOString(),
          category: s.category.name,
          categoryFr: s.category.nameFr,
        });
      }
    }

    // Search products
    if (type === 'all' || type === 'product') {
      const products = await db.product.findMany({
        where: productWhere,
        include: { category: { select: { name: true, nameFr: true } } },
        orderBy: { rating: 'desc' },
        take: 20,
      });

      for (const p of products) {
        results.push({
          id: p.id,
          type: 'product',
          title: p.title,
          titleFr: p.titleFr,
          description: p.description,
          descriptionFr: p.descriptionFr,
          price: p.price,
          rating: p.rating,
          totalReviews: p.totalReviews,
          isAvailable: p.isAvailable,
          createdAt: p.createdAt.toISOString(),
          category: p.category.name,
          categoryFr: p.category.nameFr,
        });
      }
    }

    // Search equipment
    if (type === 'all' || type === 'equipment') {
      const equipmentList = await db.equipment.findMany({
        where: equipmentWhere,
        orderBy: { rating: 'desc' },
        take: 20,
      });

      for (const e of equipmentList) {
        results.push({
          id: e.id,
          type: 'equipment',
          title: e.title,
          titleFr: e.titleFr,
          description: e.description,
          descriptionFr: e.descriptionFr,
          price: e.dailyPrice,
          rating: e.rating,
          totalReviews: e.totalReviews,
          isAvailable: e.status === 'AVAILABLE',
          createdAt: e.createdAt.toISOString(),
        });
      }
    }

    return NextResponse.json({ results, total: results.length });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
