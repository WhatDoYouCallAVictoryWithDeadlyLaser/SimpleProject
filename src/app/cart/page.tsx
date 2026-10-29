import { Container } from "react-bootstrap";
import Menu from "../component/menu";

export default function Page() {
  return (

    <div>
      <Menu />
      <Container className="py-5">
        <h1>Cart Page</h1>
      </Container>
    </div>
  );
}