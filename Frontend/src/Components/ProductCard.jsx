import { Card, Button } from "react-bootstrap";
import { useCart } from "../Context/CartContext";

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { nombre, precio, imagen } = product;

    return (
        <Card className="shadow-sm h-100 border-0">
            <Card.Img
                variant="top"
                src={imagen || 'https://via.placeholder.com/250x250?text=Sin+Imagen'}
                alt={nombre}
                style={{ height: '250px', objectFit: 'cover' }}
            />
            <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-semibold">{nombre}</Card.Title>
                <Card.Text className="text-muted mb-3">
                    S/. {Number(precio).toFixed(2)}
                </Card.Text>
                <Button
                    variant="dark"
                    onClick={() => addToCart(product)}
                    className="mt-auto"
                >
                    Agregar al carrito
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;
