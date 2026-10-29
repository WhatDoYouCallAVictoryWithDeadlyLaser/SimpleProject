'use client';

import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';

  return (
    <footer className="mt-auto bg-body-tertiary border-top text-body">
      {/* 1. KHỐI CAM KẾT DỊCH VỤ (TRUST BADGES - WALMART STYLE) */}
      <div className="border-bottom py-4 bg-body-secondary">
        <Container fluid="xl">
          <Row className="g-3 text-center text-md-start">
            <Col xs={12} sm={6} md={3} className="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
              <div className="fs-1 text-primary">🚚</div>
              <div>
                <h6 className="mb-0 fw-bold">{isVi ? 'Giao hàng miễn phí' : 'Free Shipping'}</h6>
                <small className="text-muted">{isVi ? 'Cho đơn hàng từ $35+' : 'On orders over $35+'}</small>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} className="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
              <div className="fs-1 text-success">🔄</div>
              <div>
                <h6 className="mb-0 fw-bold">{isVi ? 'Đổi trả dễ dàng 30 ngày' : '30-Day Easy Returns'}</h6>
                <small className="text-muted">{isVi ? 'Miễn phí đổi hàng tận nơi' : 'Hassle-free guarantee'}</small>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} className="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
              <div className="fs-1 text-warning">🔒</div>
              <div>
                <h6 className="mb-0 fw-bold">{isVi ? 'Thanh toán bảo mật' : 'Secure Payment'}</h6>
                <small className="text-muted">{isVi ? 'Bảo vệ thông tin 100%' : '100% protected checkout'}</small>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} className="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
              <div className="fs-1 text-info">💬</div>
              <div>
                <h6 className="mb-0 fw-bold">{isVi ? 'Hỗ trợ 24/7' : '24/7 Support'}</h6>
                <small className="text-muted">{isVi ? 'Giải đáp mọi thắc mắc' : 'Live chat and hotlines'}</small>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* 2. CÁC CỘT LIÊN KẾT CHÍNH (MAIN FOOTER COLUMNS) */}
      <Container fluid="xl" className="py-5">
        <Row className="gy-4">
          {/* Cột 1: Thông tin thương hiệu & Bản tin */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-1.5 fs-4 fw-bolder mb-2 text-primary">
              <span className="text-warning">✨</span>
              <span>ShopMart</span>
            </div>
            <p className="small text-muted mb-3">
              {isVi
                ? 'Nền tảng mua sắm trực tuyến tiện lợi, giá tốt mỗi ngày với hàng ngàn sản phẩm chính hãng.'
                : 'Your trusted everyday e-commerce store with low prices and fast delivery on thousands of items.'}
            </p>
            <h6 className="fw-bold mb-2 small">{isVi ? 'Đăng ký nhận khuyến mãi:' : 'Sign up for special deals:'}</h6>
            <Form onSubmit={(e) => { e.preventDefault(); alert(isVi ? 'Cảm ơn bạn đã đăng ký!' : 'Thank you for subscribing!'); }} className="d-flex gap-2">
              <Form.Control
                type="email"
                placeholder={isVi ? 'Nhập email của bạn...' : 'Enter your email...'}
                className="rounded-pill small shadow-none"
                required
              />
              <Button variant="primary" type="submit" className="rounded-pill px-3 text-nowrap fw-semibold">
                {isVi ? 'Đăng ký' : 'Join'}
              </Button>
            </Form>
          </Col>

          {/* Cột 2: Danh mục mua sắm */}
          <Col lg={2} md={3} xs={6}>
            <h6 className="fw-bold mb-3">{isVi ? 'Mua sắm' : 'Departments'}</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link href="/" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Điện tử & Laptop' : 'Electronics'}</Link></li>
              <li><Link href="/" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Sách & Giáo dục' : 'Books & Learning'}</Link></li>
              <li><Link href="/" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Thời trang nam nữ' : 'Fashion & Apparel'}</Link></li>
              <li><Link href="/" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Hàng bách hóa' : 'Grocery & Food'}</Link></li>
              <li><Link href="/" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Giảm giá đặc biệt' : 'Flash Sales'}</Link></li>
            </ul>
          </Col>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <Col lg={3} md={3} xs={6}>
            <h6 className="fw-bold mb-3">{isVi ? 'Hỗ trợ khách hàng' : 'Customer Service'}</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link href="/about" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Trung tâm trợ giúp' : 'Help Center'}</Link></li>
              <li><Link href="/cart" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Theo dõi đơn hàng' : 'Track Orders'}</Link></li>
              <li><Link href="/about" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Chính sách hoàn tiền' : 'Return Policy'}</Link></li>
              <li><Link href="/about" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Giao nhận hàng hóa' : 'Shipping Info'}</Link></li>
              <li><Link href="/about" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Liên hệ chúng tôi' : 'Contact Us'}</Link></li>
            </ul>
          </Col>

          {/* Cột 4: Về ShopMart */}
          <Col lg={3} md={6}>
            <h6 className="fw-bold mb-3">{isVi ? 'Về chúng tôi' : 'About ShopMart'}</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link href="/about" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Giới thiệu công ty' : 'Our Company'}</Link></li>
              <li><Link href="/about" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Cơ hội nghề nghiệp' : 'Careers'}</Link></li>
              <li><Link href="/about" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Phát triển bền vững' : 'Sustainability'}</Link></li>
              <li><Link href="/about" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Cam kết chất lượng' : 'Ethics & Compliance'}</Link></li>
              <li><Link href="/about" className="text-decoration-none text-muted hover-text-primary">{isVi ? 'Bảo vệ quyền riêng tư' : 'Privacy Choices'}</Link></li>
            </ul>
          </Col>
        </Row>
      </Container>

      {/* 3. DÒNG BẢN QUYỀN VÀ PHÁP LÝ DƯỚI CÙNG */}
      <div className="border-top py-3 small text-muted bg-body">
        <Container fluid="xl" className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 text-center text-sm-start">
          <div>
            © 2026 ShopMart Inc. {isVi ? 'Bảo lưu mọi quyền.' : 'All Rights Reserved.'}
          </div>
          <div className="d-flex gap-3 justify-content-center">
            <Link href="/about" className="text-muted text-decoration-none hover-text-primary">{isVi ? 'Điều khoản sử dụng' : 'Terms of Use'}</Link>
            <span>•</span>
            <Link href="/about" className="text-muted text-decoration-none hover-text-primary">{isVi ? 'Chính sách bảo mật' : 'Privacy Policy'}</Link>
            <span>•</span>
            <Link href="/about" className="text-muted text-decoration-none hover-text-primary">{isVi ? 'Trợ năng' : 'Accessibility'}</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
