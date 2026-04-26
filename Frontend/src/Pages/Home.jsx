import { Container, Button, Carousel, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
    const destacados = [
        {
            id: 1,
            nombre: 'Casaca de cuero',
            precio: 199.90,
            imagen: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb',
        },
        {
            id: 2,
            nombre: 'Vestido floral',
            precio: 149.90,
            imagen: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
        },
        {
            id: 3,
            nombre: 'Zapatillas urbanas',
            precio: 229.90,
            imagen: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
        },
    ];

    return (
        <div>
            {/* Carrusel principal */}
            <Carousel fade>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
                        alt="Moda femenina"
                        style={{ height: '500px', objectFit: 'cover' }}
                    />
                    <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
                        <h3>Moda femenina</h3>
                        <p>Descubre los mejores looks de temporada</p>
                        <Button as={Link} to="/catalog" variant="light">
                            Ver productos
                        </Button>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb"
                        alt="Moda masculina"
                        style={{ height: '500px', objectFit: 'cover' }}
                    />
                    <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
                        <h3>Moda masculina</h3>
                        <p>Estilo y comodidad para cada ocasión</p>
                        <Button as={Link} to="/catalog" variant="light">
                            Explorar
                        </Button>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            {/* Sección de bienvenida */}
            <header className="App-header text-center my-5">
                <Container>
                    <h1 className="display-4 fw-bold">Bienvenido a ELEGANCE</h1>
                    <p className="lead">Explora las mejores prendas con estilo y comodidad.</p>
                    <Button as={Link} to="/catalog" variant="dark" size="lg">
                        Ver Catálogo
                    </Button>
                </Container>
            </header>

            {/* Sección de productos destacados */}
            <section className="py-5 bg-light">
                <Container>
                    <h2 className="text-center mb-4 fw-bold">Productos Destacados</h2>
                    <Row className="justify-content-center">
                        {destacados.map((producto) => (
                            <Col key={producto.id} md={4} sm={6} xs={12} className="mb-4">
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Img
                                        variant="top"
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        style={{ height: '300px', objectFit: 'cover' }}
                                    />
                                    <Card.Body className="text-center">
                                        <Card.Title>{producto.nombre}</Card.Title>
                                        <Card.Text className="text-muted">
                                            S/. {producto.precio.toFixed(2)}
                                        </Card.Text>
                                        <Button as={Link} to="/catalog" variant="dark">
                                            Ver más
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default Home;
