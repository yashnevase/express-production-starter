/**
 * Swagger Documentation Helper
 * 
 * This file provides helper functions to add Swagger documentation to your routes.
 * Use these decorators/functions to automatically update API documentation.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - full_name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: user@example.com
 *         password:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]'
 *           description: Password must contain at least one uppercase, one lowercase, one number, and one special character
 *           example: SecurePass123!
 *         full_name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: User full name
 *           example: John Doe
 *         role_name:
 *           type: string
 *           enum: [SUPER_ADMIN, ADMIN, MANAGER, USER]
 *           description: User role (optional)
 *           example: USER
 * 
 *     VerifyOTPRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: user@example.com
 *         otp:
 *           type: string
 *           pattern: '^\d{6}$'
 *           minLength: 6
 *           maxLength: 6
 *           description: 6-digit OTP code
 *           example: 123456
 * 
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: user@example.com
 *         password:
 *           type: string
 *           description: User password
 *           example: SecurePass123!
 * 
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token
 *           example: eyJhbGciOiJIUzI1NiIs...
 * 
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: user@example.com
 * 
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *         - new_password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: user@example.com
 *         otp:
 *           type: string
 *           pattern: '^\d{6}$'
 *           minLength: 6
 *           maxLength: 6
 *           description: 6-digit OTP code
 *           example: 123456
 *         new_password:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]'
 *           description: New password must contain at least one uppercase, one lowercase, one number, and one special character
 *           example: NewSecurePass123!
 * 
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - current_password
 *         - new_password
 *       properties:
 *         current_password:
 *           type: string
 *           description: Current password
 *           example: OldSecurePass123!
 *         new_password:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]'
 *           description: New password must contain at least one uppercase, one lowercase, one number, and one special character
 *           example: NewSecurePass123!
 * 
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - full_name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: newuser@example.com
 *         password:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]'
 *           description: Password must contain at least one uppercase, one lowercase, one number, and one special character
 *           example: SecurePass123!
 *         full_name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: User full name
 *           example: Jane Doe
 *         role_name:
 *           type: string
 *           enum: [SUPER_ADMIN, ADMIN, MANAGER, USER]
 *           description: User role (optional)
 *           example: USER
 * 
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         full_name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: User full name
 *           example: John Smith
 *         role_name:
 *           type: string
 *           enum: [SUPER_ADMIN, ADMIN, MANAGER, USER]
 *           description: User role
 *           example: MANAGER
 *         is_active:
 *           type: boolean
 *           description: Account status
 *           example: true
 *         email_verified:
 *           type: boolean
 *           description: Email verification status
 *           example: true
 *         scheduled_deactivation_at:
 *           type: string
 *           format: date-time
 *           description: Schedule deactivation date
 *           example: '2026-12-31T23:59:59Z'
 *         profile_photo:
 *           type: string
 *           format: uri
 *           description: Profile photo URL
 *           example: https://example.com/photo.jpg
 * 
 *     ScheduleDeactivationRequest:
 *       type: object
 *       required:
 *         - deactivation_date
 *       properties:
 *         deactivation_date:
 *           type: string
 *           format: date-time
 *           description: Deactivation date (must be in future)
 *           example: '2026-12-31T23:59:59Z'
 * 
 *     AssignRoleRequest:
 *       type: object
 *       required:
 *         - role_name
 *       properties:
 *         role_name:
 *           type: string
 *           enum: [SUPER_ADMIN, ADMIN, MANAGER, USER]
 *           description: Role to assign
 *           example: ADMIN
 * 
 *     UserQueryParams:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: Page number
 *           example: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           description: Items per page
 *           example: 10
 *         sort:
 *           type: string
 *           enum: [user_id, email, full_name, created_at]
 *           default: created_at
 *           description: Sort field
 *           example: created_at
 *         order:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *           description: Sort order
 *           example: DESC
 *         role:
 *           type: string
 *           enum: [SUPER_ADMIN, ADMIN, MANAGER, USER]
 *           description: Filter by role
 *           example: USER
 *         is_active:
 *           type: boolean
 *           description: Filter by active status
 *           example: true
 *         email_verified:
 *           type: boolean
 *           description: Filter by email verification status
 *           example: true
 *         search:
 *           type: string
 *           description: Search in email or full name
 *           example: john
 */

module.exports = {};
