// backend/routes/userRoutes.js

import express from 'express';
const router = express.Router();
import { registerUser, authUser, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/register').post(registerUser);
router.route('/login').post(authUser);

// Make sure this line exists and includes 'protect'
router.route('/profile').put(protect, updateUserProfile);

export default router;