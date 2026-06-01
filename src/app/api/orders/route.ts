import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const merchantId = searchParams.get('merchantId');

    const where: Record<string, unknown> = {};

    if (customerId) {
      where.customerId = customerId;
    }
    if (merchantId) {
      where.merchantId = merchantId;
    }

    const orders = await db.productOrder.findMany({
      where,
      include: {
        product: {
          include: {
            category: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            phone: true,
          },
        },
        merchant: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            phone: true,
            shopName: true,
            shopNameFr: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
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
      merchantId,
      productId,
      quantity,
      deliveryAddress,
      notes,
    } = body;

    // Validate required fields
    if (!customerId || !merchantId || !productId || !quantity) {
      return NextResponse.json(
        { error: 'customerId, merchantId, productId, and quantity are required' },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity < 1 || quantity > 100) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Check product exists and get price
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const totalPrice = product.price * quantity;

    const order = await db.productOrder.create({
      data: {
        customerId,
        merchantId,
        productId,
        quantity: parseInt(quantity),
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        deliveryAddress: deliveryAddress || null,
        notes: notes || null,
        status: 'PENDING',
      },
      include: {
        product: { include: { category: true } },
        customer: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            phone: true,
          },
        },
        merchant: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            phone: true,
            shopName: true,
            shopNameFr: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
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
        { error: 'Order id and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const existingOrder = await db.productOrder.findUnique({ where: { id } });
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const validTransitions: Record<string, string[]> = {
      PENDING: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    const allowed = validTransitions[existingOrder.status] || [];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${existingOrder.status} to ${status}` },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { status };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const order = await db.productOrder.update({
      where: { id },
      data: updateData,
      include: {
        product: { include: { category: true } },
        customer: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            phone: true,
          },
        },
        merchant: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            avatar: true,
            phone: true,
            shopName: true,
            shopNameFr: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
