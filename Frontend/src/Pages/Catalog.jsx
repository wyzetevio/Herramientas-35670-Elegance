import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import ProductCard from "../Components/ProductCard";
import { getProducts } from "../Services/Api";

function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    categoria: "",
    genero: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const res = await getProducts(filters);

        const data = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];

        setProducts(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Catálogo de Productos</h2>

      <Form className="mb-4">
        {/* Buscar */}
        <Form.Control
          className="mb-3"
          type="text"
          placeholder="Buscar por nombre..."
          value={filters.search}
          onChange={(e) =>
            setFilters({
              ...filters,
              search: e.target.value,
            })
          }
        />

        {/* Género */}
        <Form.Select
          className="mb-3"
          value={filters.genero}
          onChange={(e) =>
            setFilters({
              ...filters,
              genero: e.target.value,
            })
          }
        >
          <option value="">Todos los géneros</option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
          <option value="Unisex">Unisex</option>
        </Form.Select>

        {/* Categoría */}
        <Form.Select
          value={filters.categoria}
          onChange={(e) =>
            setFilters({
              ...filters,
              categoria: e.target.value,
            })
          }
        >
          <option value="">Todas las categorías</option>
          <option value="Polos">Polos</option>
          <option value="Pantalones">Pantalones</option>
          <option value="Zapatillas">Zapatillas</option>
        </Form.Select>


        <Form.Select
          value={filters.orderPrice}
          onChange={(e) =>
            setFilters({
              ...filters,
              orderPrice: e.target.value,
            })
          }
        >
          <option value="">Ordenar por precio</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
        </Form.Select>
      </Form>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando productos...</p>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.length > 0 ? (
            products.map((product) => (
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