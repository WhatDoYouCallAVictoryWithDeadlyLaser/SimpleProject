'use client';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Product } from '../types/product';
import { products } from '@/app/data/products';
import Button from 'react-bootstrap/esm/Button';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden" style={{ width: '18rem' }}>
      <Card.Img
        variant="top"
        src={product.imageUrl || 'https://placeholder.co/300x180?text=No+Image'}
        style={{ height: '180px', objectFit: 'cover' }}
        className="hover:scale-105 transition-transform duration-300" // Hiệu ứng phóng to nhẹ ảnh khi hover
      />
      <Card.Body>
        <Card.Title className="hover:text-primary transition-colors">{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>${product.price.toFixed(2)}</ListGroup.Item>
        <ListGroup.Item>Quantity: {product.quantity}</ListGroup.Item>
        <ListGroup.Item>Category: {product.category}</ListGroup.Item>
        <ListGroup.Item>Sale Date: {product.saleDate}</ListGroup.Item>
      </ListGroup>
      <Card.Body className="d-flex gap-2">
        <Button variant="primary" onClick={() => onEdit(product)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(product.id)}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;