import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { Product } from '@/app/types/product';

const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'products.ts');

// 1. Hàm đọc mảng Product[] trực tiếp từ file products.ts
async function readProductsFromTS(): Promise<Product[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Tìm vị trí dấu '=' trước để bỏ qua chữ 'Product[]'
    const equalIndex = content.indexOf('=');
    if (equalIndex !== -1) {
      // Tìm dấu '[' bắt đầu tính TỪ SAU DẤU '='
      const start = content.indexOf('[', equalIndex);
      const end = content.lastIndexOf(']');
      
      if (start !== -1 && end !== -1 && end > start) {
        const jsonText = content.substring(start, end + 1);
        return JSON.parse(jsonText);
      }
    }
    return [];
  } catch (error) {
    console.error('Lỗi khi đọc file products.ts:', error);
    return [];
  }
}

// 2. Hàm ghi mảng Product[] trực tiếp thành mã TypeScript vào products.ts
async function writeProductsToTS(products: Product[]): Promise<void> {
  const codeContent = `import {Product} from "../types/product";\n\nexport const products: Product[] = ${JSON.stringify(products, null, 4)};\n`;
  await fs.writeFile(filePath, codeContent, 'utf-8');
}

// GET: Lấy danh sách sản phẩm
export async function GET() {
  const products = await readProductsFromTS();
  return NextResponse.json(products);
}

// POST: Thêm sản phẩm mới
export async function POST(req: NextRequest) {
  try {
    const newProduct: Product = await req.json();
    const products = await readProductsFromTS();
    const updated = [newProduct, ...products];
    await writeProductsToTS(updated);
    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Không thể thêm sản phẩm' }, { status: 500 });
  }
}

// PUT: Cập nhật thông tin và ảnh sản phẩm
export async function PUT(req: NextRequest) {
  try {
    const updatedProduct: Product = await req.json();
    const products = await readProductsFromTS();
    const updated = products.map((item) =>
      item.id === updatedProduct.id ? updatedProduct : item
    );
    await writeProductsToTS(updated);
    return NextResponse.json(updatedProduct);
  } catch {
    return NextResponse.json({ error: 'Không thể sửa sản phẩm' }, { status: 500 });
  }
}

// DELETE: Xóa sản phẩm (?id=...)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    const products = await readProductsFromTS();
    const updated = products.filter((item) => item.id !== id);
    await writeProductsToTS(updated);
    return NextResponse.json({ message: 'Đã xóa thành công' });
  } catch {
    return NextResponse.json({ error: 'Không thể xóa sản phẩm' }, { status: 500 });
  }
}