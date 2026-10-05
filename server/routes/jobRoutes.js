import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecommendedJobs,
  getCandidateMatches,
} from '../controllers/jobController.js';
import {
  authenticate,
  optionalAuthenticate,
  authorize,
} from '../middleware/authMiddleware.js';
import {
  validateJobCreate,
  validateJobUpdate,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// GET /api/jobs (Public/Optional Auth) & POST /api/jobs (HR / Admin only)
router
  .route('/')
  .get(optionalAuthenticate, getJobs)
  .post(
    authenticate,
    authorize('hr', 'admin'),
    validateJobCreate,
    createJob
  );

// GET /api/jobs/recommended (Job Seeker / Candidate / Admin)
router
  .route('/recommended')
  .get(authenticate, authorize('job_seeker', 'seeker', 'admin'), getRecommendedJobs);

// GET /api/jobs/:id/candidate-matches (HR Owner / Admin only)
router
  .route('/:id/candidate-matches')
  .get(authenticate, authorize('hr', 'admin'), getCandidateMatches);

// GET /api/jobs/:id (Public/Optional Auth) & PUT/DELETE /api/jobs/:id (HR Owner / Admin)
router
  .route('/:id')
  .get(optionalAuthenticate, getJobById)
  .put(
    authenticate,
    authorize('hr', 'admin'),
    validateJobUpdate,
    updateJob
  )
  .delete(authenticate, authorize('hr', 'admin'), deleteJob);

export default router;
