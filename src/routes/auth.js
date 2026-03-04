const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');
const { validateBody } = require('../middleware/validate');
const { loginRateLimiter } = require('../config/rateLimiters');
const { asyncHandler } = require('../middleware/errorHandler');
const { customValidators } = require('../utils/validators');

const registerSchema = Joi.object({
  email: customValidators.email,
  password: customValidators.strongPassword,
  full_name: Joi.string().min(2).max(100).required()
});

const loginSchema = Joi.object({
  email: customValidators.email,
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: customValidators.email
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  new_password: customValidators.strongPassword
});

router.post('/register',
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    return ApiResponse.created(res, result, 'Registration successful');
  })
);

router.post('/login',
  loginRateLimiter,
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return ApiResponse.success(res, result, 'Login successful');
  })
);

router.post('/forgot-password',
  validateBody(forgotPasswordSchema),
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return ApiResponse.success(res, result);
  })
);

router.post('/reset-password',
  validateBody(resetPasswordSchema),
  asyncHandler(async (req, res) => {
    const { token, new_password } = req.body;
    const result = await authService.resetPassword(token, new_password);
    return ApiResponse.success(res, result);
  })
);

module.exports = router;
