import AppError from '../utils/AppError.js';

/**
 * Request Validation Middleware.
 */

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email, and password', 400));
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  next();
};

export const validateApplicationCreate = (req, res, next) => {
  const { company, jobTitle } = req.body;
  if (!company || !jobTitle) {
    return next(new AppError('Please provide both company and jobTitle', 400));
  }
  next();
};

export const validateApplicationUpdate = (req, res, next) => {
  const { status } = req.body;
  const allowedStatuses = ['Applied', 'Interview', 'Offer', 'Rejected'];
  if (status && !allowedStatuses.includes(status)) {
    return next(
      new AppError(`Invalid status. Allowed values are: ${allowedStatuses.join(', ')}`, 400)
    );
  }
  next();
};
