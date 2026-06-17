import express from 'express';
import { getProducts, getProduct, createNewProduct } from '../controllers/products.controller.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createNewProduct);

export default router;
