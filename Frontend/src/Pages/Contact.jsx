import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <Container className="my-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4 text-center">Contáctanos</h2>

            {sent && <Alert variant="success">Mensaje enviado correctamente </Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Mensaje</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Enviar Mensaje
                </Button>
            </Form>
        </Container>
    );
}

export default Contact;