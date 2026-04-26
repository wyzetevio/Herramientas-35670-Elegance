import pool from "../config/db.js";

export const registerUserDB = async (nombre, email, hashedPassword) => {
    const query = `
    INSERT INTO users (nombre, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, nombre, email;`;

    const values = [nombre, email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
};


export const findUserByEmailDB = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};


export const getUserByIdDB = async (id) => {
    const query = `SELECT id, nombre, email FROM users WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};