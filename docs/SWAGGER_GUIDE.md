# Swagger API Documentation Guide

Complete guide for using and understanding Swagger/OpenAPI documentation in the Express Production Starter.

---

## 📋 Table of Contents
1. [What is Swagger?](#what-is-swagger)
2. [Accessing Swagger UI](#accessing-swagger-ui)
3. [How to Use Swagger](#how-to-use-swagger)
4. [Adding API Documentation](#adding-api-documentation)
5. [Authentication in Swagger](#authentication-in-swagger)
6. [Best Practices](#best-practices)

---

## 🎯 What is Swagger?

Swagger is an **interactive API documentation** tool that:
- **Auto-generates documentation** from your code comments
- **Provides a UI** to test your APIs directly
- **Shows request/response schemas**
- **Handles authentication** (JWT, API keys)
- **Exports API specs** (OpenAPI 3.0)

**Benefits:**
- ✅ No need to write separate API docs
- ✅ Frontend developers can test APIs easily
- ✅ Self-documenting code
- ✅ Industry standard for API documentation

---

## 🌐 Accessing Swagger UI

### **Start Your Server**
```bash
npm run dev
```

### **Open Swagger UI**
```
http://localhost:3001/api-docs
```

### **What You'll See**
1. **API Title & Version**
2. **Authentication button** (for JWT)
3. **Endpoint list** grouped by routes
4. **Expandable endpoints** with details
5. **"Try it out"** button for testing

---

## 🚀 How to Use Swagger

### **1. Browse Endpoints**
- Click on any endpoint group (e.g., `/auth`)
- Click on specific endpoint (e.g., `POST /auth/login`)
- See full details: description, parameters, responses

### **2. Test an Endpoint (No Auth Required)**
1. Click **"Try it out"** button
2. Fill in the request body (if needed)
3. Click **"Execute"**
4. See the response below

### **3. Test an Endpoint (With Auth)**
1. First, authenticate:
   - Go to `POST /auth/login`
   - Enter credentials
   - Copy the JWT token from response
2. Click **"Authorize"** button (top right)
3. Enter: `Bearer YOUR_JWT_TOKEN`
4. Click **"Authorize"**
5. Now test protected endpoints

### **4. Example: Testing User Registration**
```json
// Request body
{
  "email": "test@example.com",
  "password": "password123",
  "full_name": "Test User"
}
```

### **5. Example: Testing Protected Route**
```bash
// After login, you get:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// Use this token in Authorize button:
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Adding API Documentation

### **1. Route Documentation (JSDoc)**

Add JSDoc comments above your route definitions:

```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a paginated list of users (requires users.view permission)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by name or email
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/',
  authenticateToken,
  requirePermission('users.view'),
  asyncHandler(async (req, res) => {
    // Your route code
  })
);
```

### **2. Model Documentation**

Add JSDoc to your model files:

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           description: Unique user identifier
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: user@example.com
 *         full_name:
 *           type: string
 *           description: User's full name
 *           example: John Doe
 *         role:
 *           type: string
 *           enum: [SUPER_ADMIN, ADMIN, MANAGER, USER]
 *           description: User role
 *           example: USER
 *         is_active:
 *           type: boolean
 *           description: Whether the user account is active
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *           example: "2024-01-01T00:00:00.000Z"
 */
```

### **3. Common Response Schemas**

The library already includes common schemas:
- `User` - User model
- `Error` - Error response
- `ValidationError` - Validation errors
- `PaginatedResponse` - Paginated data

### **4. Common Responses**

Predefined responses:
- `UnauthorizedError` - 401
- `ForbiddenError` - 403
- `NotFoundError` - 404
- `ValidationError` - 400

---

## 🔐 Authentication in Swagger

### **JWT Authentication**

1. **Get Your Token**
   ```bash
   # Login via API
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"password123"}'
   
   # Response contains token
   {
     "success": true,
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
   }
   ```

2. **Add to Swagger**
   - Click **"Authorize"** button
   - In the popup, enter: `Bearer YOUR_JWT_TOKEN`
   - Click **"Authorize"**
   - Close the popup

3. **Test Protected Routes**
   - Now you can test routes that require authentication
   - The token is automatically included in requests

### **API Key Authentication (Future)**

If you add API key authentication:
```javascript
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     apiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-KEY
 */
```

---

## ✅ Best Practices

### **1. Always Document**
- Every endpoint should have JSDoc comments
- Include all parameters and responses
- Use examples for clarity

### **2. Group Related Endpoints**
- Use `tags` to group endpoints
- Common tags: `Authentication`, `Users`, `Products`

### **3. Use References**
- Use `$ref` for common schemas
- Avoid duplicating schema definitions
- Reference common responses

### **4. Provide Examples**
- Add example values for all fields
- Show complete request/response examples
- Include edge cases

### **5. Security First**
- Always mark authenticated endpoints
- Specify required permissions
- Document rate limits

### **6. Keep It Updated**
- Update docs when changing endpoints
- Run Swagger to check for errors
- Ensure examples match actual responses

---

## 🎯 Quick Reference

### **Common JSDoc Tags**
```javascript
/**
 * @swagger
 * /api/endpoint:
 *   get/post/put/delete:
 *     summary: Brief description
 *     description: Detailed description
 *     tags: [GroupName]
 *     security: [] // or bearerAuth: []
 *     parameters: [] // Query, path, header params
 *     requestBody: {} // For POST/PUT
 *     responses: {} // All possible responses
 */
```

### **Parameter Types**
- `query` - URL query parameters
- `path` - URL path parameters (e.g., /users/:id)
- `header` - HTTP headers
- `cookie` - Cookies

### **Response Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🔍 Troubleshooting

### **Swagger Not Loading**
1. Check if `ENABLE_SWAGGER` is `true` in `.env`
2. Ensure server is running
3. Check console for errors

### **Authentication Not Working**
1. Ensure token is valid and not expired
2. Check token format: `Bearer TOKEN`
3. Verify token has required permissions

### **Docs Not Updating**
1. Restart the server after changing JSDoc
2. Check for syntax errors in JSDoc
3. Verify file paths in swagger config

---

## 📚 Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [JSDoc Guide](https://jsdoc.app/)

---

**Happy documenting! 📖**
