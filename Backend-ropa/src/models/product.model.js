import pool from '../config/db.js';

export const getAllProducts = async () => {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    return result.rows;
};

export const getProductById = async (id) => {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
};

export const createProduct = async (product) => {
    const { name, description, price, image_url } = product;
    const result = await pool.query(
        'INSERT INTO products (name, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, description, price, image_url]
    );
    return result.rows[0];
};