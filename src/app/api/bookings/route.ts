import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const providerId = searchParams.get('providerId');

    const where: Record<string, unknown> = {};

    if (customerId) {
      where.customerId = customerId;
    }
    if (providerId) {
      where.providerId = providerId;
    }

    const bookings = await db.booking.findMany({
      where,
      include: {
        service: {
          include: {
            category: true,
          },
        },
        equipment: true,
        customer: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            phone: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
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
      customerId,
      providerId,
      type,
      serviceId,
      equipmentId,
      startDate,
      endDate,
      address,
      description,
      totalPrice,
      notes,
    } = body;

    // Validate required fields
    if (!customerId || !providerId || !type || !startDate || totalPrice == null) {
      return NextResponse.json(
        { error: 'customerId, providerId, type, startDate, and totalPrice are required' },
        { status: 400 }
      );
    }

    const validTypes = ['SERVICE', 'EQUIPMENT'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be SERVICE or EQUIPMENT' },
        { status: 400 }
      );
    }

    const booking = await db.booking.create({
      data: {
        customerId,
        providerId,
        type,
        serviceId: serviceId || null,
        equipmentId: equipmentId || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        address: address || null,
        description: description || null,
        totalPrice: parseFloat(totalPrice),
        notes: notes || null,
        status: 'PENDING',
      },
      include: {
        service: { include: { category: true } },
        equipment: true,
        customer: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            phone: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Booking id and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await db.booking.findUnique({ where: { id } });
    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    const allowed = validTransitions[existingBooking.status] || [];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${existingBooking.status} to ${status}` },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { status };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const booking = await db.booking.update({
      where: { id },
      data: updateData,
      include: {
        service: { include: { category: true } },
        equipment: true,
        customer: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            phone: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
