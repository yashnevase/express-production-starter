const express = require('express');
const router = express.Router();
const authController = require('../controllers');
const { validateBody } = require('../../../middleware/validate');
const { authenticateToken } = require('../../../middleware/auth');
const { loginRateLimiter } = require('../../../config/rateLimiters');
const authValidators = require('../validators/authValidators');

// Authentication Module Routes
// Base path: /api/auth
// Public routes (no authentication required unless specified)

// Register a new user
// Body: email, password, first_name, last_name, role_id (optional)
// Returns: OTP sent to email (or OTP in response if SMTP disabled)
router.post('/register',
  validateBody(authValidators.registerSchema),
  authController.register
);

// Verify email with OTP
// Body: email, otp
// Returns: Access token and refresh token
router.post('/verify-otp',
  validateBody(authValidators.verifyOTPSchema),
  authController.verifyOTP
);

// Resend OTP to email
// Body: email
// Returns: New OTP sent to email
router.post('/resend-otp',
  validateBody(authValidators.resendOTPSchema),
  authController.resendOTP
);

// User login
// Body: email, password
// Returns: Access token and refresh token
// Rate limited: Max 5 attempts per 15 minutes
router.post('/login',
  loginRateLimiter,
  validateBody(authValidators.loginSchema),
  authController.login
);

// Refresh access token
// Body: refreshToken
// Returns: New access token and new refresh token (token rotation)
router.post('/refresh',
  validateBody(authValidators.refreshTokenSchema),
  authController.refreshToken
);

// User logout
// Body: refreshToken
// Invalidates the refresh token
router.post('/logout',
  validateBody(authValidators.refreshTokenSchema),
  authController.logout
);

// Request password reset
// Body: email
// Returns: OTP sent to email for password reset
router.post('/forgot-password',
  validateBody(authValidators.forgotPasswordSchema),
  authController.forgotPassword
);

// Reset password with OTP
// Body: email, otp, new_password
// Returns: Success message
router.post('/reset-password',
  validateBody(authValidators.resetPasswordSchema),
  authController.resetPassword
);

// Change password (authenticated users)
// Body: current_password, new_password
// Requires: Valid access token
router.post('/change-password',
  authenticateToken,
  validateBody(authValidators.changePasswordSchema),
  authController.changePassword
);

module.exports = router;
