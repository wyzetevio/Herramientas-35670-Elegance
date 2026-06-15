import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../Services/Api';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('info');

    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            navigate('/profile');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setVariant('info');

        try {
            let data;

            if (isLogin) {
                const res = await loginUser({ email, password });
                data = res.data;
            } else {
                const res = await registerUser({ nombre: name, email, password });
                data = res.data;
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                setMessage(`Bienvenido, ${data.user?.nombre || email}`);
                setVariant('success');

                setTimeout(() => navigate('/profile'), 1000);
            } else {
                throw new Error('Error en la autenticación');
            }
        } catch (error) {
            console.error(error);
            setMessage(' Error: verifica tus datos e inténtalo nuevamente.');
            setVariant('danger');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            {/* Pestañas de Login / Registro */}
            <Nav fill variant="tabs" defaultActiveKey="login">
                <Nav.Item>
                    <Nav.Link
                        eventKey="login"
                        active={isLogin}
                        onClick={() => setIsLogin(true)}
                    >
                        Iniciar sesión
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        eventKey="register"
                        active={!isLogin}
                        onClick={() => setIsLogin(false)}
                    >
                        Registrarse
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Contenedor del formulario */}
            <div className="p-4 border border-light rounded shadow-sm bg-white mt-3">
                <h4 className="text-center mb-3">
                    {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
                </h4>

                {message && <Alert variant={variant}>{message}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre completo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tu nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <div className="text-center">
                        <Button variant="primary" type="submit">
                            {isLogin ? 'Entrar' : 'Registrar'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
}

export default Auth;