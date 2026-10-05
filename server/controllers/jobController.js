import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as jobService from '../services/jobService.js';

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (HR / Admin)
export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.user._id, req.body);
  return successResponse(res, 201, 'Job created successfully', job);
});

// @desc    Get all jobs (with search, filters, pagination, and sorting)
// @route   GET /api/jobs
// @access  Public / Private
export const getJobs = asyncHandler(async (req, res) => {
  const result = await jobService.getJobs(req.query, req.user);
  return res.status(200).json({
    status: 'success',
    count: result.jobs.length,
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
    data: result.jobs,
  });
});

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public / Private
export const getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id, req.user);
  return successResponse(res, 200, '', job);
});

// @desc    Update a job by ID
// @route   PUT /api/jobs/:id
// @access  Private (HR Owner / Admin)
export const updateJob = asyncHandler(async (req, res) => {
  const updatedJob = await jobService.updateJob(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body
  );
  return successResponse(res, 200, 'Job updated successfully', updatedJob);
});

// @desc    Delete a job by ID
// @route   DELETE /api/jobs/:id
// @access  Private (HR Owner / Admin)
export const deleteJob = asyncHandler(async (req, res) => {
  const result = await jobService.deleteJob(
    req.params.id,
    req.user._id,
    req.user.role
  );
  return successResponse(res, 200, 'Job deleted successfully', result);
});

// @desc    Get AI-powered personalized job recommendations for candidate
// @route   GET /api/jobs/recommended
// @access  Private (Job Seeker / Candidate / Admin)
export const getRecommendedJobs = asyncHandler(async (req, res) => {
  const recommendations = await jobService.getRecommendedJobs(req.user);
  return res.status(200).json({
    status: 'success',
    count: recommendations.length,
    data: recommendations,
  });
});
