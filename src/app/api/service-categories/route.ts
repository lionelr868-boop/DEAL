import { NextResponse } from 'next/server';
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
