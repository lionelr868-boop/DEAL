import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [
      usersByRole,
      totalServices,
      totalProducts,
      totalEquipment,
      totalBookings,
      totalOrders,
      avgRating,
    ] = await Promise.all([
      db.user.groupBy({ by: ['role'], _count: { role: true } }),
      db.service.count(),
      db.product.count(),
      db.equipment.count(),
      db.booking.count(),
      db.productOrder.count(),
      // Average rating across all rated users
      db.user.aggregate({
        _avg: { rating: true },
        where: { rating: { gt: 0 } },
      }),
    ]);

    // Build a role -> count map
    const roleMap: Record<string, number> = {};
    for (const group of usersByRole) {
      roleMap[group.role.toLowerCase()] = group._count.role;
    }

    const totalUsers = usersByRole.reduce((sum, g) => sum + g._count.role, 0);

    return NextResponse.json({
      users: {
        total: totalUsers,
        customers: roleMap['customer'] || 0,
        craftsmen: roleMap['craftsman'] || 0,
        merchants: roleMap['merchant'] || 0,
        equipmentOwners: roleMap['equipment_owner'] || 0,
        admins: roleMap['admin'] || 0,
      },
      services: totalServices,
      products: totalProducts,
      equipment: totalEquipment,
      bookings: totalBookings,
      orders: totalOrders,
      avgRating: avgRating._avg.rating
        ? Math.round(avgRating._avg.rating * 10) / 10
        : 0,
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
