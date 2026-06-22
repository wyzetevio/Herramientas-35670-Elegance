import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import * as cartService from "../Services/Api";
import { AuthContext } from "./AuthContext";
import { Toast, ToastContainer } from "react-bootstrap";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getCurrentUser = useCallback(() => {
    return user || null;
  }, [user]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser?.id) {
          const res = await cartService.getCart(currentUser.id);
          setCart(res.data || []);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Error al obtener carrito:", error);
      }
    };
    fetchCart();
  }, [user, getCurrentUser]);

  const addItem = async (product, talla, quantity = 1) => {
    const currentUser = getCurrentUser();

    if (!currentUser || !currentUser.id) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      navigate("/login");
      return;
    }

    try {
      await cartService.addToCart(currentUser.id, product.id, talla, quantity);
      setToastMessage(`${product.nombre} agregado al carrito`);
      setShowToast(true);
      setCart((prev) => {
        const existing = prev.find(
          (i) => i.product_id === product.id && i.talla === talla,
        );

        if (existing) {
          return prev.map((i) =>
            i.product_id === product.id && i.talla === talla
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }

        return [
          ...prev,
          {
            product_id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            imagen: product.imagen,
            talla,
            quantity,
          },
        ];
      });
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  const updateItem = async (productId, talla, quantity) => {
    const currentUser = getCurrentUser();
    if (!currentUser?.id) {
      navigate("/auth");
      return;
    }

    try {
      await cartService.updateQuantity(
        currentUser.id,
        productId,
        talla,
        quantity,
      );

      setCart((prev) =>
        prev.map((i) =>
          i.product_id === productId && i.talla === talla
            ? { ...i, quantity }
            : i,
        ),
      );
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  };

  const removeItem = async (productId, talla) => {
    const currentUser = getCurrentUser();
    if (!currentUser?.id) {
      navigate("/auth");
      return;
    }

    try {
      await cartService.removeFromCart(currentUser.id, productId, talla);

      setCart((prev) =>
        prev.filter((i) => !(i.product_id === productId && i.talla === talla)),
      );
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const clear = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser?.id) {
      navigate("/auth");
      return;
    }

    try {
      await cartService.clearCart(currentUser.id);
      setCart([]);
    } catch (error) {
      console.error("Error al limpiar carrito:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: addItem,
        updateQuantity: updateItem,
        removeFromCart: removeItem,
        clearCart: clear,
        showToast,
        setShowToast,
        toastMessage,
      }}
    >
      {children}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2500}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Carrito</strong>
          </Toast.Header>

          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};