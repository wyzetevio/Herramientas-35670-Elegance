import { Container, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) {
        return (
            <Container className="mt-5 text-center">
                <h3>No has iniciado sesión</h3>
                <Button as={Link} to="/auth" variant="primary">Ir a iniciar sesión</Button>
            </Container>
        );
    }

    return (
        <Container className="mt-5" style={{ maxWidth: '500px' }}>
            <Card className="p-4 shadow">
                <h3 className="text-center mb-4"> Perfil de usuario</h3>
                <p><strong>Nombre:</strong> {user.nombre}</p>
                <p><strong>Correo:</strong> {user.email}</p>
                <div className="d-flex justify-content-between mt-4">
                    <Button variant="primary" onClick={handleLogout}>
                        Cerrar sesión
                    </Button>
                    <Button as={Link} to="/catalog" variant="primary">
                        Ir a comprar
                    </Button>
                </div>
            </Card>
        </Container>
    );
}

export default Profile;
