import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController.js';
import {
  validateApplicationCreate,
  validateApplicationUpdate,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// Apply JWT authentication protection to all application routes
router.use(authenticate);

// GET /api/applications & POST /api/applications
router
  .route('/')
  .post(
    authorize('job_seeker', 'seeker', 'admin'),
    validateApplicationCreate,
    createApplication
  )
  .get(authorize('job_seeker', 'seeker', 'admin'), getApplications);

// GET /api/applications/:id, PUT /api/applications/:id, DELETE /api/applications/:id
router
  .route('/:id')
  .get(authorize('job_seeker', 'seeker', 'admin'), getApplicationById)
  .put(
    authorize('job_seeker', 'seeker', 'admin'),
    validateApplicationUpdate,
    updateApplication
  )
  .delete(authorize('job_seeker', 'seeker', 'admin'), deleteApplication);

export default router;
