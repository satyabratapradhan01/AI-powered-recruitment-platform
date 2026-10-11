import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, bucketName, isR2Configured } from '../config/r2Client.js';
import { extractResumeText } from '../utils/textExtractor.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

/**
 * Cloudflare R2 Private Resume Management & Text Extraction Service.
 */

// Helper to determine safe directory for local development fallback
const getLocalUploadDir = () => {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), 'hireflow-uploads', 'resumes');
  }
  return path.join(process.cwd(), 'uploads', 'resumes');
};

const ensureLocalUploadDir = () => {
  const dir = getLocalUploadDir();
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.warn('[Resume Storage] Could not create local fallback directory:', err.message);
  }
  return dir;
};

export const uploadResume = async (userId, file) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const sanitizedFileName = (file.originalname || 'resume.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniquePrefix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const fileKey = `resumes/${userId}/${uniquePrefix}-${sanitizedFileName}`;

  let fileUrl = '';

  // Extract raw text from resume buffer (PDF/DOCX)
  const parsedText = await extractResumeText(file.buffer, file.mimetype || file.originalname);

  // Attempt upload to Cloudflare R2 private bucket
  if (isR2Configured) {
    try {
      const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype || 'application/octet-stream',
      });

      await r2Client.send(putCommand);

      // Generate signed URL (expires in 1 hour)
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });

      fileUrl = await getSignedUrl(r2Client, getCommand, { expiresIn: 3600 });
    } catch (r2Error) {
      console.error('Cloudflare R2 Upload Error:', r2Error.message);
      if (process.env.VERCEL) {
        throw new AppError(
          `Resume upload failed: Unable to upload to Cloudflare R2 storage (${r2Error.message}). Please verify R2 credentials and bucket permissions in Vercel settings.`,
          500
        );
      }
      fileUrl = await saveLocalFallback(file, fileKey);
    }
  } else {
    if (process.env.VERCEL) {
      throw new AppError(
        'Cloudflare R2 storage is not configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in Vercel Project Settings -> Environment Variables.',
        500
      );
    }
    fileUrl = await saveLocalFallback(file, fileKey);
  }

  // Update user profile resume metadata
  user.resume = {
    fileUrl,
    fileName: file.originalname,
    fileKey,
    uploadedAt: new Date(),
    fileSize: file.size,
    mimeType: file.mimetype,
    parsedText,
  };

  await user.save();

  return {
    fileUrl: user.resume.fileUrl,
    signedUrl: user.resume.fileUrl,
    fileName: user.resume.fileName,
    fileKey: user.resume.fileKey,
    uploadedAt: user.resume.uploadedAt,
    fileSize: user.resume.fileSize,
    mimeType: user.resume.mimeType,
    parsedTextPreview: parsedText.substring(0, 200),
    parsedTextLength: parsedText.length,
    resume: user.resume,
  };
};

export const getResumeViewUrl = async (targetUserId, currentUser) => {
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    throw new AppError('User not found', 404);
  }

  if (!targetUser.resume || !targetUser.resume.fileKey) {
    throw new AppError('No resume uploaded for this candidate', 404);
  }

  // Authorization check: User viewing own resume, or HR / Admin viewing candidate
  const isOwner = currentUser._id.toString() === targetUserId.toString();
  const isAuthorizedRole = currentUser.role === 'hr' || currentUser.role === 'admin';

  if (!isOwner && !isAuthorizedRole) {
    throw new AppError('Forbidden: You do not have permission to view this resume', 403);
  }

  let signedUrl = targetUser.resume.fileUrl;

  // Generate fresh signed URL if using Cloudflare R2
  if (isR2Configured && targetUser.resume.fileKey.startsWith('resumes/')) {
    try {
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: targetUser.resume.fileKey,
      });

      signedUrl = await getSignedUrl(r2Client, getCommand, { expiresIn: 3600 });
      targetUser.resume.fileUrl = signedUrl;
      await targetUser.save();
    } catch (r2Err) {
      console.warn('Failed to refresh R2 signed URL, using existing fileUrl:', r2Err.message);
    }
  }

  return {
    fileName: targetUser.resume.fileName,
    fileUrl: signedUrl,
    signedUrl: signedUrl,
    uploadedAt: targetUser.resume.uploadedAt,
    fileSize: targetUser.resume.fileSize,
    mimeType: targetUser.resume.mimeType,
    parsedText: targetUser.resume.parsedText,
    resume: targetUser.resume,
  };
};

export const deleteResume = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.resume || !user.resume.fileKey) {
    throw new AppError('No resume found to delete', 404);
  }

  const fileKey = user.resume.fileKey;

  if (isR2Configured && fileKey.startsWith('resumes/')) {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });

      await r2Client.send(deleteCommand);
    } catch (err) {
      console.warn('Failed to delete object from Cloudflare R2:', err.message);
    }
  }

  // Delete local fallback file if exists
  try {
    const dir = getLocalUploadDir();
    const localFilePath = path.join(dir, path.basename(fileKey));
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  } catch (_) {}

  user.resume = {
    fileUrl: '',
    fileName: '',
    fileKey: '',
    uploadedAt: null,
    fileSize: 0,
    mimeType: '',
    parsedText: '',
  };

  await user.save();
  return { message: 'Resume deleted successfully' };
};

const saveLocalFallback = async (file, fileKey) => {
  const dir = ensureLocalUploadDir();
  const safeFilename = path.basename(fileKey);
  const targetPath = path.join(dir, safeFilename);
  await fs.promises.writeFile(targetPath, file.buffer);
  return `/uploads/resumes/${safeFilename}`;
};
