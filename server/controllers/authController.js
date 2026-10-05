import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as authService from '../services/authService.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const userData = await authService.registerUser(req.body);
  return successResponse(res, 201, 'User registered successfully', userData);
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { token, user } = await authService.loginUser(req.body);
  return res.status(200).json({
    status: 'success',
    message: 'Login successful',
    token,
    user,
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private (Protected by JWT)
export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user._id);
  return successResponse(res, 200, '', user);
});
