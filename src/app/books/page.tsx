'use client';

import { useState, useEffect, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import { getBooks } from '../lib/bookService';
import { getCategories } from '../lib/categoryService';
import type { Book, Category, BookFilterParams } from '../lib/types';

const SORT_OPTIONS = [
  { value: 'title,asc', label: 'Tên A → Z' },
  { value: 'title,desc', label: 'Tên Z → A' },
  { value: 'price,asc', label: 'Giá thấp đến cao' },
  { value: 'price,desc', label: 'Giá cao đến thấp' },
  { value: 'publishedDate,desc', label: 'Mới nhất' },
];

export default function BooksPage() {
  // ── State dữ liệu ──
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // ── State filter ──
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sort, setSort] = useState('title,asc');

  // ── State UI ──
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Load categories 1 lần khi mount ──
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => console.error('Không thể tải danh mục'));
  }, []);

  // ── Hàm tải sách ──
  const fetchBooks = useCallback(async (page: number, filters: BookFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBooks({ ...filters, page, size: 12 });
      setBooks(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      setError('Không thể kết nối đến server. Kiểm tra máy bạn bạn đang chạy backend (10.20.86.150:8080).');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Load lại khi trang thay đổi ──
  useEffect(() => {
    fetchBooks(currentPage, { keyword, categoryId, minPrice, maxPrice, sort });
  }, [currentPage, sort, fetchBooks]);

  // ── Bấm Tìm kiếm: reset về trang 0 ──
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchBooks(0, { keyword, categoryId, minPrice, maxPrice, sort });
  };

  // ── Reset bộ lọc ──
  const handleReset = () => {
    setKeyword('');
    setCategoryId('');
    setMinPrice('');
    setMaxPrice('');
    setSort('title,asc');
    setCurrentPage(0);
    fetchBooks(0, {});
  };

  return (
    <Container className="py-4">
      {/* Tiêu đề */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">📚 Kho Sách</h2>
          <p className="text-muted small mb-0">
            {totalElements > 0 ? `Tìm thấy ${totalElements} cuốn sách` : 'Đang tải...'}
          </p>
        </div>
      </div>

      {/* ── THANH LỌC ── */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-3">
              {/* Ô tìm kiếm */}
              <Col md={4}>
                <Form.Label className="fw-semibold small">🔍 Tìm kiếm</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Tên sách, tác giả, thể loại..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </InputGroup>
              </Col>

              {/* Lọc thể loại */}
              <Col md={2}>
                <Form.Label className="fw-semibold small">📂 Thể loại</Form.Label>
                <Form.Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                >
                  <option value="">Tất cả</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Col>

              {/* Lọc khoảng giá */}
              <Col md={2}>
                <Form.Label className="fw-semibold small">💰 Giá từ ($)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                />
              </Col>
              <Col md={2}>
                <Form.Label className="fw-semibold small">💰 đến ($)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  placeholder="999"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                />
              </Col>

              {/* Sắp xếp */}
              <Col md={2}>
                <Form.Label className="fw-semibold small">↕️ Sắp xếp</Form.Label>
                <Form.Select value={sort} onChange={(e) => { setSort(e.target.value); setCurrentPage(0); }}>
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* Nút tìm & reset */}
            <div className="d-flex gap-2 mt-3">
              <Button variant="primary" type="submit" className="px-4 fw-semibold">
                🔍 Tìm kiếm
              </Button>
              <Button variant="outline-secondary" type="button" onClick={handleReset}>
                ↺ Xoá bộ lọc
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* ── THÔNG BÁO LỖI ── */}
      {error && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </Alert>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Đang tải dữ liệu từ server...</p>
        </div>
      )}

      {/* ── DANH SÁCH SÁCH ── */}
      {!loading && !error && (
        <>
          {books.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div className="fs-1">📭</div>
              <p className="mt-2">Không tìm thấy sách nào phù hợp</p>
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4 mb-4">
              {books.map((book) => (
                <Col key={book.id}>
                  <Card className="h-100 shadow-sm border-0 hover-shadow transition-all">
                    {/* Ảnh bìa */}
                    <div
                      className="bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center"
                      style={{ height: '200px' }}
                    >
                      {book.coverImagePath ? (
                        <Card.Img
                          src={`http://10.20.86.150:8080${book.coverImagePath}`}
                          alt={book.title}
                          style={{ height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ fontSize: '4rem' }}>📖</span>
                      )}
                    </div>

                    <Card.Body className="d-flex flex-column">
                      {/* Badge thể loại */}
                      <Badge bg="primary" className="mb-2 align-self-start">
                        {book.categoryName}
                      </Badge>

                      {/* Tiêu đề */}
                      <Card.Title className="fw-bold small lh-sm mb-1" style={{ fontSize: '0.9rem' }}>
                        {book.title}
                      </Card.Title>

                      {/* Tác giả */}
                      <p className="text-muted small mb-2">✍️ {book.author}</p>

                      {/* Mô tả */}
                      {book.description && (
                        <p className="text-muted small mb-3 flex-grow-1"
                           style={{
                             overflow: 'hidden',
                             display: '-webkit-box',
                             WebkitLineClamp: 2,
                             WebkitBoxOrient: 'vertical',
                           } as React.CSSProperties}>
                          {book.description}
                        </p>
                      )}

                      {/* Giá + tồn kho */}
                      <div className="d-flex align-items-center justify-content-between mt-auto">
                        <span className="fw-bold text-primary fs-5">
                          ${book.price.toFixed(2)}
                        </span>
                        <Badge bg={book.stockQuantity > 0 ? 'success' : 'danger'}>
                          {book.stockQuantity > 0 ? `Còn ${book.stockQuantity}` : 'Hết hàng'}
                        </Badge>
                      </div>

                      {/* Nút thêm vào giỏ */}
                      <Button
                        variant={book.stockQuantity > 0 ? 'primary' : 'secondary'}
                        disabled={book.stockQuantity === 0}
                        className="mt-3 w-100 fw-semibold rounded-pill"
                      >
                        {book.stockQuantity > 0 ? '🛒 Thêm vào giỏ' : 'Hết hàng'}
                      </Button>
                    </Card.Body>

                    {/* ISBN nhỏ góc dưới */}
                    {book.isbn && (
                      <Card.Footer className="text-muted" style={{ fontSize: '0.7rem' }}>
                        ISBN: {book.isbn}
                      </Card.Footer>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* ── PHÂN TRANG ── */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <span className="text-muted small">
                Trang {currentPage + 1} / {totalPages}
              </span>
              <Pagination className="mb-0">
                <Pagination.First onClick={() => setCurrentPage(0)} disabled={currentPage === 0} />
                <Pagination.Prev onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 0} />

                {/* Hiện tối đa 5 trang */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
                  const page = start + i;
                  return (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page + 1}
                    </Pagination.Item>
                  );
                })}

                <Pagination.Next onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages - 1} />
                <Pagination.Last onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage === totalPages - 1} />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
