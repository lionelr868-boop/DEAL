import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, nameFr, phone, role } = body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required' },
        { status: 400 }
      );
    }

    const validRoles = ['CUSTOMER', 'CRAFTSMAN', 'MERCHANT', 'EQUIPMENT_OWNER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: CUSTOMER, CRAFTSMAN, MERCHANT, EQUIPMENT_OWNER' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password (simple base64 for MVP)
    const hashedPassword = Buffer.from(password).toString('base64');

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        nameFr: nameFr || null,
        phone: phone || null,
        role,
      },
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
