import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    if (!type) {
      return NextResponse.json(
        { error: 'type query parameter is required (services, products, equipment)' },
        { status: 400 }
      );
    }

    if (type === 'services') {
      const where: Record<string, unknown> = {};
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { titleFr: { contains: search } },
          { description: { contains: search } },
          { descriptionFr: { contains: search } },
          { provider: { name: { contains: search } } },
          { provider: { nameFr: { contains: search } } },
        ];
      }

      const services = await db.service.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, nameFr: true, icon: true },
          },
          provider: {
            select: {
              id: true,
              name: true,
              nameFr: true,
              avatar: true,
              rating: true,
              isVerified: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(
        services.map((s) => ({
          id: s.id,
          title: s.title,
          titleFr: s.titleFr,
          description: s.description,
          descriptionFr: s.descriptionFr,
          price: s.price,
          priceUnit: s.priceUnit,
          images: s.images,
          isAvailable: s.isAvailable,
          rating: s.rating,
          totalReviews: s.totalReviews,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          providerName: s.provider.name,
          providerNameFr: s.provider.nameFr,
          providerAvatar: s.provider.avatar,
          providerRating: s.provider.rating,
          providerVerified: s.provider.isVerified,
          categoryName: s.category.name,
          categoryNameFr: s.category.nameFr,
          categoryIcon: s.category.icon,
        }))
      );
    }

    if (type === 'products') {
      const where: Record<string, unknown> = {};
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { titleFr: { contains: search } },
          { description: { contains: search } },
          { descriptionFr: { contains: search } },
          { merchant: { name: { contains: search } } },
          { merchant: { nameFr: { contains: search } } },
        ];
      }

      const products = await db.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, nameFr: true, icon: true },
          },
          merchant: {
            select: {
              id: true,
              name: true,
              nameFr: true,
              avatar: true,
              rating: true,
              isVerified: true,
              shopName: true,
              shopNameFr: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(
        products.map((p) => ({
          id: p.id,
          title: p.title,
          titleFr: p.titleFr,
          description: p.description,
          descriptionFr: p.descriptionFr,
          price: p.price,
          stock: p.stock,
          unit: p.unit,
          images: p.images,
          isAvailable: p.isAvailable,
          rating: p.rating,
          totalReviews: p.totalReviews,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          merchantName: p.merchant.name,
          merchantNameFr: p.merchant.nameFr,
          merchantAvatar: p.merchant.avatar,
          merchantShopName: p.merchant.shopName,
          merchantShopNameFr: p.merchant.shopNameFr,
          merchantRating: p.merchant.rating,
          merchantVerified: p.merchant.isVerified,
          categoryName: p.category.name,
          categoryNameFr: p.category.nameFr,
          categoryIcon: p.category.icon,
        }))
      );
    }

    if (type === 'equipment') {
      const where: Record<string, unknown> = {};
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { titleFr: { contains: search } },
          { description: { contains: search } },
          { descriptionFr: { contains: search } },
          { owner: { name: { contains: search } } },
          { owner: { nameFr: { contains: search } } },
        ];
      }

      const items = await db.equipment.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              nameFr: true,
              avatar: true,
              rating: true,
              isVerified: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(
        items.map((e) => ({
          id: e.id,
          title: e.title,
          titleFr: e.titleFr,
          description: e.description,
          descriptionFr: e.descriptionFr,
          dailyPrice: e.dailyPrice,
          weeklyPrice: e.weeklyPrice,
          monthlyPrice: e.monthlyPrice,
          images: e.images,
          status: e.status,
          rating: e.rating,
          totalReviews: e.totalReviews,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
          ownerName: e.owner.name,
          ownerNameFr: e.owner.nameFr,
          ownerAvatar: e.owner.avatar,
          ownerRating: e.owner.rating,
          ownerVerified: e.owner.isVerified,
        }))
      );
    }

    return NextResponse.json(
      { error: 'Invalid type. Must be: services, products, or equipment' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Admin content list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'type and id query parameters are required' },
        { status: 400 }
      );
    }

    if (type === 'services') {
      const existing = await db.service.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      }
      await db.service.delete({ where: { id } });
      return NextResponse.json({ message: 'Service deleted successfully' });
    }

    if (type === 'products') {
      const existing = await db.product.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      await db.product.delete({ where: { id } });
      return NextResponse.json({ message: 'Product deleted successfully' });
    }

    if (type === 'equipment') {
      const existing = await db.equipment.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
      }
      await db.equipment.delete({ where: { id } });
      return NextResponse.json({ message: 'Equipment deleted successfully' });
    }

    return NextResponse.json(
      { error: 'Invalid type. Must be: services, products, or equipment' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Admin content delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const field = searchParams.get('field');
    const value = searchParams.get('value');

    if (!type || !id || !field) {
      return NextResponse.json(
        { error: 'type, id, and field query parameters are required' },
        { status: 400 }
      );
    }

    const allowedFieldsPerType: Record<string, string[]> = {
      services: ['isAvailable', 'title', 'titleFr', 'description', 'descriptionFr', 'price'],
      products: ['isAvailable', 'title', 'titleFr', 'description', 'descriptionFr', 'price', 'stock'],
      equipment: ['status', 'title', 'titleFr', 'description', 'descriptionFr', 'dailyPrice', 'weeklyPrice', 'monthlyPrice'],
    };

    const allowed = allowedFieldsPerType[type];
    if (!allowed || !allowed.includes(field)) {
      return NextResponse.json(
        { error: `Invalid field '${field}' for type '${type}'` },
        { status: 400 }
      );
    }

    // Parse the value
    let parsedValue: unknown = value;
    if (field === 'isAvailable' || field === 'status') {
      if (value === 'true' || value === 'false') {
        parsedValue = value === 'true';
      } else {
        parsedValue = value; // status can be AVAILABLE, RENTED, etc.
      }
    } else if (field === 'price' || field === 'dailyPrice' || field === 'weeklyPrice' || field === 'monthlyPrice' || field === 'stock') {
      parsedValue = parseFloat(value as string);
    }

    const updateData: Record<string, unknown> = {};
    updateData[field] = parsedValue;

    if (type === 'services') {
      const existing = await db.service.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      }
      const updated = await db.service.update({
        where: { id },
        data: updateData,
      });
      return NextResponse.json(updated);
    }

    if (type === 'products') {
      const existing = await db.product.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      const updated = await db.product.update({
        where: { id },
        data: updateData,
      });
      return NextResponse.json(updated);
    }

    if (type === 'equipment') {
      const existing = await db.equipment.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
      }
      const updated = await db.equipment.update({
        where: { id },
        data: updateData,
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json(
      { error: 'Invalid type. Must be: services, products, or equipment' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Admin content update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
