import { useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { useCart } from "../Context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const { nombre, precio, imagen, stock_total, tallas } = product;

  const [show, setShow] = useState(false);
  const [selectedTalla, setSelectedTalla] = useState("");
  const [quantity, setQuantity] = useState(1);

  const selectedStock =
    tallas?.find((t) => t.talla === selectedTalla)?.stock || 0;

  const handleAdd = () => {
    if (!selectedTalla) return;

    addToCart(product, selectedTalla, quantity);

    setShow(false);
    setSelectedTalla("");
    setQuantity(1);
  };

  return (
    <>
      <Card className="shadow-sm h-100 border-0">
        <Card.Img
          variant="top"
          src={imagen || "https://via.placeholder.com/250x250?text=Sin+Imagen"}
          alt={nombre}
          style={{ height: "250px", objectFit: "cover" }}
        />

        <Card.Body className="d-flex flex-column">
          <Card.Title className="fw-semibold">{nombre}</Card.Title>

          <Card.Text className="text-muted mb-3">
            S/. {Number(precio).toFixed(2)}
          </Card.Text>

          <Card.Text className="mb-3">
            Stock disponible: {stock_total}
          </Card.Text>

          <Button
            variant="dark"
            disabled={Number(stock_total) <= 0}
            onClick={() => setShow(true)}
            className="mt-auto"
          >
            {Number(stock_total) <= 0 ? "Sin Stock" : "Agregar al carrito"}
          </Button>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar talla</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Talla</Form.Label>

            <Form.Select
              value={selectedTalla}
              onChange={(e) => {
                setSelectedTalla(e.target.value);
                setQuantity(1);
              }}
            >
              <option value="">Selecciona una talla</option>

              {tallas?.map((t, index) => (
                <option
                  key={index}
                  value={t.talla}
                  disabled={t.stock <= 0}
                >
                  {t.talla} ({t.stock} disponibles)
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {selectedTalla && (
            <p className="text-muted">
              Stock disponible: <strong>{selectedStock}</strong>
            </p>
          )}

          <Form.Group>
            <Form.Label>Cantidad</Form.Label>

            <Form.Control
              type="number"
              min={1}
              max={selectedStock}
              value={quantity}
              onChange={(e) => {
                let value = Number(e.target.value);

                if (value > selectedStock) value = selectedStock;
                if (value < 1) value = 1;

                setQuantity(value);
              }}
              disabled={!selectedTalla}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancelar
          </Button>

          <Button
            variant="dark"
            onClick={handleAdd}
            disabled={
              !selectedTalla ||
              quantity < 1 ||
              quantity > selectedStock
            }
          >
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductCard;