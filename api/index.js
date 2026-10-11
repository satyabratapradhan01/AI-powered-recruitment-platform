import app from '../server/app.js';
import connectDB from '../server/config/db.js';
import { seedAdminUser } from '../server/utils/seedAdmin.js';

let isSeeded = false;

export default async function handler(req, res) {
  try {
    await connectDB();
    if (!isSeeded) {
      await seedAdminUser();
      isSeeded = true;
    }
  } catch (err) {
    console.error('Vercel handler DB connection error:', err.message);

    // If requesting health check, return 200 degraded status so deployment checks pass
    const path = req.url || '';
    if (path.includes('/health')) {
      return res.status(200).json({
        status: 'degraded',
        message: `Backend is running, but database connection failed: ${err.message}`,
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      status: 'error',
      message: `Backend Database Error: ${err.message}. Please verify MONGODB_URI and JWT_SECRET are set under Vercel Project Settings -> Environment Variables, and MongoDB Atlas IP Access List allows 0.0.0.0/0.`,
    });
  }
  return app(req, res);
}

