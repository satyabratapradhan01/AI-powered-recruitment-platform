import Job from '../models/Job.js';
import User from '../models/User.js';
import JobApplication from '../models/JobApplication.js';
import AppError from '../utils/AppError.js';
import { getJobRecommendations, getCandidateMatchesForJob } from './aiService.js';

/**
 * Job Management Business Logic & Database Service.
 */

const normalizeArrayField = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim()) {
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

export const createJob = async (userId, data) => {
  const posterUser = await User.findById(userId);
  if (posterUser && posterUser.role === 'hr' && posterUser.accountStatus !== 'active') {
    throw new AppError(
      'Your HR Recruiter account is currently pending Administrator approval. You will be able to post jobs once an Administrator approves your account.',
      403
    );
  }

  const {
    title,
    company,
    description,
    responsibilities,
    requiredSkills,
    preferredSkills,
    experienceRequired,
    location,
    workMode,
    employmentType,
    salaryMin,
    salaryMax,
    applicationDeadline,
    status,
  } = data;

  const job = await Job.create({
    title,
    company,
    description,
    responsibilities: normalizeArrayField(responsibilities),
    requiredSkills: normalizeArrayField(requiredSkills),
    preferredSkills: normalizeArrayField(preferredSkills),
    experienceRequired: experienceRequired || '0-2 years',
    location: location || 'Remote',
    workMode: workMode || 'Remote',
    employmentType: employmentType || 'Full-time',
    salaryMin: salaryMin !== undefined ? Number(salaryMin) : 0,
    salaryMax: salaryMax !== undefined ? Number(salaryMax) : 0,
    applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
    status: status || 'Active',
    postedBy: userId,
  });

  return job;
};

export const getJobs = async (queryParams, currentUser) => {
  const {
    search,
    q,
    location,
    workMode,
    employmentType,
    status,
    myJobs,
    page = 1,
    limit = 10,
    sort = '-createdAt',
  } = queryParams;

  const query = {};

  // Text search filtering (across title, company, location, description, skills)
  const searchQuery = search || q;
  if (searchQuery) {
    const searchRegex = new RegExp(searchQuery.trim(), 'i');
    query.$or = [
      { title: searchRegex },
      { company: searchRegex },
      { location: searchRegex },
      { description: searchRegex },
      { requiredSkills: searchRegex },
    ];
  }

  // Location filter
  if (location) {
    query.location = new RegExp(location.trim(), 'i');
  }

  // WorkMode filter
  if (workMode) {
    query.workMode = workMode;
  }

  // EmploymentType filter
  if (employmentType) {
    query.employmentType = employmentType;
  }

  // Filter for HR's own jobs
  if (myJobs === 'true' || myJobs === true) {
    if (!currentUser) {
      throw new AppError('Authentication required to view your posted jobs', 401);
    }
    query.postedBy = currentUser._id;
    if (status) query.status = status;
  } else {
    // General listing: Job seekers & public see Active jobs by default unless specific status requested by Admin/Poster
    if (status) {
      query.status = status;
    } else if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'hr')) {
      query.status = 'Active';
    }
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Job.countDocuments(query);
  const jobs = await Job.find(query)
    .populate('postedBy', 'name email profile.companyName')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  return {
    jobs,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

export const getJobById = async (jobId, currentUser) => {
  const job = await Job.findById(jobId).populate(
    'postedBy',
    'name email profile.companyName'
  );

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  // Non-active jobs are restricted to owner or admin
  if (job.status !== 'Active') {
    const isOwner =
      currentUser && job.postedBy && job.postedBy._id.toString() === currentUser._id.toString();
    const isAdmin = currentUser && currentUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('Job not found or no longer active', 404);
    }
  }

  return job;
};

export const updateJob = async (jobId, userId, userRole, updateData) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  // RBAC ownership check: HR can update only their own job, Admin can update all
  if (userRole !== 'admin' && job.postedBy.toString() !== userId.toString()) {
    throw new AppError('Forbidden: You can only update jobs that you posted', 403);
  }

  const updatableFields = [
    'title',
    'company',
    'description',
    'responsibilities',
    'requiredSkills',
    'preferredSkills',
    'experienceRequired',
    'location',
    'workMode',
    'employmentType',
    'salaryMin',
    'salaryMax',
    'applicationDeadline',
    'status',
  ];

  updatableFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      if (['responsibilities', 'requiredSkills', 'preferredSkills'].includes(field)) {
        job[field] = normalizeArrayField(updateData[field]);
      } else {
        job[field] = updateData[field];
      }
    }
  });

  const updatedJob = await job.save();
  return updatedJob;
};

export const deleteJob = async (jobId, userId, userRole) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  // RBAC ownership check: HR can delete only their own job, Admin can delete all
  if (userRole !== 'admin' && job.postedBy.toString() !== userId.toString()) {
    throw new AppError('Forbidden: You can only delete jobs that you posted', 403);
  }

  await job.deleteOne();
  return { _id: jobId };
};

export const getRecommendedJobs = async (currentUser) => {
  if (!currentUser) {
    throw new AppError('Authentication required to view recommended jobs', 401);
  }

  const candidateUser = await User.findById(currentUser._id);
  if (!candidateUser) {
    throw new AppError('User profile not found', 404);
  }

  const activeJobs = await Job.find({ status: 'Active' })
    .populate('postedBy', 'name email profile.companyName')
    .sort({ createdAt: -1 });

  const recommendations = await getJobRecommendations(candidateUser, activeJobs);
  return recommendations;
};

export const getCandidateMatches = async (jobId, currentUser) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  // RBAC Ownership Check: HR can view candidates only for their own job, Admin can view all
  const isOwner = currentUser && job.postedBy && job.postedBy.toString() === currentUser._id.toString();
  const isAdmin = currentUser && currentUser.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError('Forbidden: You can only view candidate AI matches for your own job postings', 403);
  }

  const applications = await JobApplication.find({ jobId })
    .populate('candidateId', 'name email profile skills education experience resume accountStatus')
    .sort({ createdAt: -1 });

  const matches = await getCandidateMatchesForJob(job, applications);
  return matches;
};
