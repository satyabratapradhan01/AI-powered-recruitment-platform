import app from '../server/app.js';
import connectDB from '../server/config/db.js';
import { seedAdminUser } from '../server/utils/seedAdmin.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    await seedAdminUser();
  } catch (err) {
    console.error('Vercel handler DB connection error:', err.message);
  }
  return app(req, res);
}
