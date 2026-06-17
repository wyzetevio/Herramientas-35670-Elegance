import { Card, Button, Row, Col } from 'react-bootstrap';

function CartItem({ item, removeFromCart }) {
    const subtotal = Number(item.precio) * (item.quantity || 1);

    return (
        <Card className="mb-3 shadow-sm">
            <Row className="g-0 align-items-center">
                <Col md={3}>
                    <Card.Img
                        src={item.image || 'https://via.placeholder.com/120'}
                        alt={item.name}
                        style={{ height: '100px', objectFit: 'cover' }}
                    />
                </Col>
                <Col md={6}>
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text className="text-muted mb-1">
                            Precio: S/. {Number(item.precio).toFixed(2)}
                        </Card.Text>
                        <Card.Text className="text-muted mb-1">
                            Cantidad: {item.quantity}
                        </Card.Text>
                        <Card.Text className="fw-semibold">
                            Subtotal: S/. {Number(subtotal).toFixed(2)}
                        </Card.Text>
                    </Card.Body>
                </Col>
                <Col md={3} className="text-end pe-3">
                    <Button variant="outline-danger" onClick={() => removeFromCart(item.id)}>
                        Quitar
                    </Button>
                </Col>
            </Row>
        </Card>
    );
}

export default CartItem;
