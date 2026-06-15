import { useState } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import CartItem from "../Components/CartItem";
import { useCart } from "../Context/CartContext";

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const [checkout, setCheckout] = useState(false);

  const handleCheckout = () => {
    setCheckout(true);
    clearCart();
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.precio) * (item.quantity || 1),
    0,
  );

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Tu Carrito</h2>

      {checkout && (
        <Alert variant="success">¡Compra realizada con éxito!</Alert>
      )}

      {cart.length === 0 ? (
        <p className="text-center">No hay productos en el carrito.</p>
      ) : (
        <>
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              removeFromCart={removeFromCart}
            />
          ))}
          <h4 className="text-end mt-4">Total: S/. {total.toFixed(2)}</h4>
          <div className="text-end">
            <Button variant="success" onClick={handleCheckout}>
              Comprar
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default Cart;
