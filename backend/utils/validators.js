import Joi from 'joi';

// Indian phone: starts with 6-9, followed by 9 digits
const phonePattern = /^[6-9]\d{9}$/;

// ─── Auth Schemas ────────────────────────────────────────────────

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
    }),
  email: Joi.string().trim().lowercase().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
  password: Joi.string().min(6).max(128).required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
    }),
  phone: Joi.string().pattern(phonePattern).required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone must be a valid 10-digit Indian mobile number (starts with 6-9)',
    }),
  role: Joi.string().valid('student', 'landlord').required()
    .messages({
      'any.only': 'Role must be either student or landlord',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required',
    }),
});

// ─── Room Schemas ────────────────────────────────────────────────

export const createRoomSchema = Joi.object({
  title: Joi.string().trim().min(5).max(100).required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 5 characters',
    }),
  description: Joi.string().trim().min(20).max(2000).required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 20 characters',
    }),
  rent: Joi.number().min(500).max(100000).required()
    .messages({
      'number.base': 'Rent must be a number',
      'number.min': 'Rent must be at least ₹500',
      'number.max': 'Rent cannot exceed ₹1,00,000',
    }),
  address: Joi.string().trim().min(10).max(200).required()
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least 10 characters',
    }),
  area: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.empty': 'Area/locality is required',
    }),
  roomType: Joi.string().valid('single', 'shared', '1BHK', '2BHK').required()
    .messages({
      'any.only': 'Room type must be single, shared, 1BHK, or 2BHK',
    }),
  amenities: Joi.array().items(
    Joi.string().valid('WiFi', 'AC', 'Food', 'Parking', 'Laundry', 'Geyser', 'Attached Bathroom')
  ).default([]),
  photos: Joi.array().items(Joi.string().uri()).max(6).default([]),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }).required()
    .messages({
      'object.base': 'Location with lat/lng is required',
    }),
});

export const updateRoomSchema = Joi.object({
  title: Joi.string().trim().min(5).max(100),
  description: Joi.string().trim().min(20).max(2000),
  rent: Joi.number().min(500).max(100000),
  address: Joi.string().trim().min(10).max(200),
  area: Joi.string().trim().min(2).max(50),
  roomType: Joi.string().valid('single', 'shared', '1BHK', '2BHK'),
  amenities: Joi.array().items(
    Joi.string().valid('WiFi', 'AC', 'Food', 'Parking', 'Laundry', 'Geyser', 'Attached Bathroom')
  ),
  photos: Joi.array().items(Joi.string().uri()).max(6),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided to update',
});

// ─── User Profile Schema ────────────────────────────────────────

export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  phone: Joi.string().pattern(phonePattern)
    .messages({
      'string.pattern.base': 'Phone must be a valid 10-digit Indian mobile number (starts with 6-9)',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided to update',
});
