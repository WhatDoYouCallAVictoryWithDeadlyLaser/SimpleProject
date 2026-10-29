import { Container } from "react-bootstrap";
import Menu from "../component/menu";

export default function AboutPage() {
  return (
    <div>
      <Menu />
      <Container className="py-5">
        <h1>About Us</h1>
        <p>Welcome to our about page!</p>
      </Container>
    </div>
  );
}