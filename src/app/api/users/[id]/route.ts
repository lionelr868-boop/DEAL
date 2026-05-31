import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        nameFr: true,
        phone: true,
        role: true,
        avatar: true,
        bio: true,
        bioFr: true,
        city: true,
        wilaya: true,
        isVerified: true,
        rating: true,
        totalReviews: true,
        specialties: true,
        experience: true,
        hourlyRate: true,
        shopName: true,
        shopNameFr: true,
        hasDelivery: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get counts for services, products, equipment
    const [servicesCount, productsCount, equipmentCount] = await Promise.all([
      db.service.count({ where: { providerId: id } }),
      db.product.count({ where: { merchantId: id } }),
      db.equipment.count({ where: { ownerId: id } }),
    ]);

    return NextResponse.json({
      ...user,
      stats: {
        services: servicesCount,
        products: productsCount,
        equipment: equipmentCount,
      },
    });
  } catch (error) {
    console.error('Fetch user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
