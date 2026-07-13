import pool from "../config/db.js";

export const createOrderDB = async (userId, direccion, metodoPago, lat, lng) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cartResult = await client.query(
      `
      SELECT
        c.product_id,
        c.talla,
        c.quantity,
        p.nombre,
        p.precio
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      `,
      [userId]
    );

    const cartItems = cartResult.rows;

    if (cartItems.length === 0) {
      throw new Error("El carrito está vacío");
    }

    for (const item of cartItems) {
      const stockResult = await client.query(
        `
        SELECT stock
        FROM product_tallas
        WHERE product_id = $1 AND talla = $2
        `,
        [item.product_id, item.talla]
      );

      const stock = stockResult.rows[0]?.stock || 0;

      if (item.quantity > stock) {
        throw new Error(`Stock insuficiente para ${item.nombre} talla ${item.talla}`);
      }
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.precio,
      0
    );

    const orderResult = await client.query(
      `
      INSERT INTO orders
      (user_id, total, direccion, lat, lng)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [userId, total, direccion, lat ?? null, lng ?? null],
    );

    const order = orderResult.rows[0];

    const userResult = await client.query(
      `
      SELECT nombre, email
      FROM users
      WHERE id = $1
      `,
      [userId],
    );

    const usuario = userResult.rows[0];

    for (const item of cartItems) {
      await client.query(
        `
        INSERT INTO order_details
        (
          order_id,
          product_id,
          cantidad,
          precio_unitario,
          talla
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          order.id,
          item.product_id,
          item.quantity,
          item.precio,
          item.talla
        ]
      );

      await client.query(
        `
        UPDATE product_tallas
        SET stock = stock - $1
        WHERE product_id = $2
        AND talla = $3
        `,
        [item.quantity, item.product_id, item.talla]
      );
    }

    await client.query(
      `
      DELETE FROM cart
      WHERE user_id = $1
      `,
      [userId]
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
      o.fecha,
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
    [userId]
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
    [estado, id]
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