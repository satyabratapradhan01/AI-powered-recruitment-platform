import Notification from '../models/Notification.js';
import AppError from '../utils/AppError.js';

/**
 * In-App Notification Business Logic & Database Service.
 */

export const createNotification = async (data) => {
  const {
    userId,
    type,
    title,
    message,
    relatedApplicationId,
    relatedInterviewId,
  } = data;

  if (!userId || !type || !title || !message) {
    return null;
  }

  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedApplicationId,
      relatedInterviewId,
      read: false,
    });
    return notification;
  } catch (err) {
    console.error('Failed to create in-app notification:', err.message);
    return null;
  }
};

export const getUserNotifications = async (userId) => {
  const notifications = await Notification.find({ userId })
    .populate('relatedApplicationId', 'company jobTitle status')
    .populate('relatedInterviewId', 'interviewDate interviewTime interviewType meetingLink status')
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    userId,
    read: false,
  });

  return {
    notifications,
    unreadCount,
  };
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  notification.read = true;
  await notification.save();

  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, read: false }, { read: true });
  return { message: 'All notifications marked as read' };
};
