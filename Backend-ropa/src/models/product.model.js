import pool from "../config/db.js";

export const getAllProducts = async () => {
  const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
  return result.rows;
};

export const getProductById = async (id) => {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0];
};

export const createProduct = async (product) => {
  const { nombre, descripcion, precio, imagen, categoria, stock } = product;

  const result = await pool.query(
    `
        INSERT INTO products
        (nombre,descripcion,precio,imagen,categoria, stock) VALUES($1,$2, $3, $4, $5, $6)
        RETURNING *
        `,
    [nombre, descripcion, precio, imagen, categoria, stock],
  );

  return result.rows[0];
};

export const updateProduct = async (id, product) => {
  const { nombre, descripcion, precio, imagen, categoria, stock } = product;

  const result = await pool.query(
    `
        UPDATE products
        SET
            nombre = $1,
            descripcion = $2,
            precio = $3,
            imagen = $4,
            categoria = $5,
            stock = $6
        WHERE id = $7
        RETURNING *
        `,
    [nombre, descripcion, precio, imagen, categoria, stock, id],
  );

  return result.rows[0];
};

export const deleteProduct = async (id) => {
  const result = await pool.query(
    `
        DELETE FROM products
        WHERE id = $1
        RETURNING *
        `,
    [id],
  );

  return result.rows[0];
};

export const countProductsDB = async () => {
  const result = await pool.query(`
    SELECT COUNT(*) AS total
    FROM products
  `);

  return result.rows[0].total;
};

export const countLowStockProductsDB = async () => {
  const result = await pool.query(`
    SELECT COUNT(*) AS total
    FROM products
    WHERE stock <= 5
  `);

  return result.rows[0].total;
};
