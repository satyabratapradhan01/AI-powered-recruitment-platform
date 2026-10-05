import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getUsers,
  updateUserStatus,
} from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public Authentication Routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected User Routes
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

// Admin-Only RBAC User Management Routes
router.get('/users', authenticate, authorize('admin'), getUsers);
router.put('/users/:id/status', authenticate, authorize('admin'), updateUserStatus);

export default router;
