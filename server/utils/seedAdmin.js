import bcrypt from 'bcryptjs';
import User from '../models/User.js';

/**
 * Ensures an admin user exists in the database using ADMIN_EMAIL and ADMIN_PASSWORD from .env
 */
export const seedAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@platform.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    if (!adminEmail || !adminPassword) {
      return;
    }

    let admin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      admin = await User.create({
        name: 'Platform Admin',
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
        accountStatus: 'active',
      });
      console.log(`[Admin Seed] Default admin created: ${admin.email}`);
    } else {
      let isModified = false;

      if (admin.role !== 'admin') {
        admin.role = 'admin';
        isModified = true;
      }

      if (admin.accountStatus !== 'active') {
        admin.accountStatus = 'active';
        isModified = true;
      }

      // Check if current stored password matches the env password
      const isMatch = await bcrypt.compare(adminPassword, admin.password);
      if (!isMatch) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(adminPassword, salt);
        isModified = true;
      }

      if (isModified) {
        await admin.save();
        console.log(`[Admin Seed] Admin user synchronized with .env credentials: ${admin.email}`);
      }
    }
  } catch (error) {
    console.error('[Admin Seed Error] Failed to seed admin user:', error.message);
  }
};
