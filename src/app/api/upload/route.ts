import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!file.name || !file.size) continue;

      // Generate unique filename
      const ext = path.extname(file.name) || '.jpg';
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      uploadedUrls.push(`/uploads/${uniqueName}`);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid files uploaded' },
        { status: 400 }
      );
    }

    // Return comma-separated URLs (matching Prisma String? field)
    return NextResponse.json({
      urls: uploadedUrls,
      images: uploadedUrls.join(','),
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
