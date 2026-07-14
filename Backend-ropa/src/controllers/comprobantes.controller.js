import { getComprobanteByOrderDB } from "../models/comprobante.model.js";

export const getComprobanteByOrder = async (req, res) => {
  try {
    const comprobante = await getComprobanteByOrderDB(req.params.orderId);

    if (!comprobante) {
      return res.status(404).json({
        message: "Comprobante no encontrado",
      });
    }

    res.json(comprobante);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener el comprobante",
    });
  }
};