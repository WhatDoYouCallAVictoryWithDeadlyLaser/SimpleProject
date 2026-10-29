import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file ảnh' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tạo tên file duy nhất theo timestamp để tránh trùng lặp
    const extension = path.extname(file.name) || '.jpg';
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    const uploadDir = path.join(process.cwd(), 'public', 'productImage');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    // Trả về đường dẫn tĩnh hiển thị trên web
    return NextResponse.json({ imageUrl: `/productImage/${fileName}` });
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error);
    return NextResponse.json({ error: 'Lỗi server khi upload ảnh' }, { status: 500 });
  }
}