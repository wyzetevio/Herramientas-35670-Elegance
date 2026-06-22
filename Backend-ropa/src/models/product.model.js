import pool from "../config/db.js";

export const getAllProducts = async (
  categoria,
  genero,
  search,
  orderPrice
) => {
  let query = `
    SELECT 
      p.*,
      COALESCE(SUM(t.stock), 0) AS stock_total,
      COALESCE(
        json_agg(
          json_build_object(
            'talla', t.talla,
            'stock', t.stock
          )
        ) FILTER (WHERE t.talla IS NOT NULL),
        '[]'
      ) AS tallas
    FROM products p
    LEFT JOIN product_tallas t ON p.id = t.product_id
    WHERE 1=1
  `;

  const values = [];

  if (categoria) {
    values.push(categoria);
    query += ` AND p.categoria = $${values.length}`;
  }

  if (genero) {
    values.push(genero);
    query += ` AND p.genero = $${values.length}`;
  }

  if (search) {
    values.push(`%${search}%`);
    query += ` AND p.nombre ILIKE $${values.length}`;
  }

  query += ` GROUP BY p.id `;

  if (orderPrice === "asc") {
    query += ` ORDER BY p.precio ASC`;
  } else if (orderPrice === "desc") {
    query += ` ORDER BY p.precio DESC`;
  } else {
    query += ` ORDER BY p.id ASC`;
  }

  const result = await pool.query(query, values);
  return result.rows;
};


export const getProductById = async (id) => {
  const result = await pool.query(`
    SELECT 
      p.*,
      COALESCE(SUM(t.stock), 0) AS stock_total
    FROM products p
    LEFT JOIN product_tallas t ON p.id = t.product_id
    WHERE p.id = $1
    GROUP BY p.id
  `, [id]);

  return result.rows[0];
};

export const createProduct = async (product) => {
  const {
    nombre,
    descripcion,
    precio,
    imagen,
    categoria,
    genero,
    marca,
    color,
    tallas
  } = product;

  const result = await pool.query(
    `
    INSERT INTO products
    (nombre, descripcion, precio, imagen, categoria, genero, marca, color)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [nombre, descripcion, precio, imagen, categoria, genero, marca, color]
  );

  const productId = result.rows[0].id;

  if (tallas && Array.isArray(tallas)) {
    for (const t of tallas) {
      await pool.query(
        `
        INSERT INTO product_tallas (product_id, talla, stock)
        VALUES ($1,$2,$3)
        `,
        [productId, t.talla, t.stock]
      );
    }
  }

  return result.rows[0];
};


export const updateProduct = async (id, product) => {
  const {
    nombre,
    descripcion,
    precio,
    imagen,
    categoria,
    genero,
    marca,
    color,
    tallas
  } = product;

  const result = await pool.query(
    `
    UPDATE products
    SET
      nombre = $1,
      descripcion = $2,
      precio = $3,
      imagen = $4,
      categoria = $5,
      genero = $6,
      marca = $7,
      color = $8
    WHERE id = $9
    RETURNING *
    `,
    [nombre, descripcion, precio, imagen, categoria, genero, marca, color, id]
  );

  if (Array.isArray(tallas)) {
    for (const t of tallas) {
      const exists = await pool.query(
        `
      SELECT id FROM product_tallas
      WHERE product_id = $1 AND talla = $2
      `,
        [id, t.talla]
      );

      if (exists.rows.length > 0) {
        await pool.query(
          `
        UPDATE product_tallas
        SET stock = $1
        WHERE product_id = $2 AND talla = $3
        `,
          [t.stock, id, t.talla]
        );
      } else {
        await pool.query(
          `
        INSERT INTO product_tallas (product_id, talla, stock)
        VALUES ($1,$2,$3)
        `,
          [id, t.talla, t.stock]
        );
      }
    }
  }

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
    SELECT COUNT(*)
    FROM (
      SELECT p.id
      FROM products p
      LEFT JOIN product_tallas t ON p.id = t.product_id
      GROUP BY p.id
      HAVING COALESCE(SUM(t.stock), 0) <= 5
    ) AS low_stock
  `);

  return result.rows[0].count;
};