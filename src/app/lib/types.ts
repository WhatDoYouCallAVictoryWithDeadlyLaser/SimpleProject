// =============================================
// KIỂU DỮ LIỆU THEO API CỦA BẠN BẠN
// =============================================

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  categoryId: number;
  categoryName: string;
  isbn: string | null;
  price: number;
  stockQuantity: number;
  publishedDate: string;        // "YYYY-MM-DD"
  description: string | null;
  coverImagePath: string | null;
  coverImageContentType: string | null;
  coverImageSize: number | null;
  createdAt: string;            // ISO datetime
  updatedAt: string;
}

// Kiểu response phân trang từ server
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;   // trang hiện tại, bắt đầu từ 0
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Kiểu lỗi API trả về
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  details: Record<string, string> | null;
}

// Tham số lọc & phân trang cho GET /api/books
export interface BookFilterParams {
  keyword?: string;
  author?: string;
  categoryId?: number | '';
  minPrice?: number | '';
  maxPrice?: number | '';
  page?: number;
  size?: number;
  sort?: string;
}

// Body để tạo / sửa sách
export interface BookPayload {
  title: string;
  author: string;
  categoryId: number;
  isbn?: string;
  price: number;
  stockQuantity: number;
  publishedDate?: string;
  description?: string;
}

// Body để tạo / sửa thể loại
export interface CategoryPayload {
  name: string;
  description?: string;
}
