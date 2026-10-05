import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const accountId = process.env.R2_ACCOUNT_ID || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
const endpoint =
  process.env.R2_ENDPOINT ||
  (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '');

export const bucketName = process.env.R2_BUCKET_NAME || 'resume-storage';

export const isR2Configured = Boolean(
  endpoint && accessKeyId && secretAccessKey && process.env.R2_BUCKET_NAME
);

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: endpoint || 'https://placeholder.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: accessKeyId || 'placeholder_access_key',
    secretAccessKey: secretAccessKey || 'placeholder_secret_key',
  },
});
