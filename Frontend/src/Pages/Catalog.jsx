import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import ProductCard from "../Components/ProductCard";
import { getProducts } from "../Services/Api";

function Catalog() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((res) => {
        const data = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        setProducts(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setProducts([]);
        setFiltered([]);
        setLoading(false);
      });
  }, []);

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);

    setFiltered(
      products.filter((p) =>
        (p.nombre || "").toLowerCase().includes(value)
      )
    );
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Catálogo de Productos</h2>

      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre..."
          value={filter}
          onChange={handleFilter}
        />
      </Form>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando productos...</p>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {Array.isArray(filtered) && filtered.length > 0 ? (
            filtered.map((product) => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))
          ) : (
            <p className="text-center">No se encontraron productos.</p>
          )}
        </Row>
      )}
    </Container>
  );
}

export default Catalog;
