# 📘 Swagger Documentation Guide

## 🚀 Auto-Updating API Documentation

Your Express production starter comes with **auto-updating Swagger documentation**. When you make changes to your APIs (parameters, responses, endpoints), Swagger automatically updates!

## 📍 Access Swagger UI

```bash
# Start your server
npm run dev

# Open in browser
http://localhost:3001/api-docs
```

## 🔄 How Auto-Update Works

### 1. **File Watching**
Swagger watches these files for changes:
```javascript
// src/config/swagger.js
apis: [
  './src/routes/*.js',                    // Main routes
  './src/modules/*/routes/*.js',          // Module routes (auth, user, admin)
  './src/modules/*/controllers/*.js',     // Controllers
  './src/modules/*/validators/*.js',      // Input validation schemas
  './src/models/*.js'                     // Database models
]
```

### 2. **Hot Reload**
When you change any of these files:
- **No restart needed!** Swagger automatically detects changes
- **Live update** in browser (refresh to see changes)
- **Real-time validation** of your API documentation

## 📝 Adding/Updating API Documentation

### Method 1: JSDoc Comments (Recommended)

Add comments directly above your routes:

```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get('/', authenticateToken, requirePermission('users.view'), userController.getAll);
```

### Method 2: Using Pre-defined Schemas

Reference existing schemas to avoid duplication:

```javascript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
```

## 🎯 Quick Examples

### 1. Adding a New Endpoint

```javascript
// src/modules/user/routes/index.js

/**
 * @swagger
 * /api/users/{id}/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/:id/profile', getUserProfile);
```

### 2. Adding a New Schema

```javascript
// src/config/swagger.js - in components.schemas

UserProfile: {
  type: 'object',
  properties: {
    bio: {
      type: 'string',
      description: 'User biography',
      example: 'Software developer with 5 years experience'
    },
    website: {
      type: 'string',
      format: 'uri',
      description: 'Personal website',
      example: 'https://johndoe.dev'
    },
    social_links: {
      type: 'object',
      properties: {
        github: {
          type: 'string',
          example: 'https://github.com/johndoe'
        },
        linkedin: {
          type: 'string',
          example: 'https://linkedin.com/in/johndoe'
        }
      }
    }
  }
}
```

### 3. Adding Query Parameters

```javascript
/**
 * @swagger
 * parameters:
 *   SearchQuery:
 *     in: query
 *     name: search
 *     schema:
 *       type: string
 *     description: Search term
 *     example: john
 *   RoleFilter:
 *     in: query
 *     name: role
 *     schema:
 *       type: string
 *       enum: [SUPER_ADMIN, ADMIN, MANAGER, USER]
 *     description: Filter by role
 *     example: USER
 */
```

## 🏷️ Best Practices

### 1. **Use References**
```javascript
// Good - Reuse existing schemas
schema:
  $ref: '#/components/schemas/User'

// Bad - Duplicate schema
schema:
  type: object
  properties:
    user_id: { type: integer }
    email: { type: string }
    // ... duplicate properties
```

### 2. **Group Related Endpoints**
```javascript
/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication operations
 *   - name: Users
 *     description: User management operations
 */
```

### 3. **Document All Responses**
```javascript
/**
 * @swagger
 * responses:
 *   200:
 *     description: Success
 *   201:
 *     description: Created successfully
 *   400:
 *     $ref: '#/components/responses/ValidationError'
 *   401:
 *     $ref: '#/components/responses/UnauthorizedError'
 *   403:
 *     $ref: '#/components/responses/ForbiddenError'
 *   404:
 *     $ref: '#/components/responses/NotFoundError'
 */
```

### 4. **Use Examples**
```javascript
/**
 * @swagger
 * examples:
 *   UserExample:
 *     value:
 *       email: user@example.com
 *       full_name: John Doe
 *       role: USER
 */
```

## 🔧 Configuration Options

### Enable/Disable Swagger
```env
# .env
ENABLE_SWAGGER=true    # Enable Swagger UI
ENABLE_SWAGGER=false   # Disable Swagger UI
```

### Custom Server URLs
```javascript
// src/config/swagger.js
servers: [
  {
    url: 'http://localhost:3001',
    description: 'Development server'
  },
  {
    url: 'https://api.yourcompany.com',
    description: 'Production server'
  },
  {
    url: 'https://staging-api.yourcompany.com',
    description: 'Staging server'
  }
]
```

### Custom UI Options
```javascript
// src/config/swagger.js
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'My API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,  // Keep auth token across reloads
    displayRequestDuration: true, // Show request duration
    filter: true,                 // Enable search/filter
    showExtensions: true,
    showCommonExtensions: true
  }
};
```

## 📊 Available Schemas

### Authentication
- `RegisterRequest`
- `VerifyOTPRequest`
- `LoginRequest`
- `RefreshTokenRequest`
- `ForgotPasswordRequest`
- `ResetPasswordRequest`
- `ChangePasswordRequest`
- `AuthResponse`
- `OTPResponse`

### Users
- `User`
- `CreateUserRequest`
- `UpdateUserRequest`
- `ScheduleDeactivationRequest`
- `AssignRoleRequest`
- `UserQueryParams`

### Common
- `Role`
- `Permission`
- `Error`
- `ValidationError`
- `PaginatedResponse`
- `UnauthorizedError`
- `ForbiddenError`
- `NotFoundError`

## 🚀 Advanced Features

### 1. **Conditional Documentation**
```javascript
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *       403:
 *         description: Admin access required
 */
```

### 2. **File Upload Documentation**
```javascript
/**
 * @swagger
 * /api/users/{id}/photo:
 *   post:
 *     summary: Upload user photo
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 */
```

### 3. **Array Responses**
```javascript
/**
 * @swagger
 * responses:
 *   UsersArray:
 *     description: List of users
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 */
```

## 🔄 Auto-Update in Action

### When You Change:
1. **Add new endpoint** → Appears in Swagger immediately
2. **Change parameter** → Updates automatically
3. **Modify response** → New schema reflected
4. **Add validation** → Shows in request body
5. **Update model** → Schema updates

### No Need To:
- ❌ Restart server
- ❌ Re-run any commands
- ❌ Update separate documentation files
- ❌ Manually sync anything

### Just:
- ✅ Add/modify JSDoc comments
- ✅ Refresh browser
- ✅ See updated documentation

## 📱 Testing APIs with Swagger

### 1. **Authenticate**
```bash
1. Go to /api-docs
2. Click "Authorize" button
3. Enter: Bearer <your-jwt-token>
4. Click "Authorize"
```

### 2. **Test Endpoints**
```bash
1. Expand any endpoint
2. Click "Try it out"
3. Fill in parameters
4. Click "Execute"
5. See response
```

### 3. **Download Examples**
```bash
1. Test /api/users/export/excel
2. Click "Download file"
3. Get Excel file
```

## 🎉 Summary

Your Swagger documentation:
- ✅ **Auto-updates** when you change APIs
- ✅ **No restart required**
- ✅ **Live validation** of API contracts
- ✅ **Interactive testing** in browser
- ✅ **Comprehensive schemas** for all models
- ✅ **Examples** for all endpoints
- ✅ **Security documentation** with auth

**Just add JSDoc comments and Swagger does the rest!** 🚀
