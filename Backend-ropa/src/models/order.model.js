import pool from "../config/db.js";

export const createOrderDB = async (userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cartResult = await client.query(
      `
  SELECT
    c.product_id,
    c.quantity,
    p.nombre,
    p.precio,
    p.stock
  FROM cart c
  JOIN products p
    ON c.product_id = p.id
  WHERE c.user_id = $1
  `,
      [userId],
    );

    const cartItems = cartResult.rows;

    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        throw new Error(`Stock insuficiente para ${item.nombre}`);
      }
    }

    if (cartItems.length === 0) {
      throw new Error("El carrito está vacío");
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.precio,
      0,
    );

    const orderResult = await client.query(
      `
      INSERT INTO orders
      (user_id, total)
      VALUES ($1, $2)
      RETURNING *
      `,
      [userId, total],
    );

    const order = orderResult.rows[0];

    for (const item of cartItems) {
      await client.query(
        `
    INSERT INTO order_details
    (order_id, product_id, cantidad, precio_unitario)
    VALUES ($1,$2,$3,$4)
    `,
        [order.id, item.product_id, item.quantity, item.precio],
      );

      await client.query(
        `
    UPDATE products
    SET stock = stock - $1
    WHERE id = $2
    `,
        [item.quantity, item.product_id],
      );
    }

    await client.query(
      `DELETE FROM cart WHERE user_id = $1`,
      [userId],
    );

    await client.query("COMMIT");

    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getAllOrdersDB = async () => {
  const result = await pool.query(`
    SELECT
      o.id,
      o.fecha_creacion,
      o.total,
      o.estado,
      u.nombre AS cliente
    FROM orders o
    JOIN users u
      ON o.user_id = u.id
    ORDER BY o.id DESC
  `);

  return result.rows;
};

export const getOrdersByUserDB = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE user_id = $1
    ORDER BY id DESC
    `,
    [userId],
  );

  return result.rows;
};

export const updateOrderStatusDB = async (id, estado) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET estado = $1
    WHERE id = $2
    RETURNING *
    `,
    [estado, id],
  );

  return result.rows[0];
};

export const getDashboardStatsDB = async () => {
  const totalOrders = await pool.query(`
    SELECT COUNT(*) AS total
    FROM orders
  `);

  const totalSales = await pool.query(`
    SELECT COALESCE(SUM(total),0) AS total
    FROM orders
  `);

  return {
    orders: totalOrders.rows[0].total,
    sales: totalSales.rows[0].total,
  };
};