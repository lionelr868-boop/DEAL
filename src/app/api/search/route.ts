import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';

function buildOrderBy(sort: SortOption): Record<string, string> {
  switch (sort) {
    case 'price-asc': return { price: 'asc' };
    case 'price-desc': return { price: 'desc' };
    case 'rating': return { rating: 'desc' };
    case 'newest': return { createdAt: 'desc' };
    case 'popular': return { totalReviews: 'desc' };
    default: return { rating: 'desc' };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const type = searchParams.get('type') || 'all';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const available = searchParams.get('available');
    const sort = (searchParams.get('sort') || 'rating') as SortOption;

    if (!q) {
      return NextResponse.json({
        services: [],
        products: [],
        equipment: [],
        total: 0,
      });
    }

    const searchFilter: Prisma.StringFilter = {
      contains: q,
    };

    // Build price filter
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

    // Build rating filter
    const ratingFilter: Prisma.FloatFilter | undefined = minRating
      ? { gte: parseFloat(minRating) }
      : undefined;

    // Build availability filter
    const availabilityFilter = available === 'true' ? true : undefined;

    // --- Services ---
    const services: Array<{
      id: string;
      type: 'service';
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

    if (type === 'all' || type === 'service') {
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
        ...(availabilityFilter !== undefined ? { isAvailable: availabilityFilter } : {}),
        isAvailable: true,
      };

      const serviceOrderBy = (() => {
        const base = buildOrderBy(sort);
        if (sort === 'price-asc' || sort === 'price-desc') return { price: base.price };
        if (sort === 'rating') return { rating: base.rating };
        if (sort === 'newest') return { createdAt: base.createdAt };
        if (sort === 'popular') return { totalReviews: base.totalReviews };
        return { rating: 'desc' };
      })();

      const serviceResults = await db.service.findMany({
        where: serviceWhere,
        include: { category: { select: { name: true, nameFr: true } } },
        orderBy: serviceOrderBy,
        take: 30,
      });

      for (const s of serviceResults) {
        services.push({
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

    // --- Products ---
    const products: Array<{
      id: string;
      type: 'product';
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

    if (type === 'all' || type === 'product') {
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
        ...(availabilityFilter !== undefined ? { isAvailable: availabilityFilter } : {}),
        isAvailable: true,
      };

      const productOrderBy = (() => {
        const base = buildOrderBy(sort);
        if (sort === 'price-asc' || sort === 'price-desc') return { price: base.price };
        if (sort === 'rating') return { rating: base.rating };
        if (sort === 'newest') return { createdAt: base.createdAt };
        if (sort === 'popular') return { totalReviews: base.totalReviews };
        return { rating: 'desc' };
      })();

      const productResults = await db.product.findMany({
        where: productWhere,
        include: { category: { select: { name: true, nameFr: true } } },
        orderBy: productOrderBy,
        take: 30,
      });

      for (const p of productResults) {
        products.push({
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

    // --- Equipment ---
    const equipment: Array<{
      id: string;
      type: 'equipment';
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

    if (type === 'all' || type === 'equipment') {
      const equipmentWhere: Prisma.EquipmentWhereInput = {
        OR: [
          { title: searchFilter },
          { titleFr: searchFilter },
          { description: searchFilter },
          { descriptionFr: searchFilter },
        ],
        ...(priceFilter ? { dailyPrice: priceFilter } : {}),
        ...(ratingFilter ? { rating: ratingFilter } : {}),
        ...(availabilityFilter !== undefined ? { status: 'AVAILABLE' } : {}),
        status: 'AVAILABLE',
      };

      const equipmentOrderBy = (() => {
        const base = buildOrderBy(sort);
        if (sort === 'price-asc' || sort === 'price-desc') return { dailyPrice: base.price };
        if (sort === 'rating') return { rating: base.rating };
        if (sort === 'newest') return { createdAt: base.createdAt };
        if (sort === 'popular') return { totalReviews: base.totalReviews };
        return { rating: 'desc' };
      })();

      const equipmentResults = await db.equipment.findMany({
        where: equipmentWhere,
        orderBy: equipmentOrderBy,
        take: 30,
      });

      for (const e of equipmentResults) {
        equipment.push({
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

    const total = services.length + products.length + equipment.length;

    return NextResponse.json({
      services,
      products,
      equipment,
      total,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
