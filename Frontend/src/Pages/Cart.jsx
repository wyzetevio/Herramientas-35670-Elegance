import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import CartItem from "../Components/CartItem";
import { useCart } from "../Context/CartContext";

function Cart() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.precio) * (item.quantity || 1), 0
  );

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Tu Carrito</h2>
      {cart.length === 0 ? (
        <p className="text-center">No hay productos en el carrito.</p>
      ) : (
        <>
          {cart.map((item) => (
            <CartItem key={item.id} item={item} removeFromCart={removeFromCart} />
          ))}
          <h4 className="text-end mt-4">Total: S/. {total.toFixed(2)}</h4>
          <div className="text-end">
            <Button variant="success" onClick={() => navigate("/checkout")}>
              Comprar
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default Cart;