import pool from "../config/db.js";

export const createClaimDB = async (
    user_id,
    full_name,
    email,
    phone,
    claim_type,
    description
) => {
    const query = `
        INSERT INTO claims
        (user_id, full_name, email, phone, claim_type, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const values = [
        user_id,
        full_name,
        email,
        phone,
        claim_type,
        description
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};
