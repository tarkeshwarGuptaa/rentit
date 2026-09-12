import ApiError from '../utils/ApiError.js';

/**
 * Middleware factory that validates req.body against a Joi schema.
 * @param {import('joi').ObjectSchema} schema - Joi schema to validate against
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      throw new ApiError(400, 'Validation failed', messages);
    }

    // Replace body with validated + sanitized value
    req.body = value;
    next();
  };
};

export default validate;
