import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
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
