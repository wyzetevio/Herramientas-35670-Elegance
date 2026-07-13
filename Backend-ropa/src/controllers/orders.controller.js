import {
  createOrderDB,
  getAllOrdersDB,
  getOrdersByUserDB,
  updateOrderStatusDB,
} from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const { direccion, metodoPago, lat, lng } = req.body;

    const order = await createOrderDB(req.user.id, direccion, metodoPago, lat, lng);

    res.status(201).json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersDB();

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener pedidos",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await getOrdersByUserDB(req.user.id);

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener pedidos",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { estado } = req.body;

    const order = await updateOrderStatusDB(req.params.id, estado);

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar estado",
    });
  }
};