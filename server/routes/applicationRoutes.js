import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController.js';

const router = express.Router();

// Apply JWT auth protection middleware to all application routes
router.use(protect);

// GET /api/applications & POST /api/applications
router.route('/').post(createApplication).get(getApplications);

// GET /api/applications/:id, PUT /api/applications/:id, DELETE /api/applications/:id
router
  .route('/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

export default router;
