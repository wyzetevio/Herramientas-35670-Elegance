import { useEffect, useState, useContext } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
  Tabs,
  Tab,
  Card,
  Row,
  Col,
} from "react-bootstrap";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} from "../Services/Api";

import { AuthContext } from "../Context/AuthContext";

function Admin() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("products");

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    sales: 0,
    lowStock: 0,
  });

  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    categoria: "",
    genero: "",
    marca: "",
    color: "",
  });

  const [tallasSeleccionadas, setTallasSeleccionadas] = useState({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTallaChange = (talla, value) => {
    setTallasSeleccionadas((prev) => ({
      ...prev,
      [talla]: Number(value),
    }));
  };

  const buildPayload = () => {
    const tallas = Object.entries(tallasSeleccionadas)
      .filter(([_, stock]) => stock > 0)
      .map(([talla, stock]) => ({ talla, stock }));

    return {
      ...newProduct,
      precio: Number(newProduct.precio),
      tallas,
    };
  };

  const refreshData = async () => {
    const [productsRes, statsRes] = await Promise.all([
      getProducts(),
      getDashboardStats()
    ]);

    setProducts(productsRes.data);
    setStats(statsRes.data);
  };

  const handleCreateProduct = async () => {
    try {
      await createProduct(buildPayload());

      await refreshData();

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdateProduct = async () => {
    try {
      await updateProduct(editingProduct.id, buildPayload());

      await refreshData();

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);

    setNewProduct({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagen: product.imagen,
      categoria: product.categoria,
      genero: product.genero || "",
      marca: product.marca || "",
      color: product.color || "",
    });

    const mappedTallas = {
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
    };

    if (product.tallas) {
      product.tallas.forEach((t) => {
        mappedTallas[t.talla] = t.stock;
      });
    }

    setTallasSeleccionadas(mappedTallas);

    setShowModal(true);
  };

  const resetForm = () => {
    setNewProduct({
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: "",
      categoria: "",
      genero: "",
      marca: "",
      color: "",
    });

    setTallasSeleccionadas({
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
    });
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (error) {
      console.error("Error al cargar pedidos", error);
    }
  };

  const loadStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoleChange = async (user) => {
    try {
      const newRole = user.role === "admin" ? "user" : "admin";
      const res = await updateUserRole(user.id, newRole);

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? res.data : u))
      );
    } catch (error) {
      console.error(error);
      alert("Error al cambiar rol");
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm("¿Eliminar usuario?");
    if (!confirmed) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar usuario");
    }
  };

  const handleStatusChange = async (orderId, currentStatus) => {
    try {
      let newStatus = currentStatus;

      if (currentStatus === "pendiente") newStatus = "enviado";
      else if (currentStatus === "enviado") newStatus = "entregado";
      else return;

      await updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (error) {
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchUsers();
    loadOrders();
    loadStats();
  }, []);

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Productos</Card.Title>
              <h3>{stats.products}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Usuarios</Card.Title>
              <h3>{stats.users}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Pedidos</Card.Title>
              <h3>{stats.orders}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="text-center border-warning">
            <Card.Body>
              <Card.Title>Stock Bajo</Card.Title>
              <h3>{stats.lowStock}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Ventas Totales</Card.Title>
              <h3>S/. {stats.sales}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Panel de Administración</h2>

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Tab eventKey="products" title="Productos" />
          <Tab eventKey="users" title="Usuarios" />
        </Tabs>

        <Button variant="success"
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowModal(true);
          }}>
          Agregar Producto
        </Button>
      </div>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {activeTab === "products" && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.nombre}</td>
                <td>S/ {product.precio}</td>
                <td>{product.categoria}</td>
                <td>
                  {product.stock_total <= 5 ? (
                    <span className="text-danger fw-bold">
                      {product.stock_total}
                    </span>
                  ) : (
                    product.stock_total
                  )}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEditClick(product)}
                  >
                    Editar
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {activeTab === "users" && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.id !== currentUser.id && (
                    <>
                      <Button
                        size="sm"
                        variant={user.role === "admin" ? "warning" : "success"}
                        className="me-2"
                        onClick={() => handleRoleChange(user)}
                      >
                        {user.role === "admin" ? "Hacer User" : "Hacer Admin"}
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <hr className="my-5" />

      <h3>Gestión de Pedidos</h3>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.cliente}</td>
              <td>{new Date(order.fecha).toLocaleDateString()}</td>
              <td>S/. {order.total}</td>
              <td>{order.estado}</td>
              <td>
                {order.estado !== "entregado" && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      handleStatusChange(order.id, order.estado)
                    }
                  >
                    Avanzar Estado
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingProduct(null);
          resetForm();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Control
              placeholder="Nombre"
              name="nombre"
              value={newProduct.nombre}
              onChange={handleChange}
              className="mb-2"
            />

            <Form.Control
              placeholder="Descripción"
              name="descripcion"
              value={newProduct.descripcion}
              onChange={handleChange}
              className="mb-2"
            />

            <Form.Control
              placeholder="Precio"
              name="precio"
              type="number"
              min="0"
              value={newProduct.precio}
              onChange={handleChange}
              className="mb-2"
            />

            <Form.Control
              placeholder="Imagen"
              name="imagen"
              value={newProduct.imagen}
              onChange={handleChange}
              className="mb-2"
            />

            <Form.Control
              placeholder="Categoría"
              name="categoria"
              value={newProduct.categoria}
              onChange={handleChange}
              className="mb-2"
            />

            <Form.Select
              name="genero"
              value={newProduct.genero}
              onChange={handleChange}
              className="mb-2"
            >
              <option>Genero</option>
              <option>Hombre</option>
              <option>Mujer</option>
              <option>Unisex</option>
            </Form.Select>

            <Form.Control
              placeholder="Marca"
              name="marca"
              value={newProduct.marca}
              onChange={handleChange}
              className="mb-2"
            />

            <Form.Control
              placeholder="Color"
              name="color"
              value={newProduct.color}
              onChange={handleChange}
              className="mb-2"
            />

            <hr />

            <h6>Tallas</h6>

            {["S", "M", "L", "XL"].map((t) => (
              <div key={t} className="d-flex mb-2">
                <div style={{ width: 50 }}>{t}</div>
                <Form.Control
                  type="number"
                  min="0"
                  step="1"
                  value={tallasSeleccionadas[t]}
                  onChange={(e) => {
                    const value = Math.max(0, Number(e.target.value));
                    handleTallaChange(t, value);
                  }}
                />
              </div>
            ))}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Cancelar</Button>

          <Button
            onClick={
              editingProduct
                ? handleUpdateProduct
                : handleCreateProduct
            }
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Admin;