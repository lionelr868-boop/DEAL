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
      pendingComplaints,
      recentUsers,
      recentBookings,
      recentOrders,
      recentReviews,
      recentComplaints,
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
      // Pending complaints count
      db.complaint.count({ where: { status: 'PENDING' } }),
      // Last 5 registered users
      db.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          nameFr: true,
          role: true,
          avatar: true,
          createdAt: true,
        },
      }),
      // Recent bookings (last 10)
      db.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          type: true,
          status: true,
          totalPrice: true,
          createdAt: true,
          customer: { select: { id: true, name: true, nameFr: true } },
          provider: { select: { id: true, name: true, nameFr: true } },
        },
      }),
      // Recent orders (last 10)
      db.productOrder.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          quantity: true,
          totalPrice: true,
          status: true,
          createdAt: true,
          customer: { select: { id: true, name: true, nameFr: true } },
          merchant: { select: { id: true, name: true, nameFr: true } },
        },
      }),
      // Recent reviews (last 10)
      db.review.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          rating: true,
          comment: true,
          commentFr: true,
          createdAt: true,
          author: { select: { id: true, name: true, nameFr: true } },
          target: { select: { id: true, name: true, nameFr: true } },
        },
      }),
      // Recent complaints (last 10)
      db.complaint.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          subject: true,
          subjectFr: true,
          status: true,
          createdAt: true,
          user: { select: { id: true, name: true, nameFr: true } },
        },
      }),
    ]);

    // Build a role -> count map
    const roleMap: Record<string, number> = {};
    for (const group of usersByRole) {
      roleMap[group.role.toLowerCase()] = group._count.role;
    }

    const totalUsers = usersByRole.reduce((sum, g) => sum + g._count.role, 0);

    // Build recent activity list — combine and sort by createdAt
    const recentActivity = [
      ...recentBookings.map((b) => ({
        id: b.id,
        type: 'booking',
        label: `Booking #${b.id.slice(0, 8)}`,
        labelFr: `Réservation #${b.id.slice(0, 8)}`,
        detail: `${b.customer.name} → ${b.provider.name}`,
        detailFr: `${b.customer.nameFr || b.customer.name} → ${b.provider.nameFr || b.provider.name}`,
        status: b.status,
        createdAt: b.createdAt.toISOString(),
      })),
      ...recentOrders.map((o) => ({
        id: o.id,
        type: 'order',
        label: `Order #${o.id.slice(0, 8)}`,
        labelFr: `Commande #${o.id.slice(0, 8)}`,
        detail: `${o.customer.name} → ${o.merchant.name}`,
        detailFr: `${o.customer.nameFr || o.customer.name} → ${o.merchant.nameFr || o.merchant.name}`,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
      })),
      ...recentReviews.map((r) => ({
        id: r.id,
        type: 'review',
        label: `Review by ${r.author.name}`,
        labelFr: `Avis de ${r.author.nameFr || r.author.name}`,
        detail: `${r.rating}/5 — ${r.comment || 'No comment'}`,
        detailFr: `${r.rating}/5 — ${r.commentFr || r.comment || 'Pas de commentaire'}`,
        status: null,
        createdAt: r.createdAt.toISOString(),
      })),
      ...recentComplaints.map((c) => ({
        id: c.id,
        type: 'complaint',
        label: `Complaint: ${c.subject}`,
        labelFr: `Plainte: ${c.subjectFr || c.subject}`,
        detail: `By ${c.user.name}`,
        detailFr: `Par ${c.user.nameFr || c.user.name}`,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
     .slice(0, 10);

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
      pendingComplaints,
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        name: u.name,
        nameFr: u.nameFr,
        role: u.role,
        avatar: u.avatar,
        createdAt: u.createdAt.toISOString(),
      })),
      recentActivity,
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
