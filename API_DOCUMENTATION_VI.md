# Bookstore API - Tài liệu cho Frontend

Tài liệu này mô tả các API public của ứng dụng quản lý sách.

## 1. Thông tin chung

| Thông tin | Giá trị |
|---|---|
| Base URL | `http://10.20.86.150:8080` |
| API sách | `/api/books` |
| API thể loại | `/api/categories` |
| Swagger UI | `http://10.20.86.150:8080/swagger-ui/index.html#/` |
| OpenAPI JSON | `http://10.20.86.150:8080/v3/api-docs` |
| Authentication | Không có, toàn bộ API public |
| Content-Type request | `application/json` |

Frontend không cần gửi `Authorization` header.

Frontend nên cấu hình Axios với base URL:

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.20.86.150:8080"
});
```

Backend đã bật CORS public để frontend chạy ở port khác vẫn gọi được API.

Frontend cần chạy trên cùng mạng LAN với máy backend và truy cập API bằng IP `10.20.86.150`. Nếu không kết nối được, kiểm tra Windows Firewall đã mở inbound TCP port `8080` chưa.

---

## 2. Cấu trúc dữ liệu

### 2.1. Category

```json
{
  "id": 1,
  "name": "Programming",
  "description": "Sample Programming books"
}
```

### 2.2. Book

```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "categoryId": 1,
  "categoryName": "Programming",
  "isbn": "9780132350884",
  "price": 29.99,
  "stockQuantity": 12,
  "publishedDate": "2020-01-01",
  "description": "Practical advice for writing clean software.",
  "coverImagePath": null,
  "coverImageContentType": null,
  "coverImageSize": null,
  "createdAt": "2026-10-08T15:11:05",
  "updatedAt": "2026-10-08T15:11:05"
}
```

Các trường hình ảnh hiện tại để `null`. Frontend có thể hiển thị ảnh mặc định cho đến khi có API upload ảnh.

Định dạng ngày:

- `publishedDate`: `YYYY-MM-DD`
- `createdAt`, `updatedAt`: ISO datetime, ví dụ `2026-10-08T15:11:05`

---

## 3. API Category

### 3.1. Lấy toàn bộ thể loại

```http
GET /api/categories
```

Response `200 OK`:

```json
[
  {
    "id": 1,
    "name": "Programming",
    "description": "Sample Programming books"
  },
  {
    "id": 2,
    "name": "Fiction",
    "description": "Sample Fiction books"
  }
]
```

Frontend nên gọi API này khi mở form tạo hoặc sửa sách để hiển thị dropdown thể loại.

### 3.2. Lấy một thể loại

```http
GET /api/categories/{id}
```

Ví dụ:

```http
GET /api/categories/1
```

### 3.3. Tạo thể loại

```http
POST /api/categories
Content-Type: application/json
```

Request body:

```json
{
  "name": "Biography",
  "description": "Books about real people and their lives"
}
```

Response `201 Created` trả về category vừa tạo.

Validation:

- `name`: bắt buộc, tối đa 100 ký tự
- `description`: tối đa 500 ký tự
- Tên thể loại không được trùng, không phân biệt hoa thường

### 3.4. Sửa thể loại

```http
PUT /api/categories/{id}
Content-Type: application/json
```

Ví dụ:

```http
PUT /api/categories/1
```

```json
{
  "name": "Software Development",
  "description": "Books about software development"
}
```

Response `200 OK` trả về category đã cập nhật.

### 3.5. Xóa thể loại

```http
DELETE /api/categories/{id}
```

Response thành công: `204 No Content`.

Không thể xóa thể loại đang được sách sử dụng. Khi đó API trả `409 Conflict`.

---

## 4. API Book

### 4.1. Lấy danh sách và filter sách

```http
GET /api/books
```

API này hỗ trợ tìm kiếm, filter, phân trang và sắp xếp.

### Query parameters

| Parameter | Kiểu | Bắt buộc | Mặc định | Ý nghĩa |
|---|---|---:|---:|---|
| `keyword` | string | Không | Không | Tìm gần đúng trong title, author hoặc category name |
| `author` | string | Không | Không | Tìm gần đúng theo tác giả |
| `categoryId` | number | Không | Không | Lọc chính xác theo id thể loại |
| `minPrice` | decimal | Không | Không | Giá lớn hơn hoặc bằng giá trị này |
| `maxPrice` | decimal | Không | Không | Giá nhỏ hơn hoặc bằng giá trị này |
| `page` | number | Không | `0` | Số trang, bắt đầu từ 0 |
| `size` | number | Không | `10` | Số item mỗi trang |
| `sort` | string | Không | `title,asc` | Cột và hướng sort, ví dụ `price,desc` |

Ví dụ không filter:

```http
GET http://10.20.86.150:8080/api/books
```

Ví dụ lấy trang đầu tiên, 10 sách:

```http
GET http://10.20.86.150:8080/api/books?page=0&size=10
```

Ví dụ tìm tác giả có chữ `Martin`:

```http
GET http://10.20.86.150:8080/api/books?author=Martin&page=0&size=10
```

Ví dụ lọc thể loại Programming có `categoryId=1`:

```http
GET http://10.20.86.150:8080/api/books?categoryId=1&page=0&size=10
```

Ví dụ lọc theo khoảng giá:

```http
GET http://10.20.86.150:8080/api/books?minPrice=15&maxPrice=30&page=0&size=10
```

Ví dụ kết hợp nhiều filter:

```http
GET http://10.20.86.150:8080/api/books?author=Martin&categoryId=1&minPrice=20&maxPrice=50&page=0&size=10&sort=price,desc
```

Khi kết hợp các parameter, các nhóm filter được nối với nhau bằng điều kiện `AND`:

```text
author chứa Martin
AND categoryId bằng 1
AND price >= 20
AND price <= 50
```

Riêng `keyword` tìm trong ba trường bằng điều kiện `OR`:

```text
title chứa keyword
OR author chứa keyword
OR category name chứa keyword
```

### Response phân trang

Response là một object, danh sách sách nằm trong thuộc tính `content`:

```json
{
  "content": [
    {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "categoryId": 1,
      "categoryName": "Programming",
      "isbn": "9780132350884",
      "price": 29.99,
      "stockQuantity": 12,
      "publishedDate": "2020-01-01",
      "description": "Practical advice for writing clean software.",
      "coverImagePath": null,
      "coverImageContentType": null,
      "coverImageSize": null,
      "createdAt": "2026-10-08T15:11:05",
      "updatedAt": "2026-10-08T15:11:05"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalElements": 30,
  "totalPages": 3,
  "size": 10,
  "number": 0,
  "numberOfElements": 10,
  "first": true,
  "last": false,
  "empty": false
}
```

Frontend thường dùng:

- `content`: render danh sách sách
- `totalElements`: tổng số kết quả
- `totalPages`: tổng số trang
- `number`: trang hiện tại, bắt đầu từ 0
- `first`: có phải trang đầu không
- `last`: có phải trang cuối không
- `empty`: không có kết quả không

### 4.2. Lấy chi tiết sách

```http
GET /api/books/{id}
```

Ví dụ:

```http
GET /api/books/1
```

Nếu không tìm thấy sách, API trả `404 Not Found`.

### 4.3. Tạo sách

```http
POST /api/books
Content-Type: application/json
```

Request body:

```json
{
  "title": "Spring Boot in Action",
  "author": "Craig Walls",
  "categoryId": 1,
  "isbn": "9781617292545",
  "price": 32.99,
  "stockQuantity": 8,
  "publishedDate": "2024-01-15",
  "description": "A practical Spring Boot guide"
}
```

Response: `201 Created`.

Các field bắt buộc:

- `title`
- `author`
- `categoryId`
- `price`
- `stockQuantity`

Quy tắc validation:

- `title`: tối đa 200 ký tự
- `author`: tối đa 150 ký tự
- `categoryId`: phải trỏ tới thể loại tồn tại
- `isbn`: không bắt buộc, tối đa 20 ký tự
- `price`: lớn hơn hoặc bằng 0
- `stockQuantity`: lớn hơn hoặc bằng 0
- `description`: tối đa 1000 ký tự

### 4.4. Sửa sách

```http
PUT /api/books/{id}
Content-Type: application/json
```

Request body có cấu trúc giống API tạo sách:

```json
{
  "title": "Spring Boot in Action - Updated",
  "author": "Craig Walls",
  "categoryId": 1,
  "isbn": "9781617292545",
  "price": 35.99,
  "stockQuantity": 12,
  "publishedDate": "2024-01-15",
  "description": "Updated description"
}
```

Response: `200 OK`.

### 4.5. Xóa sách

```http
DELETE /api/books/{id}
```

Response thành công: `204 No Content`.

Đây là hard delete, dữ liệu sách bị xóa khỏi database.

---

## 5. Cách làm filter ở frontend bằng Axios

Frontend chỉ cần giữ trạng thái filter và truyền vào `params` của Axios. Không tải toàn bộ sách về rồi mới filter ở frontend.

### 5.1. Cài Axios và tạo API client

```bash
npm install axios
```

Tạo file `src/api/apiClient.js`:

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.20.86.150:8080",
  headers: {
    "Content-Type": "application/json"
  }
});
```

### 5.2. Hàm lấy sách và filter

```javascript
import { api } from "./apiClient";

export async function getBooks({
  keyword = "",
  author = "",
  categoryId = "",
  minPrice = "",
  maxPrice = "",
  page = 0,
  size = 10,
  sort = "title,asc"
} = {}) {
  const params = { page, size, sort };

  if (keyword.trim()) params.keyword = keyword.trim();
  if (author.trim()) params.author = author.trim();
  if (categoryId) params.categoryId = categoryId;
  if (minPrice !== "") params.minPrice = minPrice;
  if (maxPrice !== "") params.maxPrice = maxPrice;

  const response = await api.get("/api/books", { params });
  return response.data;
}
```

### 5.3. Sử dụng filter

```javascript
const result = await getBooks({
  author: "Martin",
  categoryId: 1,
  minPrice: 20,
  maxPrice: 50,
  page: 0,
  size: 10,
  sort: "price,desc"
});

const books = result.content;
const totalPages = result.totalPages;
```

### 5.4. Khi chuyển trang

```javascript
const nextPage = currentPage + 1;

const result = await getBooks({
  author: currentAuthor,
  categoryId: currentCategoryId,
  page: nextPage,
  size: 10,
  sort: "title,asc"
});
```

Lưu ý: `page` bắt đầu từ `0`, nên trang đầu tiên là `page=0`, trang thứ hai là `page=1`.

### 5.5. Khi người dùng bấm tìm kiếm

Nên reset về trang đầu tiên:

```javascript
await getBooks({
  keyword: searchText,
  author: authorText,
  categoryId: selectedCategoryId,
  page: 0,
  size: 10
});
```

Nếu filter thay đổi, luôn reset `page` về `0` để tránh trường hợp trang hiện tại không còn dữ liệu.

---

## 6. Ví dụ gọi CRUD bằng Axios

### Tạo sách

```javascript
async function createBook(book) {
  const response = await api.post("/api/books", book);
  return response.data;
}

await createBook({
  title: "New Book",
  author: "New Author",
  categoryId: 1,
  isbn: "1234567890",
  price: 19.99,
  stockQuantity: 5,
  publishedDate: "2026-01-01",
  description: "Book description"
});
```

### Sửa sách

```javascript
async function updateBook(id, book) {
  const response = await api.put(`/api/books/${id}`, book);
  return response.data;
}
```

### Xóa sách

```javascript
async function deleteBook(id) {
  await api.delete(`/api/books/${id}`);
}
```

Axios tự động đưa response body vào `response.data`. Với lỗi HTTP, Axios throw exception; có thể lấy status và message như sau:

```javascript
try {
  await deleteBook(bookId);
} catch (error) {
  const status = error.response?.status;
  const message = error.response?.data?.message || "Có lỗi xảy ra";
  console.error(status, message);
}
```

---

## 7. HTTP status và xử lý lỗi

| Status | Ý nghĩa |
|---:|---|
| `200` | Lấy hoặc cập nhật dữ liệu thành công |
| `201` | Tạo dữ liệu thành công |
| `204` | Xóa thành công, không có response body |
| `400` | Dữ liệu request không hợp lệ |
| `404` | Không tìm thấy sách hoặc thể loại |
| `409` | Xung đột dữ liệu, ví dụ tên thể loại trùng hoặc xóa thể loại đang có sách |

Ví dụ lỗi validation:

```json
{
  "status": 400,
  "message": "Validation failed",
  "timestamp": "2026-10-08T15:30:00",
  "details": {
    "title": "Title is required",
    "price": "Price must be greater than or equal to 0"
  }
}
```

Ví dụ lỗi không tìm thấy:

```json
{
  "status": 404,
  "message": "Book not found with id: 999",
  "timestamp": "2026-10-08T15:30:00",
  "details": null
}
```

Frontend nên hiển thị `details` khi status là `400`, và hiển thị `message` cho các lỗi còn lại.

---

## 8. Test nhanh trên Swagger

1. Khởi động SQL Server:

   ```powershell
   docker start sqlserver
   ```

2. Khai báo biến môi trường `DB_PASSWORD` bằng mật khẩu `sa` của container.

3. Chạy backend:

   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

4. Mở:

   ```text
   http://10.20.86.150:8080/swagger-ui/index.html#/
   ```

5. Thứ tự test đề xuất:

   - `GET /api/categories`
   - `GET /api/books`
   - `GET /api/books` với `author` hoặc `categoryId`
   - `POST /api/books`
   - `GET /api/books/{id}`
   - `PUT /api/books/{id}`
   - `DELETE /api/books/{id}`

Database local đã được seed sẵn 30 sách mẫu khi bảng `books` chưa có dữ liệu.
