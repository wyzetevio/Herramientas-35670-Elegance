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
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    categoria: "",
    stock: 0,
  });
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    sales: 0,
    lowStock: 0,
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("products");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "precio" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleCreateProduct = async () => {
    try {
      const res = await createProduct(newProduct);

      setProducts((prev) => [...prev, res.data]);

      setShowModal(false);

      setNewProduct({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: "",
        categoria: "",
        stock: "",
      });
    } catch (error) {
      console.error(error);

      alert("Error al crear producto");
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
      stock: product.stock,
    });

    setShowModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const res = await updateProduct(editingProduct.id, newProduct);

      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id ? res.data : product,
        ),
      );

      setShowModal(false);

      setEditingProduct(null);

      setNewProduct({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: "",
        categoria: "",
        stock: "",
      });
    } catch (error) {
      console.error(error);

      alert("Error al actualizar producto");
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmed = window.confirm("¿Deseas eliminar este producto?");

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error(error);

      alert("Error al eliminar producto");
    }
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

      setUsers((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
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

      if (currentStatus === "pendiente") {
        newStatus = "enviado";
      } else if (currentStatus === "enviado") {
        newStatus = "entregado";
      } else {
        return;
      }

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
        console.error(error);

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
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="products" title="Productos" />

          <Tab eventKey="users" title="Usuarios" />
        </Tabs>
        <Button variant="success" onClick={() => setShowModal(true)}>
          Agregar Producto
        </Button>
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

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
                  {product.stock <= 5 ? (
                    <span className="text-danger fw-bold">{product.stock}</span>
                  ) : (
                    product.stock
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
                    onClick={() => handleDeleteProduct(product.id)}
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
                        variant={user.role === "admin" ? "warning" : "success"}
                        size="sm"
                        className="me-2"
                        onClick={() => handleRoleChange(user)}
                      >
                        {user.role === "admin" ? "Hacer User" : "Hacer Admin"}
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
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
                    onClick={() => handleStatusChange(order.id, order.estado)}
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

          setNewProduct({
            nombre: "",
            descripcion: "",
            precio: "",
            imagen: "",
            categoria: "",
            stock: "",
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="nombre"
                value={newProduct.nombre}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={newProduct.descripcion}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={newProduct.precio}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen URL</Form.Label>
              <Form.Control
                name="imagen"
                value={newProduct.imagen}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                name="categoria"
                value={newProduct.categoria}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Stock</Form.Label>

              <Form.Control
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={handleChange}
                min="0"
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>

          <Button
            variant="success"
            onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
          >
            {editingProduct ? "Actualizar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Admin;
