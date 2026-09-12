import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import ApiError from '../utils/ApiError.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage (we'll stream to Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only image files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 6, // Max 6 photos per room
  },
});

/**
 * Upload a buffer to Cloudinary and return the secure URL
 */
export const uploadToCloudinary = (fileBuffer, folder = 'roomnear') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(new ApiError(500, 'Image upload failed'));
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

export default cloudinary;
