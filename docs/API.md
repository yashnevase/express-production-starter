# API Documentation

Complete API reference for the Express Production Starter backend.

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
```

**Validation:**
- `email`: Valid email format
- `password`: Minimum 8 characters, must contain uppercase, lowercase, number, and special character
- `full_name`: 2-100 characters

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "USER",
      "is_active": true,
      "email_verified": false,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Errors:**
- `409 Conflict`: Email already registered
- `400 Bad Request`: Validation failed

---

### Login

**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Rate Limit:** 10 requests per 15 minutes per email

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "USER",
      "last_login_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Errors:**
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account inactive
- `429 Too Many Requests`: Rate limit exceeded

---

### Forgot Password

**POST** `/auth/forgot-password`

Request password reset token.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "If email exists, reset link has been sent",
  "data": {
    "message": "If email exists, reset link has been sent"
  }
}
```

**Note:** Response is same whether email exists or not (security best practice).

---

### Reset Password

**POST** `/auth/reset-password`

Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "new_password": "NewSecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": "Password reset successful"
  }
}
```

**Errors:**
- `400 Bad Request`: Invalid or expired token

---

## User Endpoints

### Get All Users

**GET** `/users`

Retrieve paginated list of users.

**Authentication:** Required  
**Permission:** `users.view`

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10, max: 100): Items per page
- `sort` (string, default: 'created_at'): Sort field
- `order` (string, default: 'DESC'): Sort order (ASC/DESC)
- `role` (string): Filter by role
- `is_active` (boolean): Filter by active status
- `search` (string): Search in email and full_name

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "user_id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "USER",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Get User by ID

**GET** `/users/:id`

Retrieve specific user details.

**Authentication:** Required  
**Permission:** `users.view`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user_id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "USER",
    "is_active": true,
    "email_verified": false,
    "last_login_at": "2024-01-01T00:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `404 Not Found`: User not found

---

### Update User

**PUT** `/users/:id`

Update user information.

**Authentication:** Required  
**Permission:** `users.update`  
**Audit:** Logged

**Request Body:**
```json
{
  "full_name": "Jane Doe",
  "role": "ADMIN",
  "is_active": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user_id": 1,
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "role": "ADMIN",
    "is_active": true,
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Delete User

**DELETE** `/users/:id`

Delete a user.

**Authentication:** Required  
**Permission:** `users.delete`  
**Audit:** Logged

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Health Check

### System Health

**GET** `/health`

Check system status and metrics.

**Authentication:** Not required

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "cache": {
    "hits": 150,
    "misses": 50,
    "sets": 100,
    "deletes": 10,
    "hitRate": "75.00%",
    "size": 45
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "correlationId": "uuid-v4-correlation-id"
}
```

### Validation Errors

```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email",
      "type": "string.email"
    }
  ],
  "correlationId": "uuid-v4-correlation-id"
}
```

### HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Rate Limits

- **Global API**: 200 requests per minute per IP
- **Login**: 10 requests per 15 minutes per email
- **Upload**: 50 requests per hour per user

Rate limit headers:
```
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 195
X-RateLimit-Reset: 1640000000
```

---

## Common Headers

### Request Headers
```
Content-Type: application/json
Authorization: Bearer <token>
X-Correlation-ID: <optional-uuid>
```

### Response Headers
```
X-Correlation-ID: <uuid>
X-Response-Time: <milliseconds>ms
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sort`: Sort field
- `order`: ASC or DESC

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Examples

### cURL Examples

**Register:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!","full_name":"John Doe"}'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'
```

**Get Users:**
```bash
curl http://localhost:3001/api/users?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### JavaScript/Fetch Examples

```javascript
// Register
const response = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    full_name: 'John Doe'
  })
});
const data = await response.json();

// Login and store token
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!'
  })
});
const { data: { token } } = await loginResponse.json();
localStorage.setItem('token', token);

// Authenticated request
const usersResponse = await fetch('http://localhost:3001/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const users = await usersResponse.json();
```

---

For more examples and integration guides, see the [main documentation](../README.md).
