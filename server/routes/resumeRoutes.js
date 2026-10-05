import express from 'express';
import {
  uploadResume,
  getMyResume,
  getCandidateResume,
  deleteResume,
} from '../controllers/resumeController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { handleUploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply authentication to all resume routes
router.use(authenticate);

// Candidate resume upload endpoint (PDF/DOCX, 5MB limit)
router.post('/upload', handleUploadMiddleware, uploadResume);

// Candidate view own resume endpoint
router.get('/my-resume', getMyResume);

// HR / Admin view candidate resume endpoint
router.get('/candidate/:userId', authorize('hr', 'admin'), getCandidateResume);

// Candidate delete resume endpoint
router.delete('/', deleteResume);

export default router;
