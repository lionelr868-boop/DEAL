import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const DEFAULT_SETTINGS = {
  platformName: 'DEAL',
  contactEmail: 'contact@deal.dz',
  supportPhone: '',
  maintenanceMode: false,
  siteDescription: '',
  siteDescriptionFr: '',
};

export async function GET() {
  try {
    // Get the first (and only) settings record
    const settings = await db.platformSettings.findFirst();

    if (!settings) {
      // Return hardcoded defaults if none saved
      return NextResponse.json({
        ...DEFAULT_SETTINGS,
        id: null,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Fetch platform settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      platformName,
      contactEmail,
      supportPhone,
      maintenanceMode,
      siteDescription,
      siteDescriptionFr,
    } = body;

    // Check if settings already exist
    const existing = await db.platformSettings.findFirst();

    if (existing) {
      // Update existing
      const updated = await db.platformSettings.update({
        where: { id: existing.id },
        data: {
          platformName: platformName ?? existing.platformName,
          contactEmail: contactEmail ?? existing.contactEmail,
          supportPhone: supportPhone !== undefined ? supportPhone : existing.supportPhone,
          maintenanceMode: maintenanceMode !== undefined ? maintenanceMode : existing.maintenanceMode,
          siteDescription: siteDescription !== undefined ? siteDescription : existing.siteDescription,
          siteDescriptionFr: siteDescriptionFr !== undefined ? siteDescriptionFr : existing.siteDescriptionFr,
        },
      });
      return NextResponse.json(updated);
    }

    // Create new settings
    const created = await db.platformSettings.create({
      data: {
        platformName: platformName || DEFAULT_SETTINGS.platformName,
        contactEmail: contactEmail || DEFAULT_SETTINGS.contactEmail,
        supportPhone: supportPhone || '',
        maintenanceMode: maintenanceMode || false,
        siteDescription: siteDescription || '',
        siteDescriptionFr: siteDescriptionFr || '',
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Save platform settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
