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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if user exists
    const existingUser = await db.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build update data from provided fields
    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      'name', 'nameFr', 'phone', 'bio', 'bioFr',
      'city', 'wilaya', 'specialties', 'experience',
      'hourlyRate', 'shopName', 'shopNameFr',
      'isVerified', 'avatar', 'hasDelivery',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
