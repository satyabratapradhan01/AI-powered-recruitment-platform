import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as applicationService from '../services/applicationService.js';

// @desc    Create a new job application
// @route   POST /api/applications
// @access  Private (Protected by JWT)
export const createApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.createApplication(req.user._id, req.body);
  return successResponse(res, 201, 'Job application created successfully', application);
});

// @desc    Get all job applications for logged-in user
// @route   GET /api/applications
// @access  Private (Protected by JWT)
export const getApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getUserApplications(req.user._id);
  return res.status(200).json({
    status: 'success',
    count: applications.length,
    data: applications,
  });
});

// @desc    Get single job application by ID (belonging to logged-in user)
// @route   GET /api/applications/:id
// @access  Private (Protected by JWT)
export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await applicationService.getApplicationById(req.params.id, req.user._id);
  return successResponse(res, 200, '', application);
});

// @desc    Update a job application by ID (belonging to logged-in user)
// @route   PUT /api/applications/:id
// @access  Private (Protected by JWT)
export const updateApplication = asyncHandler(async (req, res) => {
  const updatedApplication = await applicationService.updateApplication(
    req.params.id,
    req.user._id,
    req.body
  );
  return successResponse(
    res,
    200,
    'Job application updated successfully',
    updatedApplication
  );
});

// @desc    Delete a job application by ID (belonging to logged-in user)
// @route   DELETE /api/applications/:id
// @access  Private (Protected by JWT)
export const deleteApplication = asyncHandler(async (req, res) => {
  const deletedApplication = await applicationService.deleteApplication(
    req.params.id,
    req.user._id
  );
  return successResponse(res, 200, 'Job application deleted successfully', {
    _id: deletedApplication._id,
  });
});
