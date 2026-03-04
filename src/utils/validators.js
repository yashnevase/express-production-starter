const Joi = require('joi');

const customValidators = {
  phone: Joi.string().pattern(/^[0-9]{10}$/).messages({
    'string.pattern.base': 'Phone number must be 10 digits'
  }),
  
  strongPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .messages({
      'string.alphanum': 'Username must only contain alphanumeric characters'
    }),
  
  url: Joi.string().uri().messages({
    'string.uri': 'Must be a valid URL'
  }),
  
  objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid ID format'
  }),
  
  date: Joi.date().iso().messages({
    'date.format': 'Date must be in ISO format'
  }),
  
  futureDate: Joi.date().greater('now').messages({
    'date.greater': 'Date must be in the future'
  }),
  
  pastDate: Joi.date().less('now').messages({
    'date.less': 'Date must be in the past'
  })
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
};

module.exports = {
  customValidators,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  sanitizeFilename
};
