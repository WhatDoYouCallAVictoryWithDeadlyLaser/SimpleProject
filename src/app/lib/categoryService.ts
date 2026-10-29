import { apiClient } from './apiClient';
import type { Category, CategoryPayload } from './types';

// ──────────────────────────────────────────
// 1. Lấy toàn bộ thể loại
// ──────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/api/categories');
  return response.data;
}

// ──────────────────────────────────────────
// 2. Lấy một thể loại theo ID
// ──────────────────────────────────────────
export async function getCategoryById(id: number): Promise<Category> {
  const response = await apiClient.get<Category>(`/api/categories/${id}`);
  return response.data;
}

// ──────────────────────────────────────────
// 3. Tạo thể loại mới
// ──────────────────────────────────────────
export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const response = await apiClient.post<Category>('/api/categories', payload);
  return response.data;
}

// ──────────────────────────────────────────
// 4. Sửa thể loại
// ──────────────────────────────────────────
export async function updateCategory(id: number, payload: CategoryPayload): Promise<Category> {
  const response = await apiClient.put<Category>(`/api/categories/${id}`, payload);
  return response.data;
}

// ──────────────────────────────────────────
// 5. Xóa thể loại
//    Lưu ý: Trả 409 Conflict nếu thể loại đang có sách
// ──────────────────────────────────────────
export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/api/categories/${id}`);
}
