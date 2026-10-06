import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

/**
 * Authentication & RBAC Business Logic Service.
 */

export const generateToken = (user) => {
  const normalizedRole = user.role === 'seeker' ? 'job_seeker' : user.role;
  return jwt.sign(
    {
      id: user._id,
      userId: user._id,
      role: normalizedRole,
    },
    process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
    { expiresIn: '30d' }
  );
};

export const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  // Strict RBAC Role Control: Default 'job_seeker', allow 'hr'. NEVER allow public 'admin'.
  let assignedRole = 'job_seeker';
  if (role === 'hr') {
    assignedRole = 'hr';
  } else if (role === 'seeker' || role === 'job_seeker') {
    assignedRole = 'job_seeker';
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: assignedRole,
    accountStatus: 'active',
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    accountStatus: user.accountStatus,
    createdAt: user.createdAt,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.accountStatus && user.accountStatus !== 'active') {
    throw new AppError(`Access denied: Account is ${user.accountStatus}`, 403);
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'job_seeker',
      accountStatus: user.accountStatus || 'active',
      profile: user.profile,
      skills: user.skills,
      education: user.education,
      experience: user.experience,
      resume: user.resume,
    },
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (updateData.name !== undefined) user.name = updateData.name;
  if (updateData.skills !== undefined && Array.isArray(updateData.skills)) user.skills = updateData.skills;
  if (updateData.education !== undefined && Array.isArray(updateData.education)) user.education = updateData.education;
  if (updateData.experience !== undefined && Array.isArray(updateData.experience)) user.experience = updateData.experience;
  
  if (updateData.resume !== undefined) {
    user.resume = { ...(user.resume?.toObject ? user.resume.toObject() : user.resume || {}), ...updateData.resume };
    user.markModified('resume');
  }

  if (!user.profile) {
    user.profile = {};
  }

  const existingProfile = user.profile.toObject ? user.profile.toObject() : user.profile;
  const mergedProfile = { ...existingProfile };

  if (updateData.profile && typeof updateData.profile === 'object') {
    Object.assign(mergedProfile, updateData.profile);
  }

  const profileKeys = ['headline', 'bio', 'description', 'phone', 'location', 'website', 'portfolio', 'github', 'linkedin', 'companyName', 'industry', 'teamSize', 'recruiterEmail'];
  profileKeys.forEach((key) => {
    if (updateData[key] !== undefined) {
      const dbKey = key === 'portfolio' ? 'website' : key;
      mergedProfile[dbKey] = updateData[key];
    }
  });

  user.profile = mergedProfile;
  user.markModified('profile');

  const updatedUser = await user.save();
  const userObj = updatedUser.toObject();
  delete userObj.password;
  return userObj;
};

// Admin Service Operations
export const getAllUsers = async () => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return users;
};

export const updateUserStatus = async (targetUserId, accountStatus) => {
  const allowedStatuses = ['active', 'deactivated', 'suspended'];
  if (!allowedStatuses.includes(accountStatus)) {
    throw new AppError(
      `Invalid account status. Allowed values: ${allowedStatuses.join(', ')}`,
      400
    );
  }

  const user = await User.findById(targetUserId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.accountStatus = accountStatus;
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};
