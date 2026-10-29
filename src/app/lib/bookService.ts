import { apiClient } from './apiClient';
import type { Book, BookFilterParams, BookPayload, PageResponse } from './types';

// ──────────────────────────────────────────
// 1. Lấy danh sách sách (có filter + phân trang)
// ──────────────────────────────────────────
export async function getBooks(filters: BookFilterParams = {}): Promise<PageResponse<Book>> {
  const {
    keyword = '',
    author = '',
    categoryId = '',
    minPrice = '',
    maxPrice = '',
    page = 0,
    size = 10,
    sort = 'title,asc',
  } = filters;

  // Chỉ truyền param khi có giá trị (tránh gửi "" lên server)
  const params: Record<string, string | number> = { page, size, sort };
  if (keyword.toString().trim()) params.keyword = keyword.toString().trim();
  if (author.toString().trim()) params.author = author.toString().trim();
  if (categoryId !== '' && categoryId !== undefined) params.categoryId = categoryId;
  if (minPrice !== '') params.minPrice = minPrice;
  if (maxPrice !== '') params.maxPrice = maxPrice;

  const response = await apiClient.get<PageResponse<Book>>('/api/books', { params });
  return response.data;
}

// ──────────────────────────────────────────
// 2. Lấy chi tiết một cuốn sách theo ID
// ──────────────────────────────────────────
export async function getBookById(id: number): Promise<Book> {
  const response = await apiClient.get<Book>(`/api/books/${id}`);
  return response.data;
}

// ──────────────────────────────────────────
// 3. Tạo sách mới
// ──────────────────────────────────────────
export async function createBook(payload: BookPayload): Promise<Book> {
  const response = await apiClient.post<Book>('/api/books', payload);
  return response.data;
}

// ──────────────────────────────────────────
// 4. Sửa thông tin sách
// ──────────────────────────────────────────
export async function updateBook(id: number, payload: BookPayload): Promise<Book> {
  const response = await apiClient.put<Book>(`/api/books/${id}`, payload);
  return response.data;
}

// ──────────────────────────────────────────
// 5. Xóa sách
// ──────────────────────────────────────────
export async function deleteBook(id: number): Promise<void> {
  await apiClient.delete(`/api/books/${id}`);
}
