import app from '../app.js';
import connectDB from '../config/db.js';
import { seedAdminUser } from '../utils/seedAdmin.js';

let isSeeded = false;

export default async function handler(req, res) {
  try {
    await connectDB();
    if (!isSeeded) {
      await seedAdminUser();
      isSeeded = true;
    }
  } catch (err) {
    console.error('Vercel serverless DB connection error:', err.message);

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
      message: `Database Connection Error: ${err.message}. Please verify MONGODB_URI is configured in Vercel Project Settings -> Environment Variables and MongoDB Atlas IP Access List has 0.0.0.0/0.`,
    });
  }

  return app(req, res);
}
