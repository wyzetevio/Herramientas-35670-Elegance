import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

function NavigationBar() {
  const { cart } = useCart();
  const { user } = useContext(AuthContext);
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        {/* Logo o nombre */}
        <Navbar.Brand as={Link} to="/">
          ELEGANCE
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>

            <Nav.Link as={Link} to="/catalog">
              Catálogo
            </Nav.Link>

            <Nav.Link as={Link} to="/claims">
              Libro de Reclamaciones
            </Nav.Link>

            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/admin">
                Administración
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/cart" className="position-relative">
              <FaShoppingCart size={22} />

              {cart.length > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {cart.length}
                </Badge>
              )}
            </Nav.Link>

            <Nav.Link as={Link} to="/login" className="ms-3">
              Acceder
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
