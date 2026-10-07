import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  withdrawApplication,
  deleteApplication,
  triggerATSAnalysis,
  sendOfferLetter,
  respondToOfferLetter,
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
  .get(authorize('job_seeker', 'seeker', 'hr', 'admin'), getApplications);

// Send Offer Letter route (HR / Admin)
router
  .route('/:id/offer')
  .post(authorize('hr', 'admin'), sendOfferLetter);

// Respond to Offer Letter route (Candidate / Admin)
router
  .route('/:id/offer/respond')
  .put(authorize('job_seeker', 'seeker', 'admin'), respondToOfferLetter);

// Candidate withdraw application route
router
  .route('/:id/withdraw')
  .put(authorize('job_seeker', 'seeker', 'admin'), withdrawApplication);

// Trigger AI-powered ATS Analysis route
router
  .route('/:id/ats-analysis')
  .post(authorize('job_seeker', 'seeker', 'hr', 'admin'), triggerATSAnalysis);

// GET /api/applications/:id, PUT /api/applications/:id, DELETE /api/applications/:id
router
  .route('/:id')
  .get(authorize('job_seeker', 'seeker', 'hr', 'admin'), getApplicationById)
  .put(
    authorize('job_seeker', 'seeker', 'hr', 'admin'),
    validateApplicationUpdate,
    updateApplication
  )
  .delete(authorize('job_seeker', 'seeker', 'hr', 'admin'), deleteApplication);

export default router;
