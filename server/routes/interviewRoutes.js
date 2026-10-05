import express from 'express';
import {
  scheduleInterview,
  rescheduleInterview,
  completeInterview,
  cancelInterview,
  getInterviews,
  getInterviewById,
  generateInterviewPrep,
  evaluateInterviewAnswer,
} from '../controllers/interviewController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateInterviewSchedule } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Apply JWT authentication protection to all interview routes
router.use(authenticate);

// AI Interview Preparation Routes
router
  .route('/prep/generate')
  .post(authorize('job_seeker', 'seeker', 'admin'), generateInterviewPrep);

router
  .route('/prep/feedback')
  .post(authorize('job_seeker', 'seeker', 'admin'), evaluateInterviewAnswer);

// GET /api/interviews (Candidate / HR / Admin) & POST /api/interviews (HR / Admin only)
router
  .route('/')
  .get(getInterviews)
  .post(
    authorize('hr', 'admin'),
    validateInterviewSchedule,
    scheduleInterview
  );

// HR / Admin Status Action Routes
router
  .route('/:id/reschedule')
  .put(authorize('hr', 'admin'), rescheduleInterview);

router
  .route('/:id/complete')
  .put(authorize('hr', 'admin'), completeInterview);

router
  .route('/:id/cancel')
  .put(authorize('hr', 'admin'), cancelInterview);

// GET /api/interviews/:id
router.route('/:id').get(getInterviewById);

export default router;
