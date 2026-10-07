import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as applicationService from '../services/applicationService.js';

// @desc    Submit candidate job application or custom application entry
// @route   POST /api/applications
// @access  Private (Candidate / Job Seeker)
export const createApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.createApplication(req.user._id, req.body);
  return successResponse(res, 201, 'Application submitted successfully', application);
});

// @desc    Get job applications (filtered by role & query params)
// @route   GET /api/applications
// @access  Private (Candidate / HR / Admin)
export const getApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getApplications(
    req.user._id,
    req.user.role,
    req.query
  );
  return res.status(200).json({
    status: 'success',
    count: applications.length,
    data: applications,
  });
});

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private (Candidate Owner / HR Owner / Admin)
export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await applicationService.getApplicationById(
    req.params.id,
    req.user._id,
    req.user.role
  );
  return successResponse(res, 200, '', application);
});

// @desc    Update application status, recruiter notes, or details
// @route   PUT /api/applications/:id
// @access  Private (Candidate / HR / Admin)
export const updateApplication = asyncHandler(async (req, res) => {
  const updatedApplication = await applicationService.updateApplication(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body
  );
  return successResponse(
    res,
    200,
    'Application updated successfully',
    updatedApplication
  );
});

// @desc    Candidate withdraw application
// @route   PUT /api/applications/:id/withdraw
// @access  Private (Candidate)
export const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.withdrawApplication(
    req.params.id,
    req.user._id
  );
  return successResponse(
    res,
    200,
    'Application withdrawn successfully',
    application
  );
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Candidate Owner / HR Owner / Admin)
export const deleteApplication = asyncHandler(async (req, res) => {
  const deletedApplication = await applicationService.deleteApplication(
    req.params.id,
    req.user._id,
    req.user.role
  );
  return successResponse(res, 200, 'Application deleted successfully', {
    _id: deletedApplication._id,
  });
});

// @desc    Trigger AI-Powered ATS Analysis on an application
// @route   POST /api/applications/:id/ats-analysis
// @access  Private (Candidate Owner / HR Owner / Admin)
export const triggerATSAnalysis = asyncHandler(async (req, res) => {
  const application = await applicationService.triggerATSAnalysis(
    req.params.id,
    req.user._id,
    req.user.role
  );
  return successResponse(
    res,
    200,
    'ATS Analysis completed successfully',
    application
  );
});

// @desc    Send / Issue Offer Letter to candidate
// @route   POST /api/applications/:id/offer
// @access  Private (HR / Admin)
export const sendOfferLetter = asyncHandler(async (req, res) => {
  const application = await applicationService.sendOfferLetter(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body
  );
  return successResponse(
    res,
    200,
    'Offer letter sent to candidate successfully!',
    application
  );
});

// @desc    Candidate responds to offer letter (Accept / Reject)
// @route   PUT /api/applications/:id/offer/respond
// @access  Private (Candidate / Admin)
export const respondToOfferLetter = asyncHandler(async (req, res) => {
  const application = await applicationService.respondToOfferLetter(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body
  );
  return successResponse(
    res,
    200,
    `Offer letter ${req.body.response} successfully!`,
    application
  );
});

