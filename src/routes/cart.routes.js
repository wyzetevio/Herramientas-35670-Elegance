import express from 'express';
import {
    getCart,
    addCartItem,
    updateCartItem,
    deleteCartProduct,
    clearCartUser
} from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/:userId', getCart);
router.post('/', addCartItem);
router.put('/', updateCartItem);
router.delete('/:userId/:productId', deleteCartProduct);
router.delete('/clear/:userId', clearCartUser);

export default router;
