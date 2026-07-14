import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);
export const getProfile = () => API.get("/users/profile");

export const getProducts = (filters) =>
  API.get("/products", { params: filters });

export const getCart = (userId) => API.get(`/cart/${userId}`);

export const addToCart = (user_id, product_id, talla, quantity) =>
  API.post("/cart", { user_id, product_id, talla, quantity });

export const updateQuantity = (user_id, product_id, quantity) =>
  API.put("/cart", { user_id, product_id, quantity });

export const removeFromCart = (user_id, product_id, talla) =>
  API.delete(`/cart/${user_id}/${product_id}/${talla}`);

export const clearCart = (user_id) => API.delete(`/cart/clear/${user_id}`);

export const createProduct = (product) => API.post("/products", product);

export const updateProduct = (id, product) =>
  API.put(`/products/${id}`, product);

export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const getUsers = () => API.get("/users");

export const updateUserRole = (id, role) =>
  API.put(`/users/${id}/role`, { role });

export const deleteUser = (id) => API.delete(`/users/${id}`);

// PEDIDOS

export const createOrder = (data) => API.post("/orders", data);

export const getMyOrders = () => API.get("/orders/my-orders");

export const getComprobante = (orderId) => API.get(`/comprobantes/${orderId}`);

export const getAllOrders = () => API.get("/orders");

export const updateOrderStatus = (id, estado) =>
  API.put(`/orders/${id}/status`, {
    estado,
  });

export const getDashboardStats = () => API.get("/dashboard");

export const createClaim = (data) => API.post("/claims", data);

export default API;