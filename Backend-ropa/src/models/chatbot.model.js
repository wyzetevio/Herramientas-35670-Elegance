import pool from "../config/db.js";

export const chatbotResponse = async (message) => {
  const question = message.toLowerCase();

  if (question.includes("hola")) {
    return "¡Hola! ¿En qué puedo ayudarte?";
  }

  if (question.includes("envio")) {
    return "Realizamos envíos a todo el Perú.";
  }

  if (question.includes("pago")) {
    return "Aceptamos Visa, Mastercard y Yape.";
  }

  const result = await pool.query(`
        SELECT nombre,
               precio,
               stock
        FROM products
    `);

  const products = result.rows;

  const found = products.filter((p) =>
    question.includes(p.nombre.toLowerCase()),
  );

  if (found.length > 0) {
    return found
      .map(
        (p) =>
          `${p.nombre}
Precio: S/.${p.precio}
Stock: ${p.stock}`,
      )
      .join("\n\n");
  }

  return "Lo siento, no encontré información relacionada.";
};
