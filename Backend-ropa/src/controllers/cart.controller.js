import {
  getCartByUser,
  addProductToCart,
  updateCartQuantity,
  deleteCartItem,
  clearCart,
} from "../models/cart.model.js";

export const getCart = async (req, res) => {
  try {
    const { user_id } = req.params;
    const items = await getCartByUser(user_id);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener el carrito" });
  }
};

export const addCartItem = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    await addProductToCart(user_id, product_id, quantity);
    res.json({ message: "Producto agregado al carrito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al agregar producto" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    await updateCartQuantity(user_id, product_id, quantity);
    res.json({ message: "Cantidad actualizada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar cantidad" });
  }
};

export const deleteCartProduct = async (req, res) => {
  try {
    const { user_id, product_id } = req.params;
    await deleteCartItem(user_id, product_id);
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};

export const clearCartUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    await clearCart(user_id);
    res.json({ message: "Carrito vaciado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al vaciar carrito" });
  }
};
