import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const {
      categoria,
      genero,
      search,
      orderPrice,
    } = req.query;

    const products = await getAllProducts(
      categoria,
      genero,
      search,
      orderPrice
    );

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

export const createNewProduct = async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el producto" });
  }
};

export const updateExistingProduct = async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar producto",
    });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const product = await deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json({
      message: "Producto eliminado",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al eliminar producto",
    });
  }
};
