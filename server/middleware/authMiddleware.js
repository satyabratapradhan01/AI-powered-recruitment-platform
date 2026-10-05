import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication Middleware: Verifies JWT token and verifies accountStatus is active.
 */
export const authenticate = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_12345'
      );

      const userId = decoded.userId || decoded.id;
      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Not authorized, user no longer exists',
        });
      }

      if (user.accountStatus && user.accountStatus !== 'active') {
        return res.status(403).json({
          status: 'fail',
          message: `Access denied: Account is ${user.accountStatus}`,
        });
      }

      req.user = user;
      req.userRole = user.role;
      return next();
    } catch (error) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized, token verification failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Not authorized, no token provided',
    });
  }
};

// Alias protect to preserve backward compatibility for existing code & tests
export const protect = authenticate;

/**
 * Optional Authentication Middleware: Attaches req.user if a valid token exists, but does not block unauthenticated requests.
 */
export const optionalAuthenticate = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_12345'
      );
      const userId = decoded.userId || decoded.id;
      req.user = await User.findById(userId).select('-password');
      req.userRole = req.user ? req.user.role : null;
    } catch (err) {
      req.user = null;
      req.userRole = null;
    }
  }
  next();
};

/**
 * Role-Based Access Control (RBAC) Middleware.
 * Usage: authorize('admin'), authorize('hr', 'admin'), authorize('job_seeker')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized, no user session found',
      });
    }

    // Expand job_seeker <-> seeker equivalent alias matching
    const expandedAllowedRoles = roles.flatMap((role) =>
      role === 'job_seeker' || role === 'seeker' ? ['job_seeker', 'seeker'] : [role]
    );

    if (!expandedAllowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};
