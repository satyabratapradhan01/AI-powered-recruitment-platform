import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply JWT authentication protection to all notification routes
router.use(authenticate);

// GET /api/notifications & PATCH /api/notifications/read-all
router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', markAsRead);

export default router;
