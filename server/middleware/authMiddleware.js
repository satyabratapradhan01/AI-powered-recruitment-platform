import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes middleware
export const protect = async (req, res, next) => {
  let token;

  // Read Authorization header expecting format: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_12345'
      );

      // Fetch user from database using decoded ID (excluding password) and attach to req.user
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Not authorized, user no longer exists',
        });
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized, token verification failed',
      });
    }
  }

  // Reject request if token is missing
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Not authorized, no token provided',
    });
  }
};
