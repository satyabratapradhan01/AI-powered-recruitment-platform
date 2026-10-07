import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { createNotification } from './notificationService.js';
import { sendHRApprovedEmail } from './emailService.js';

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
  let initialStatus = 'active';

  if (role === 'hr') {
    assignedRole = 'hr';
    initialStatus = 'pending'; // HR signup requires Admin approval before posting jobs
  } else if (role === 'seeker' || role === 'job_seeker') {
    assignedRole = 'job_seeker';
    initialStatus = 'active';
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: assignedRole,
    accountStatus: initialStatus,
  });

  // If HR account registered with pending status, create notifications
  if (assignedRole === 'hr' && initialStatus === 'pending') {
    // Notify HR user
    await createNotification({
      userId: user._id,
      type: 'account_status',
      title: 'HR Registration Pending Admin Approval',
      message: 'Your HR Recruiter account registration is currently pending Administrator approval. You will be able to post jobs once an Administrator approves your request.',
    });

    // Notify all Platform Admin users
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await createNotification({
        userId: admin._id,
        type: 'hr_approval_request',
        title: 'New HR Signup Pending Approval',
        message: `New HR Recruiter ${user.name} (${user.email}) registered and is awaiting Admin approval.`,
      });
    }
  }

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

  if (user.accountStatus && (user.accountStatus === 'deactivated' || user.accountStatus === 'suspended')) {
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
  const allowedStatuses = ['active', 'pending', 'deactivated', 'suspended'];
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

  const previousStatus = user.accountStatus;
  user.accountStatus = accountStatus;
  await user.save();

  // If HR account was approved (changed to active)
  if (user.role === 'hr' && accountStatus === 'active' && previousStatus !== 'active') {
    await createNotification({
      userId: user._id,
      type: 'account_status',
      title: '🎉 HR Account Approved!',
      message: 'Congratulations! Your HR Recruiter account has been approved by the Administrator. You can now post job openings.',
    });

    if (user.email) {
      sendHRApprovedEmail({ hrEmail: user.email, hrName: user.name }).catch((err) =>
        console.error('HR Approved Email error:', err.message)
      );
    }
  }

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};
