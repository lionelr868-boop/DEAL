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
    ] = await Promise.all([
      db.user.groupBy({ by: ['role'], _count: { role: true } }),
      db.service.count(),
      db.product.count(),
      db.equipment.count(),
      db.booking.count(),
    ]);

    // Build a role -> count map
    const roleMap: Record<string, number> = {};
    for (const group of usersByRole) {
      roleMap[group.role.toLowerCase()] = group._count.role;
    }

    return NextResponse.json({
      users: {
        total: usersByRole.reduce((sum, g) => sum + g._count.role, 0),
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
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
