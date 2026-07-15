import pool from "../config/db.js";

export const createComprobanteDB = async (
  client,
  { orderId, cliente, direccion, metodoPago, subtotal, igv, total },
) => {
  const numero = `B001-${String(orderId).padStart(6, "0")}`;

  const result = await client.query(
    `
    INSERT INTO comprobantes
    (
      order_id,
      numero,
      cliente,
      direccion,
      metodo_pago,
      subtotal,
      igv,
      total
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [orderId, numero, cliente, direccion, metodoPago, subtotal, igv, total],
  );

  return result.rows[0];
};

export const getComprobanteByOrderDB = async (orderId) => {
  // Obtener el comprobante
  const comprobanteResult = await pool.query(
    `
    SELECT *
    FROM comprobantes
    WHERE order_id = $1
    `,
    [orderId],
  );

  const comprobante = comprobanteResult.rows[0];

  if (!comprobante) {
    return null;
  }

  // Obtener los productos del pedido
  const detalleResult = await pool.query(
    `
    SELECT
      p.nombre AS producto,
      od.talla,
      od.cantidad,
      od.precio_unitario,
      (od.cantidad * od.precio_unitario) AS subtotal
    FROM order_details od
    JOIN products p
      ON od.product_id = p.id
    WHERE od.order_id = $1
    `,
    [orderId],
  );

  comprobante.detalles = detalleResult.rows;

  return comprobante;
};