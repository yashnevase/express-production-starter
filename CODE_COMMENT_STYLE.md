# 📝 Code Comment Style Guide

## 🎯 Decision: Simple Comments over JSDoc

We've decided to use simple JavaScript comments instead of JSDoc/Swagger documentation in route files. API documentation will be maintained in the Postman collection.

## 📋 Comment Style

### 1. Module Header
```javascript
// Admin Module Routes
// Base path: /api/admin
// All routes require authentication and appropriate permissions
```

### 2. Route Comments
```javascript
// Get all roles with pagination and filters
// Query params: page, limit, is_active, search
// Permission required: roles.view
router.get('/roles', ...);
```

### 3. Complex Route Details
```javascript
// Delete role by ID
// URL param: id (role ID)
// Permission required: roles.delete
// Note: Cannot delete roles with assigned users
router.delete('/roles/:id', ...);
```

## ✅ Benefits

1. **Clean Code** - Less verbose than JSDoc
2. **Easy to Read** - Simple, straightforward comments
3. **Postman Focus** - API docs in Postman collection
4. **Faster Development** - No need to maintain JSDoc
5. **Better Maintenance** - Comments stay in sync with code

## 📁 Files Updated

### Admin Routes (`src/modules/admin/routes/index.js`)
- ✅ Simple comments for all 10 endpoints
- ✅ Clear parameter descriptions
- ✅ Permission requirements noted

### Approval Routes (`src/modules/approval/routes/index.js`)
- ✅ Simple comments for all 6 endpoints
- ✅ Query parameter documentation
- ✅ Permission requirements noted

### Auth Routes (`src/modules/auth/routes/index.js`)
- ⚠️ Still has JSDoc (can update if needed)
- Decision: Keep as is or update to simple comments

## 🔄 How to Update Existing Routes

### From JSDoc to Simple Comments:

**Before (JSDoc):**
```javascript
/**
 * @swagger
 * /api/admin/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Admin - Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters: [...]
 *     responses: [...]
 */
router.get('/roles', ...);
```

**After (Simple Comments):**
```javascript
// Get all roles with pagination and filters
// Query params: page, limit, is_active, search
// Permission required: roles.view
router.get('/roles', ...);
```

## 📝 Comment Template

```javascript
// [Action] [Resource] [Additional Info]
// [Parameter Type]: [param1] (description), [param2] (description)
// Permission required: [permission.key]
// [Additional notes if needed]
router.[method]('/path', ...);
```

### Examples:

```javascript
// Get user by ID
// URL param: id (user ID)
// Permission required: users.view
router.get('/users/:id', ...);

// Create new user
// Body: email (required), first_name, last_name, role_id
// Permission required: users.create
router.post('/users', ...);

// Export users to Excel
// Query params: role, is_active, search
// Permission required: users.export
// Note: Returns downloadable file
router.get('/users/export/excel', ...);
```

## 🎯 Best Practices

1. **Keep it Short** - 1-3 lines per route
2. **Be Specific** - Mention required parameters
3. **Note Permissions** - Always list required permission
4. **Add Warnings** - Special notes (e.g., "Cannot delete if...")
5. **Stay Consistent** - Use same format across all routes

## 🚀 Implementation

### To update a route file:

1. Remove JSDoc blocks (`/** ... */`)
2. Add simple comment above each route
3. Include:
   - What the route does
   - Parameters (URL/query/body)
   - Required permission
   - Any special notes

### Example Full Module:

```javascript
const express = require('express');
const router = express.Router();
// ... imports

// Module Header
// Base path: /api/module
// Description of module

// Route 1
// Description
// Parameters
// Permission
router.get('/route1', ...);

// Route 2
// Description
// Parameters
// Permission
router.post('/route2', ...);

module.exports = router;
```

## 📮 Remember

- **Postman Collection** = API Documentation
- **Code Comments** = Developer Guidance
- **Keep it Simple** = Easy Maintenance

This approach keeps code clean while maintaining clear documentation! 🎉
