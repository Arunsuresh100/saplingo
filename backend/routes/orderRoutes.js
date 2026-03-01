// backend/routes/orderRoutes.js

import express from 'express';
const router = express.Router();
import { addOrderItems, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

// When a POST request comes to '/', use the addOrderItems function.
// The 'protect' middleware runs first to identify the user.
router.route('/').post(protect, addOrderItems);

// When a GET request comes to '/myorders', use the getMyOrders function.
router.route('/myorders').get(protect, getMyOrders);

export default router;