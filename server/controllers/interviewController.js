import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as interviewService from '../services/interviewService.js';

// @desc    Schedule an interview for a candidate application
// @route   POST /api/interviews
// @access  Private (HR / Admin)
export const scheduleInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.scheduleInterview(
    req.user._id,
    req.user.role,
    req.body
  );
  return successResponse(res, 201, 'Interview scheduled successfully', interview);
});

// @desc    Reschedule an interview (date, time, link, notes)
// @route   PUT /api/interviews/:id/reschedule
// @access  Private (HR Owner / Admin)
export const rescheduleInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.rescheduleInterview(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body
  );
  return successResponse(res, 200, 'Interview rescheduled successfully', interview);
});

// @desc    Mark interview as completed
// @route   PUT /api/interviews/:id/complete
// @access  Private (HR Owner / Admin)
export const completeInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.completeInterview(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body
  );
  return successResponse(res, 200, 'Interview marked as completed', interview);
});

// @desc    Cancel an interview
// @route   PUT /api/interviews/:id/cancel
// @access  Private (HR Owner / Admin)
export const cancelInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.cancelInterview(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body
  );
  return successResponse(res, 200, 'Interview cancelled', interview);
});

// @desc    Get all interviews for logged-in user (candidate or HR/admin)
// @route   GET /api/interviews
// @access  Private (Candidate / HR / Admin)
export const getInterviews = asyncHandler(async (req, res) => {
  const interviews = await interviewService.getInterviews(
    req.user._id,
    req.user.role,
    req.query
  );
  return res.status(200).json({
    status: 'success',
    count: interviews.length,
    data: interviews,
  });
});

// @desc    Get single interview details by ID
// @route   GET /api/interviews/:id
// @access  Private (Candidate / HR / Admin)
export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await interviewService.getInterviewById(
    req.params.id,
    req.user._id,
    req.user.role
  );
  return successResponse(res, 200, '', interview);
});

// @desc    Generate AI-Powered Interview Preparation Questions
// @route   POST /api/interviews/prep/generate
// @access  Private (Candidate / Job Seeker / Admin)
export const generateInterviewPrep = asyncHandler(async (req, res) => {
  const prepData = await interviewService.generateInterviewPrep(
    req.user._id,
    req.body
  );
  return successResponse(
    res,
    200,
    'AI Interview Preparation questions generated successfully',
    prepData
  );
});

// @desc    Evaluate Candidate Written Practice Answer using Gemini AI
// @route   POST /api/interviews/prep/feedback
// @access  Private (Candidate / Job Seeker / Admin)
export const evaluateInterviewAnswer = asyncHandler(async (req, res) => {
  const feedback = await interviewService.evaluateInterviewAnswerService(
    req.user._id,
    req.body
  );
  return successResponse(
    res,
    200,
    'AI answer feedback evaluated successfully',
    feedback
  );
});
