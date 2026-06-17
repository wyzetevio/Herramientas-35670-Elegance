import { countUsersDB } from "../models/user.model.js";
import {
  countProductsDB,
  countLowStockProductsDB,
} from "../models/product.model.js";
import { getDashboardStatsDB } from "../models/order.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const users = await countUsersDB();

    const products = await countProductsDB();

    const lowStock = await countLowStockProductsDB();

    const ordersData = await getDashboardStatsDB();

    res.json({
      users,
      products,
      lowStock,
      orders: ordersData.orders,
      sales: ordersData.sales,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener estadísticas",
    });
  }
};
