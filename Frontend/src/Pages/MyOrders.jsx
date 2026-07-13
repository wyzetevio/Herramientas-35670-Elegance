import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Spinner,
  Badge,
  Modal,
  Button,
} from "react-bootstrap";
import { getMyOrders, getComprobante } from "../Services/Api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [comprobante, setComprobante] = useState(null);
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerComprobante = async (orderId) => {
    try {
      const res = await getComprobante(orderId);

      setComprobante(res.data);

      setShowModal(true);
    } catch (error) {
      console.error(error);

      alert("No se pudo obtener el comprobante");
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);

    doc.text("ELEGANCE STORE", 105, 15, { align: "center" });

    doc.setFontSize(12);

    doc.text("Comprobante de Pago", 105, 25, { align: "center" });

    // Restaurar color texto
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(11);

    doc.text(`Número: ${comprobante.numero}`, 20, 50);

    doc.text(
      `Fecha: ${new Date(comprobante.fecha).toLocaleDateString("es-PE")}`,
      20,
      60,
    );

    // Caja cliente
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(15, 70, 180, 35, 3, 3, "F");

    doc.text(`Cliente: ${comprobante.cliente}`, 25, 85);

    doc.text(`Dirección: ${comprobante.direccion}`, 25, 95);

    autoTable(doc, {
      startY: 120,

      head: [["Producto", "Talla", "Cant.", "Precio", "Subtotal"]],

      body: comprobante.detalles.map((item) => [
        item.producto,
        item.talla,
        item.cantidad,
        `S/. ${item.precio_unitario}`,
        `S/. ${item.subtotal}`,
      ]),

      styles: {
        fontSize: 10,
      },

      headStyles: {
        fillColor: [30, 30, 30],
        textColor: 255,
      },
    });

    let y = doc.lastAutoTable.finalY + 20;

    doc.setFillColor(245, 245, 245);

    doc.roundedRect(120, y, 70, 35, 3, 3, "F");

    doc.text(`Subtotal: S/. ${comprobante.subtotal}`, 125, y + 10);

    doc.text(`IGV: S/. ${comprobante.igv}`, 125, y + 20);

    doc.setFontSize(14);

    doc.text(`TOTAL: S/. ${comprobante.total}`, 125, y + 30);

    // Pie
    doc.setFontSize(10);

    doc.text("Gracias por comprar en ELEGANCE STORE", 105, 285, {
      align: "center",
    });

    doc.save(`comprobante-${comprobante.numero}.pdf`);
  };

  const getVariant = (estado) => {
    switch (estado) {
      case "pendiente": return "warning";
      case "procesando": return "info";
      case "enviado": return "primary";
      case "entregado": return "success";
      default: return "secondary";
    }
  };

  if (loading) return (
    <Container className="mt-5 text-center">
      <Spinner animation="border" />
    </Container>
  );

  return (
    <Container className="mt-4">
      <h2>Mis Pedidos</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Comprobante</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.fecha).toLocaleDateString("es-PE")}</td>
              <td>S/. {Number(order.total).toFixed(2)}</td>
              <td>
                <Badge bg={getVariant(order.estado)}>{order.estado}</Badge>
              </td>

              <td className="text-center">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleVerComprobante(order.id)}
                >
                  📄 Ver
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Comprobante de Pago</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {comprobante && (
            <>
              <h5 className="fw-bold mb-3">ELEGANCE STORE</h5>

              <hr />

              <p>
                <strong>Número:</strong> {comprobante.numero}
              </p>

              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(comprobante.fecha).toLocaleString("es-PE")}
              </p>

              <p>
                <strong>Cliente:</strong> {comprobante.cliente}
              </p>

              <p>
                <strong>Dirección:</strong> {comprobante.direccion}
              </p>

              <p>
                <strong>Método de pago:</strong> {comprobante.metodo_pago}
              </p>

              <h6 className="fw-bold mb-3">Detalle de la compra</h6>

              <Table bordered hover size="sm">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Talla</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {comprobante.detalles?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.producto}</td>

                      <td>{item.talla}</td>

                      <td>{item.cantidad}</td>

                      <td>S/. {Number(item.precio_unitario).toFixed(2)}</td>

                      <td>S/. {Number(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <hr />

              <div className="d-flex justify-content-between">
                <span>Subtotal</span>

                <strong>S/. {Number(comprobante.subtotal).toFixed(2)}</strong>
              </div>

              <div className="d-flex justify-content-between">
                <span>IGV (18%)</span>

                <strong>S/. {Number(comprobante.igv).toFixed(2)}</strong>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <h5>Total</h5>

                <h5>S/. {Number(comprobante.total).toFixed(2)}</h5>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={generarPDF}>
            ⬇ Descargar PDF
          </Button>

          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyOrders;
