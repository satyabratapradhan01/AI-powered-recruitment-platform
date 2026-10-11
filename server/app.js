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

import mongoose from 'mongoose';
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

// Ignore favicon requests without invoking DB or error handlers
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Serve local fallback static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check Endpoints (independent of database connectivity)
const healthCheckHandler = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HireFlow AI Backend API is running',
    timestamp: new Date().toISOString(),
  });
};
app.get('/api/health', healthCheckHandler);
app.get('/health', healthCheckHandler);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HireFlow AI Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// Database Readiness Check Endpoint
app.get(['/api/readiness', '/readiness'], async (req, res) => {
  try {
    await connectDB();
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return res.status(200).json({
        status: 'success',
        message: 'Backend and Database are ready',
        database: 'connected',
        timestamp: new Date().toISOString(),
      });
    }
    return res.status(503).json({
      status: 'error',
      message: 'Database connection not ready',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Readiness check database error:', err.message);
    return res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

// Concurrency-safe admin seeding
let isSeeded = false;
let seedPromise = null;
const ensureAdminSeeded = async () => {
  if (isSeeded) return;
  if (!seedPromise) {
    seedPromise = seedAdminUser()
      .then(() => {
        isSeeded = true;
      })
      .catch((err) => {
        seedPromise = null;
        console.error('[Admin Seed] Non-fatal seeding error:', err.message);
      });
  }
  return seedPromise;
};

// Serverless DB auto-connect middleware for all application API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    await ensureAdminSeeded();
    next();
  } catch (err) {
    console.error('Serverless DB middleware connection error:', err.message);
    return res.status(500).json({
      status: 'error',
      message: 'Database service unavailable. Please check server logs and configuration.',
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
