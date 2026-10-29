'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const applyTheme = () => {
      setTheme(newTheme);
      document.documentElement.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    };

    if (document.startViewTransition) {
      document.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('language', nextLang);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Đang tìm kiếm: "${searchQuery}" (Tính năng tìm kiếm đang kích hoạt)`);
    }
  };

  const isVi = i18n.language === 'vi';

  return (
    <header className="sticky-top shadow-sm">
      {/* 1. THANH CHÍNH (MAIN HEADER - PHONG CÁCH WALMART) */}
      <Navbar bg={theme === 'dark' ? 'dark' : 'primary'} variant="dark" expand="lg" className="py-2.5">
        <Container fluid="xl" className="gap-2 gap-md-3">
          {/* Logo thương hiệu */}
          <Navbar.Brand as={Link} href="/" className="fw-bolder fs-3 d-flex align-items-center gap-1.5 text-white text-decoration-none">
            <span className="text-warning">✨</span>
            <span>ShopMart</span>
          </Navbar.Brand>

          {/* Nút Danh mục (Departments) */}
          <NavDropdown
            title={
              <span className="text-white d-flex align-items-center gap-1.5 fw-semibold">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                {isVi ? 'Danh mục' : 'Departments'}
              </span>
            }
            id="departments-dropdown"
            className="d-none d-md-block"
          >
            <NavDropdown.Item as={Link} href="/">⚡ {isVi ? 'Tất cả sản phẩm' : 'All Products'}</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#electronics">💻 {isVi ? 'Điện tử & Công nghệ' : 'Electronics'}</NavDropdown.Item>
            <NavDropdown.Item href="#books">📚 {isVi ? 'Sách & Giáo dục' : 'Books & Learning'}</NavDropdown.Item>
            <NavDropdown.Item href="#fashion">👕 {isVi ? 'Thời trang & May mặc' : 'Fashion & Clothing'}</NavDropdown.Item>
            <NavDropdown.Item href="#groceries">🍎 {isVi ? 'Thực phẩm & Tiêu dùng' : 'Groceries'}</NavDropdown.Item>
          </NavDropdown>

          {/* Ô TÌM KIẾM TRUNG TÂM (SEARCH BAR SIÊU RỘNG) */}
          <Form onSubmit={handleSearch} className="flex-grow-1 mx-lg-2 my-2 my-lg-0" style={{ maxWidth: '650px' }}>
            <div className="input-group">
              <Form.Control
                type="search"
                placeholder={isVi ? 'Tìm kiếm mọi thứ tại ShopMart...' : 'Search everything at ShopMart...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-start-pill border-0 ps-3 py-2 shadow-none"
              />
              <Button
                variant="warning"
                type="submit"
                className="rounded-end-pill px-3.5 d-flex align-items-center justify-content-center text-dark"
                title="Search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </Button>
            </div>
          </Form>

          {/* CÁC NÚT TÁC VỤ BÊN PHẢI */}
          <div className="d-flex align-items-center gap-2 ms-auto">
            {/* Mục Yêu thích (My Items / Reorder) */}
            <Link
              href="/cart"
              className="text-white text-decoration-none d-none d-xl-flex flex-column align-items-start px-2 py-1 rounded hover-bg-opacity"
            >
              <span className="small text-white-50" style={{ fontSize: '11px' }}>{isVi ? 'Mua lại' : 'Reorder'}</span>
              <span className="fw-bold small d-flex align-items-center gap-1">
                ❤️ {isVi ? 'Yêu thích' : 'My Items'}
              </span>
            </Link>

            {/* Tài khoản / Đăng nhập (Sign In / Account) */}
            <div className="text-white px-2 py-1 rounded d-none d-sm-flex flex-column align-items-start cursor-pointer">
              <span className="small text-white-50" style={{ fontSize: '11px' }}>
                {isVi ? 'Xin chào, Đăng nhập' : 'Hello, Sign In'}
              </span>
              <span className="fw-bold small d-flex align-items-center gap-1">
                👤 {isVi ? 'Tài khoản' : 'Account'}
              </span>
            </div>

            {/* Nút Giỏ hàng (Cart Button có Badge nổi bật) */}
            <Link
              href="/cart"
              className="btn btn-outline-light rounded-pill d-flex align-items-center gap-2 px-3 py-1.5 fw-bold position-relative shadow-sm text-decoration-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="d-none d-md-inline">{t('cart')}</span>
              <Badge bg="warning" text="dark" pill className="px-2 py-1">
                {cartCount}
              </Badge>
            </Link>

            {/* Nút đổi ngôn ngữ */}
            <Button
              variant="light"
              size="sm"
              onClick={toggleLanguage}
              className="rounded-pill fw-bold text-nowrap px-2.5"
              title="Đổi ngôn ngữ"
            >
              {i18n.language === 'vi' ? '🇻🇳 VN' : '🇬🇧 EN'}
            </Button>

            {/* Nút Dark/Light Mode */}
            <Button
              variant={theme === 'dark' ? 'warning' : 'outline-light'}
              size="sm"
              onClick={toggleTheme}
              className="rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
              title={theme === 'dark' ? t('lightMode') : t('darkMode')}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* 2. THANH PHỤ (SUB-NAVBAR - ĐẶC TRƯNG WALMART: GIAO HÀNG & DANH MỤC NHANH) */}
      <div className="bg-body-secondary border-bottom py-1.5 text-body">
        <Container fluid="xl" className="d-flex align-items-center justify-content-between overflow-x-auto text-nowrap small">
          {/* Thông tin giao hàng */}
          <div className="d-flex align-items-center gap-1.5 fw-semibold text-primary me-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{isVi ? 'Giao đến:' : 'Deliver to:'}</span>
            <span className="text-decoration-underline cursor-pointer">TP. Hồ Chí Minh, 70000</span>
          </div>

          {/* Quick links tiện ích */}
          <Nav className="gap-3 fw-medium">
            <Nav.Link as={Link} href="/books" className="p-0 text-body hover-text-primary fw-semibold">
              📚 {isVi ? 'Kho Sách' : 'Bookstore'}
            </Nav.Link>
            <Nav.Link as={Link} href="/" className="p-0 text-body hover-text-primary">
              🔥 {isVi ? 'Khuyến mãi hôm nay' : 'Deals'}
            </Nav.Link>
            <Nav.Link as={Link} href="/" className="p-0 text-body hover-text-primary">
              ⭐ {isVi ? 'Bán chạy nhất' : 'Best Sellers'}
            </Nav.Link>
            <Nav.Link as={Link} href="/about" className="p-0 text-body hover-text-primary">
              ℹ️ {t('about')}
            </Nav.Link>
          </Nav>
        </Container>
      </div>
    </header>
  );
}
