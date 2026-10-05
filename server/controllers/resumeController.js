import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as resumeService from '../services/resumeService.js';

// @desc    Upload candidate resume (PDF/DOCX max 5MB, R2 storage, text extraction)
// @route   POST /api/resumes/upload
// @access  Private (Job Seeker / Candidate)
export const uploadResume = asyncHandler(async (req, res) => {
  const result = await resumeService.uploadResume(req.user._id, req.file);
  return successResponse(res, 200, 'Resume uploaded successfully', result);
});

// @desc    Get signed view URL for current candidate's resume
// @route   GET /api/resumes/my-resume
// @access  Private (Candidate)
export const getMyResume = asyncHandler(async (req, res) => {
  const result = await resumeService.getResumeViewUrl(req.user._id, req.user);
  return successResponse(res, 200, '', result);
});

// @desc    Get signed view URL & candidate resume details (for HR/Admin)
// @route   GET /api/resumes/candidate/:userId
// @access  Private (HR / Admin)
export const getCandidateResume = asyncHandler(async (req, res) => {
  const result = await resumeService.getResumeViewUrl(req.params.userId, req.user);
  return successResponse(res, 200, '', result);
});

// @desc    Delete candidate resume from R2 & clear user metadata
// @route   DELETE /api/resumes
// @access  Private (Candidate)
export const deleteResume = asyncHandler(async (req, res) => {
  const result = await resumeService.deleteResume(req.user._id);
  return successResponse(res, 200, result.message);
});
