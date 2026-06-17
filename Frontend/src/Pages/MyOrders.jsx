import { useEffect, useState } from "react";
import { Container, Table, Spinner, Badge } from "react-bootstrap";
import { getMyOrders } from "../Services/Api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getVariant = (estado) => {
    switch (estado) {
      case "pendiente":
        return "warning";

      case "enviado":
        return "primary";

      case "entregado":
        return "success";

      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

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
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>

              <td>{new Date(order.fecha).toLocaleDateString()}</td>

              <td>S/. {order.total}</td>

              <td>
                <Badge bg={getVariant(order.estado)}>{order.estado}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default MyOrders;
