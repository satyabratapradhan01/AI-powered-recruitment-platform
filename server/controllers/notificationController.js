import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as notificationService from '../services/notificationService.js';

// @desc    Get in-app notifications for logged-in user with unread count
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getUserNotifications(req.user._id);
  return res.status(200).json({
    status: 'success',
    unreadCount: result.unreadCount,
    count: result.notifications.length,
    data: result.notifications,
  });
});

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(
    req.params.id,
    req.user._id
  );
  return successResponse(res, 200, 'Notification marked as read', notification);
});

// @desc    Mark all notifications for current user as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);
  return successResponse(res, 200, result.message);
});
