import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new ApiError(400, 'Invalid resource ID format');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(409, `An account with this ${field} already exists`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(400, 'Validation failed', messages);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token. Please log in again');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired. Please log in again');
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ApiError(400, 'File too large. Maximum size is 5MB');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;
