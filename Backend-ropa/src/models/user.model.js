import pool from "../config/db.js";

export const registerUserDB = async (nombre, email, hashedPassword) => {
  const query = `
    INSERT INTO users (nombre, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, nombre, email, role ;`;

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
  const query = `SELECT id, nombre, email, role FROM users WHERE id = $1;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const getAllUsersDB = async () => {
  const result = await pool.query(`
    SELECT id, nombre, email, role
    FROM users
    ORDER BY id ASC
  `);

  return result.rows;
};

export const updateUserRoleDB = async (id, role) => {
  const result = await pool.query(
    `
    UPDATE users
    SET role = $1
    WHERE id = $2
    RETURNING id, nombre, email, role
    `,
    [role, id],
  );

  return result.rows[0];
};

export const deleteUserDB = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
    RETURNING id
    `,
    [id],
  );

  return result.rows[0];
};

export const countAdminsDB = async () => {
  const result = await pool.query(
    `
    SELECT COUNT(*) as total
    FROM users
    WHERE role = 'admin'
    `,
  );

  return Number(result.rows[0].total);
};

export const countUsersDB = async () => {
  const result = await pool.query(`
    SELECT COUNT(*) AS total
    FROM users
  `);

  return result.rows[0].total;
};
