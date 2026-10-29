import Container from 'react-bootstrap/Container';
import ProductManager from './component/ProductManager';

export default function HomePage() {
  return (
    <Container className="py-4">
      <ProductManager />
    </Container>
  );
}
