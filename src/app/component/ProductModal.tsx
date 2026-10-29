'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Product } from '../types/product';

interface ProductModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (productData: Product) => Promise<void>;
  editingProduct: Product | null;
}

export default function ProductModal({
  show,
  onHide,
  onSubmit,
  editingProduct,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: '',
    description: '',
    price: 0,
    quantity: 1,
    category: '',
    saleDate: new Date().toISOString().split('T')[0],
    imageUrl: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
      setPreviewUrl(editingProduct.imageUrl);
    } else {
      setFormData({
        id: Date.now(),
        name: '',
        description: '',
        price: 0,
        quantity: 1,
        category: '',
        saleDate: new Date().toISOString().split('T')[0],
        imageUrl: '',
      });
      setPreviewUrl('');
    }
    setSelectedFile(null);
  }, [editingProduct, show]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Xem trước tức thì
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = formData.imageUrl;

    // Nếu người dùng có chọn file ảnh mới -> Gửi lên API upload
    if (selectedFile) {
      try {
        const bodyFormData = new FormData();
        bodyFormData.append('file', selectedFile);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: bodyFormData,
        });
        const uploadResult = await res.json();
        if (uploadResult.imageUrl) {
          finalImageUrl = uploadResult.imageUrl;
        }
      } catch (err) {
        console.error('Lỗi khi tải ảnh lên:', err);
      }
    }

    await onSubmit({
      ...formData,
      imageUrl: finalImageUrl,
    });

    setIsSubmitting(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="d-flex flex-column gap-3">
          <Form.Group>
            <Form.Label>Tên sản phẩm</Form.Label>
            <Form.Control
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Form.Group className="flex-fill">
              <Form.Label>Giá ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="flex-fill">
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                required
                value={formData.quantity}
                onChange={handleChange}
              />
            </Form.Group>
          </div>

          <div className="d-flex gap-2">
            <Form.Group className="flex-fill">
              <Form.Label>Danh mục</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="flex-fill">
              <Form.Label>Ngày bán</Form.Label>
              <Form.Control
                type="date"
                name="saleDate"
                value={formData.saleDate}
                onChange={handleChange}
              />
            </Form.Group>
          </div>

          <Form.Group>
            <Form.Label>Chọn hình ảnh (Lưu vào public/productImage)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewUrl && (
              <div className="mt-2 text-center">
                <p className="small text-muted mb-1">Xem trước ảnh:</p>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxHeight: '140px', objectFit: 'contain' }}
                  className="rounded border"
                />
              </div>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : (editingProduct ? 'Lưu thay đổi' : 'Thêm mới')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}