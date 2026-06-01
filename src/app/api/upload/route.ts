import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// تهيئة عميل Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase credentials are not configured' },
        { status: 500 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!file.name || !file.size) continue;

      // توليد اسم فريد للملف
      const ext = file.name.split('.').pop() || 'jpg';
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      
      // تحويل الملف
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // الرفع إلى Supabase Storage (نفترض وجود bucket باسم 'uploads')
      const { data, error } = await supabase
        .storage
        .from('uploads')
        .upload(uniqueName, buffer, {
          contentType: file.type,
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        continue;
      }

      // الحصول على الرابط العام
      const { data: publicUrlData } = supabase
        .storage
        .from('uploads')
        .getPublicUrl(uniqueName);

      if (publicUrlData && publicUrlData.publicUrl) {
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid files uploaded' },
        { status: 400 }
      );
    }

    // إرجاع الروابط مفصولة بفاصلة لتتوافق مع قاعدة البيانات
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
