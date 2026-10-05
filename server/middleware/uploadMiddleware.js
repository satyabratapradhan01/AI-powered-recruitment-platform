import multer from 'multer';
import AppError from '../utils/AppError.js';

// Memory storage to process file buffers directly
const storage = multer.memoryStorage();

// File filter: accept only PDF and DOCX
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];

  const allowedExtensions = /\.(pdf|docx|doc)$/i;

  if (
    allowedMimeTypes.includes(file.mimetype) ||
    allowedExtensions.test(file.originalname)
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Invalid file type. Only PDF (.pdf) and Word (.docx, .doc) files are allowed.',
        400
      ),
      false
    );
  }
};

// 5 MB file size limit
export const uploadResumeFile = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter,
}).single('resume');

// Wrapper middleware to catch Multer file size and type errors cleanly
export const handleUploadMiddleware = (req, res, next) => {
  uploadResumeFile(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          new AppError('File size limit exceeded. Maximum allowed file size is 5 MB.', 400)
        );
      }
      return next(new AppError(`File upload error: ${err.message}`, 400));
    } else if (err) {
      return next(err);
    }

    if (!req.file) {
      return next(new AppError('Please select a resume file to upload', 400));
    }

    next();
  });
};
