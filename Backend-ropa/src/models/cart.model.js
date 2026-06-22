import pool from "../config/db.js";

export const getCartByUser = async (user_id) => {
  const result = await pool.query(
    `
    SELECT 
      c.id,
      c.product_id,
      c.talla,
      c.quantity,
      p.nombre,
      p.precio,
      p.imagen
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = $1
    `,
    [user_id]
  );

  return result.rows;
};

export const addProductToCart = async (
  user_id,
  product_id,
  talla,
  quantity
) => {
  const check = await pool.query(
    `
    SELECT * FROM cart 
    WHERE user_id = $1 
    AND product_id = $2 
    AND talla = $3
    `,
    [user_id, product_id, talla]
  );

  if (check.rowCount > 0) {
    await pool.query(
      `
      UPDATE cart 
      SET quantity = quantity + $1 
      WHERE user_id = $2 
      AND product_id = $3 
      AND talla = $4
      `,
      [quantity, user_id, product_id, talla]
    );
  } else {
    await pool.query(
      `
      INSERT INTO cart (user_id, product_id, talla, quantity)
      VALUES ($1, $2, $3, $4)
      `,
      [user_id, product_id, talla, quantity]
    );
  }
};

export const updateCartQuantity = async (
  user_id,
  product_id,
  talla,
  quantity
) => {
  await pool.query(
    `
    UPDATE cart 
    SET quantity = $1 
    WHERE user_id = $2 
    AND product_id = $3 
    AND talla = $4
    `,
    [quantity, user_id, product_id, talla]
  );
};

export const deleteCartItem = async (user_id, product_id, talla) => {
  await pool.query(
    `
    DELETE FROM cart 
    WHERE user_id = $1 
    AND product_id = $2 
    AND talla = $3
    `,
    [user_id, product_id, talla]
  );
};

export const clearCart = async (user_id) => {
  await pool.query("DELETE FROM cart WHERE user_id = $1", [user_id]);
};