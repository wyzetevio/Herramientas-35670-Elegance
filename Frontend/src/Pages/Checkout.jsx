import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../Services/Api";
import { useCart } from "../Context/CartContext";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [procesando, setProcesando] = useState(false);
  const [exito, setExito] = useState(false);
  const [totalPagado, setTotalPagado] = useState(0);
  const [direccion, setDireccion] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + Number(item.precio) * (item.quantity || 1),
    0,
  );

  const handlePagar = async (e) => {
    e.preventDefault();
    setProcesando(true);
    try {
      await createOrder({
        direccion,
        metodoPago,
      });
      setTimeout(() => {
        setProcesando(false);
        setTotalPagado(total);
        setExito(true);
        clearCart();
        setTimeout(() => navigate("/my-orders"), 3000);
      }, 2000);
    } catch (error) {
      setProcesando(false);
      alert(error.response?.data?.message || "Error al realizar el pago");
    }
  };

  if (procesando)
    return (
      <Container className="my-5 text-center" style={{ maxWidth: "400px" }}>
        <h4>Procesando tu pago...</h4>
        <p className="text-muted">Esto solo tomará un momento</p>
        <div className="progress mt-3">
          <div className="progress-bar progress-bar-striped progress-bar-animated bg-success w-100" />
        </div>
      </Container>
    );

  if (exito)
    return (
      <Container className="my-5 text-center" style={{ maxWidth: "400px" }}>
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "#d1fae5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="fw-bold">Pedido confirmado</h3>
        <p className="text-muted">
          Te avisaremos cuando tu pedido esté en camino.
        </p>
        <div className="mt-3 p-3 bg-light rounded">
          <p className="mb-0 fw-bold">
            Total pagado: S/. {totalPagado.toFixed(2)}
          </p>
        </div>
      </Container>
    );

  const metodos = [
    {
      id: "tarjeta",
      label: "Tarjeta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png",
    },
    {
      id: "yape",
      label: "Yape",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Yape_logo.svg/200px-Yape_logo.svg.png",
    },
    {
      id: "transferencia",
      label: "BCP",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/BCP_logo.svg/200px-BCP_logo.svg.png",
    },
  ];

  return (
    <Container className="my-5">
      <h2 className="mb-1 fw-bold">Finalizar compra</h2>
      <p className="text-muted mb-4">
        Completa tus datos para confirmar el pedido
      </p>
      <Row className="g-4">
        <Col md={7}>
          <div className="p-4 border rounded-3 bg-white mb-4">
            <h6
              className="fw-bold mb-3 text-uppercase"
              style={{
                letterSpacing: "0.05em",
                fontSize: "13px",
                color: "#888",
              }}
            >
              Datos de entrega
            </h6>
            <Form onSubmit={handlePagar}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "14px" }}>
                      Nombre completo
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Juan Pérez García"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "14px" }}>
                      Teléfono
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="999 999 999"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "14px" }}>
                  Correo electrónico
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="juan@correo.com"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "14px" }}>
                  Dirección de envío
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Av. Javier Prado 1234, San Isidro, Lima"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                />
              </Form.Group>

              <h6
                className="fw-bold mb-3 mt-4 text-uppercase"
                style={{
                  letterSpacing: "0.05em",
                  fontSize: "13px",
                  color: "#888",
                }}
              >
                Método de pago
              </h6>
              <div className="d-flex gap-3 mb-4 flex-wrap">
                {metodos.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setMetodoPago(m.id)}
                    style={{
                      padding: "12px 20px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      border:
                        metodoPago === m.id
                          ? "2px solid #198754"
                          : "1.5px solid #e0e0e0",
                      background: metodoPago === m.id ? "#f0fff4" : "#fafafa",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      minWidth: "120px",
                    }}
                  >
                    <img
                      src={m.logo}
                      alt={m.label}
                      style={{ height: "22px", objectFit: "contain" }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: metodoPago === m.id ? "600" : "400",
                      }}
                    >
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              {metodoPago === "tarjeta" && (
                <div className="p-3 border rounded-3 bg-light mb-3">
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "14px" }}>
                      Número de tarjeta
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="4111 1111 1111 1111"
                      maxLength={19}
                      required
                    />
                  </Form.Group>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label style={{ fontSize: "14px" }}>
                          Vencimiento
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="12/26"
                          maxLength={5}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label style={{ fontSize: "14px" }}>
                          CVV
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="123"
                          maxLength={3}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <p
                    className="text-muted mt-2 mb-0"
                    style={{ fontSize: "12px" }}
                  >
                    Tus datos están protegidos con cifrado SSL
                  </p>
                </div>
              )}

              {metodoPago === "yape" && (
                <div
                  className="p-4 border rounded-3 mb-3"
                  style={{ background: "#f8f0ff" }}
                >
                  <div className="text-center mb-3">
                    <p className="mb-1 text-muted" style={{ fontSize: "14px" }}>
                      Yapea este monto al número:
                    </p>
                    <h4 className="fw-bold" style={{ color: "#6b21a8" }}>
                      +51 987 654 321
                    </h4>
                    <div className="mt-2 p-2 bg-white rounded-2 d-inline-block">
                      <p className="mb-0 fw-bold" style={{ fontSize: "18px" }}>
                        S/. {total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <hr style={{ borderColor: "#d8b4fe" }} />
                  <p
                    className="mb-2 fw-bold"
                    style={{ fontSize: "13px", color: "#6b21a8" }}
                  >
                    Ingresa los datos de tu operación:
                  </p>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: "14px" }}>
                          Número de celular Yape
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="987 654 321"
                          maxLength={9}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: "14px" }}>
                          Código de aprobación
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ej: 123456"
                          maxLength={10}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              {metodoPago === "transferencia" && (
                <div
                  className="p-4 border rounded-3 mb-3"
                  style={{ background: "#f0f7ff" }}
                >
                  <p
                    className="mb-2 fw-bold"
                    style={{ fontSize: "14px", color: "#1e3a5f" }}
                  >
                    Transfiere a esta cuenta BCP:
                  </p>
                  <table className="w-100 mb-3" style={{ fontSize: "14px" }}>
                    <tbody>
                      <tr>
                        <td className="text-muted py-1">Titular</td>
                        <td className="fw-bold">ELEGANCE S.A.C.</td>
                      </tr>
                      <tr>
                        <td className="text-muted py-1">Banco</td>
                        <td className="fw-bold">BCP</td>
                      </tr>
                      <tr>
                        <td className="text-muted py-1">Cuenta</td>
                        <td className="fw-bold">193-12345678-0-21</td>
                      </tr>
                      <tr>
                        <td className="text-muted py-1">CCI</td>
                        <td className="fw-bold">002-193-001234567802-13</td>
                      </tr>
                      <tr>
                        <td className="text-muted py-1">Monto</td>
                        <td className="fw-bold text-success">
                          S/. {total.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <hr style={{ borderColor: "#bfdbfe" }} />
                  <p
                    className="mb-2 fw-bold"
                    style={{ fontSize: "13px", color: "#1e3a5f" }}
                  >
                    Confirma tu transferencia:
                  </p>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: "14px" }}>
                          Número de operación
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ej: 00123456789"
                          maxLength={15}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: "14px" }}>
                          Fecha de transferencia
                        </Form.Label>
                        <Form.Control type="date" required />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-2">
                    <Form.Label style={{ fontSize: "14px" }}>
                      Nombre del titular de la cuenta origen
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej: Juan Pérez García"
                      required
                    />
                  </Form.Group>
                  <p
                    className="mt-2 mb-0 text-muted"
                    style={{ fontSize: "12px" }}
                  >
                    También puedes enviar tu voucher a elegance@tienda.com
                  </p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-100 mt-2"
                style={{
                  background: "#111",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px",
                  fontSize: "16px",
                }}
              >
                Confirmar pago · S/. {total.toFixed(2)}
              </Button>
            </Form>
          </div>
        </Col>

        <Col md={5}>
          <div
            className="p-4 border rounded-3"
            style={{ background: "#fafafa", position: "sticky", top: "20px" }}
          >
            <h6
              className="fw-bold mb-3 text-uppercase"
              style={{
                letterSpacing: "0.05em",
                fontSize: "13px",
                color: "#888",
              }}
            >
              Resumen del pedido
            </h6>
            {cart.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between mb-3 align-items-center"
              >
                <div>
                  <p
                    className="mb-0"
                    style={{ fontSize: "14px", fontWeight: "500" }}
                  >
                    {item.nombre || item.name}
                  </p>
                  <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                    x{item.quantity || 1}
                  </p>
                </div>
                <span style={{ fontSize: "14px" }}>
                  S/. {(Number(item.precio) * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Total a pagar</span>
              <span className="fw-bold" style={{ fontSize: "18px" }}>
                S/. {total.toFixed(2)}
              </span>
            </div>
            <p className="text-muted mt-3 mb-0" style={{ fontSize: "12px" }}>
              Envío a Lima: 1 día hábil · Provincias: 2-3 días
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;
