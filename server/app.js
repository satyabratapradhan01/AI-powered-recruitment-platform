import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

import connectDB from './config/db.js';
import { seedAdminUser } from './utils/seedAdmin.js';

const app = express();

// Enable CORS for separate frontend/backend deployments
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local fallback static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check Endpoints (supports both /api/health and /health)

app.get('/', (req, res)=>{
  res.send("Api is working...")
})

// Serverless DB auto-connect middleware for all API requests
let isSeeded = false;
app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!isSeeded) {
      await seedAdminUser();
      isSeeded = true;
    }
    next();
  } catch (err) {
    console.error('Serverless DB middleware connection error:', err.message);
    return res.status(500).json({
      status: 'error',
      message: `Database Connection Error: ${err.message}. Please verify MONGODB_URI is set under Vercel Project Settings -> Environment Variables, and MongoDB Atlas IP Access List allows 0.0.0.0/0.`,
    });
  }
});

// API Routes (supports both /api/* and /* in case Vercel rewrites strip /api prefix)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/applications', applicationRoutes);
app.use('/applications', applicationRoutes);

app.use('/api/jobs', jobRoutes);
app.use('/jobs', jobRoutes);

app.use('/api/resumes', resumeRoutes);
app.use('/resumes', resumeRoutes);

app.use('/api/interviews', interviewRoutes);
app.use('/interviews', interviewRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/notifications', notificationRoutes);

// Handle Unknown Routes (404 Not Found)
app.use(notFoundHandler);

// Global Error Handling Middleware
app.use(errorHandler);

export default app;
