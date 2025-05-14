import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { error: 'Không tìm thấy file.' },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Chỉ cho phép file ảnh jpg, jpeg, png, webp.' },
        { status: 400 },
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });
    if (uploadError) {
      return NextResponse.json({ error: 'Lỗi upload file.' }, { status: 500 });
    }
    return NextResponse.json({ url: filePath });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Lỗi upload ảnh',
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
};
