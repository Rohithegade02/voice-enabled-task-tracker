import multer from 'multer';
import { Request } from 'express';
import { AppError } from './errorHandler';

// Configure multer for memory storage (store file in memory as Buffer)
const storage = multer.memoryStorage();

// File filter - only accept audio files
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept audio files
  const allowedMimeTypes = [
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/mpeg',
    'audio/mp3',
    'audio/webm',
    'audio/ogg',
    'audio/flac',
    'audio/x-m4a',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, 'Invalid file type. Only audio files are allowed.'));
  }
};

// Configure upload
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});