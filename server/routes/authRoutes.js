import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', validateRegister, registerUser);

// POST /api/auth/login
router.post('/login', validateLogin, loginUser);

// GET /api/auth/me
router.get('/me', protect, getMe);

export default router;
