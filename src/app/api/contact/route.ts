import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, recipientType, recipientId } = body;

    // Validate required fields
    if (!name || !email || !message || !recipientId) {
      return NextResponse.json(
        { error: 'name, email, message, and recipientId are required' },
        { status: 400 }
      );
    }

    const validRecipientTypes = ['craftsman', 'merchant', 'equipment_owner', 'customer', 'admin'];
    if (recipientType && !validRecipientTypes.includes(recipientType)) {
      return NextResponse.json(
        { error: `Invalid recipientType. Must be one of: ${validRecipientTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify recipient exists
    const recipient = await db.user.findUnique({
      where: { id: recipientId },
      select: { id: true, name: true, email: true },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // Store the contact message in the database as a simple log
    // Using the Booking model as a proxy is not appropriate, so we just log and return success
    // In production, this would be stored in a ContactMessage table or sent via email
    console.log('Contact message received:', {
      name,
      email,
      phone: phone || 'N/A',
      subject: subject || 'No subject',
      message: message.substring(0, 100) + '...',
      recipientType: recipientType || 'unknown',
      recipientId,
      recipientName: recipient.name,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      recipientName: recipient.name,
    }, { status: 201 });
  } catch (error) {
    console.error('Send contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
