import express from 'express';
const router = express.Router();
import {
    getAllUsers,
    deleteUserById,
    getAllOrders,
    updateOrderStatus
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

// User management routes
router.route('/users').get(protect, admin, getAllUsers);
router.route('/users/:id').delete(protect, admin, deleteUserById);

// Order management routes
router.route('/orders').get(protect, admin, getAllOrders);
router.route('/orders/:id/status').put(protect, admin, updateOrderStatus);

export default router;