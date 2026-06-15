import { Container } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="bg-dark text-light py-3 mt-auto">
            <Container className="text-center">
                <p className="mb-0">© {new Date().getFullYear()} ELEGANCE. Todos los derechos reservados.</p>
            </Container>
        </footer>
    );
}

export default Footer;
