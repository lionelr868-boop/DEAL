import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const categories = await db.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Fetch service categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nameFr, icon, description, descriptionFr, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      );
    }

    const category = await db.serviceCategory.create({
      data: {
        name,
        nameFr: nameFr || null,
        icon: icon || null,
        description: description || null,
        descriptionFr: descriptionFr || null,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Create service category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id query parameter is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existing = await db.serviceCategory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has services (cascade will handle, but good to warn)
    const serviceCount = await db.service.count({ where: { categoryId: id } });

    await db.serviceCategory.delete({ where: { id } });

    return NextResponse.json({
      message: 'Category deleted successfully',
      deletedServicesCount: serviceCount,
    });
  } catch (error) {
    console.error('Delete service category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
