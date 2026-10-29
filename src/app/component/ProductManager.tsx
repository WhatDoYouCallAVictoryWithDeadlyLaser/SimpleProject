'use client';

import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { Product } from '../types/product';

export default function ProductManager() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/product');
      const data: Product[] = await res.json();
      setProductList(data);
    } catch (err) {
      console.error('Lỗi tải sản phẩm:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await fetch(`/api/product?id=${id}`, { method: 'DELETE' });
        setProductList((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        alert('Lỗi khi xóa sản phẩm');
      }
    }
  };

  const handleSaveProduct = async (productData: Product) => {
    try {
      if (editingProduct) {
        const res = await fetch('/api/product', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        const updated: Product = await res.json();
        setProductList((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else {
        const res = await fetch('/api/product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        const created: Product = await res.json();
        setProductList((prev) => [created, ...prev]);
      }
    } catch (err) {
      alert('Lỗi khi lưu sản phẩm');
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h1 className="h2 mb-0">Quản Lý Sản Phẩm</h1>
        <Button variant="success" onClick={handleOpenAdd}>
          + Thêm sản phẩm mới
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center text-muted">Đang tải dữ liệu từ server...</p>
      ) : (
        <div className="d-flex flex-wrap gap-4 justify-content-start">
          {productList.length === 0 ? (
            <p className="text-muted">Chưa có sản phẩm nào. Hãy bấm "+ Thêm sản phẩm mới"!</p>
          ) : (
            productList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSaveProduct}
        editingProduct={editingProduct}
      />
    </>
  );
}