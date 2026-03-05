# Quick Start Guide - Express Production Starter

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm 8+

## Installation

### 1. Clone and Install
```bash
git clone <repository-url>
cd express-production-starter
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secrets (generate strong secrets)
JWT_SECRET=your-secret-key-minimum-32-characters-long
REFRESH_TOKEN_SECRET=your-refresh-token-secret-minimum-32-characters

# Development Mode (OTP in response, no email needed)
ENABLE_SMTP=false

# Production Mode (OTP via email)
ENABLE_SMTP=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 3. Setup Database
```bash
# Run migrations
npm run migrate

# Run seeders (creates roles, permissions, default admin)
npm run seed
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## Default Admin Account
- **Email**: admin@example.com
- **Password**: Admin@123
- **⚠️ Change this password immediately after first login!**

## API Testing

### 1. Register New User
```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
```

**Response (SMTP disabled)**:
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email with the OTP sent.",
  "data": {
    "userId": 2,
    "email": "user@example.com",
    "otp": "123456",
    "devMode": true
  }
}
```

### 2. Verify OTP
```bash
POST http://localhost:3001/api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "user_id": 2,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": 4,
      "is_active": true,
      "email_verified": true
    }
  }
}
```

### 3. Login
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### 4. Access Protected Route
```bash
GET http://localhost:3001/api/users
Authorization: Bearer <accessToken>
```

### 5. Refresh Token
```bash
POST http://localhost:3001/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refreshToken>"
}
```

## Available Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /verify-otp` - Verify email with OTP
- `POST /resend-otp` - Resend OTP
- `POST /login` - Login
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with OTP
- `POST /change-password` - Change password (authenticated)

### Users (`/api/users`)
- `GET /` - List users (requires: users.view)
- `GET /:id` - Get user details (requires: users.view)
- `POST /` - Create user (requires: users.create)
- `PUT /:id` - Update user (requires: users.update)
- `DELETE /:id` - Delete user (requires: users.delete)
- `PATCH /:id/activate` - Activate user (requires: users.activate)
- `PATCH /:id/deactivate` - Deactivate user (requires: users.deactivate)
- `PATCH /:id/schedule-deactivation` - Schedule deactivation (requires: users.schedule_deactivation)
- `PATCH /:id/assign-role` - Assign role (requires: roles.assign)
- `GET /export/excel` - Export to Excel (requires: users.export)
- `GET /export/pdf` - Export to PDF (requires: users.export)

### Health Check
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system health

### API Documentation
- `GET /api-docs` - Swagger documentation (if enabled)

## Features Overview

### 1. OTP-Based Authentication
- Email verification with 6-digit OTP
- 5-minute expiry, max 5 attempts
- Development mode returns OTP in response
- Production mode sends OTP via email

### 2. Refresh Token System
- Access tokens: 59 minutes
- Refresh tokens: 7 days
- Automatic token rotation
- Revocation support

### 3. Dynamic RBAC
- Roles stored in database
- Permissions assigned to roles
- 4 system roles: SUPER_ADMIN, ADMIN, MANAGER, USER
- 29 permissions across 9 modules

### 4. User Management
- Full CRUD operations
- Soft delete (data retention)
- Activate/deactivate users
- Schedule automatic deactivation
- Role assignment
- Excel/PDF export

### 5. Action Logging
- Logs all API requests
- Captures user, method, path, body, response
- Sanitizes sensitive data
- Execution time tracking

### 6. Cron Jobs
- User deactivation (daily at midnight)
- Token cleanup (hourly)
- OTP cleanup (hourly)

### 7. Security Features
- JWT authentication
- Password hashing (bcrypt, 12 rounds)
- Rate limiting
- CSRF protection (optional)
- CSP headers
- Input sanitization
- Audit logging

## Configuration Options

### Feature Flags
```env
ENABLE_SMTP=false                    # Email sending
ENABLE_ACTION_LOGGING=true           # Log all API requests
ENABLE_DETAILED_LOGGING=false        # Verbose logging
ENABLE_USER_DEACTIVATION_CRON=true   # Auto-deactivate users
ENABLE_CLUSTER=false                 # Cluster mode
ENABLE_RATE_LIMIT=true               # Rate limiting
ENABLE_CSRF=false                    # CSRF protection
ENABLE_CSP=true                      # Content Security Policy
ENABLE_CORS=true                     # CORS
ENABLE_SWAGGER=true                  # API documentation
```

### OTP Configuration
```env
OTP_EXPIRY_MINUTES=5                 # OTP validity
OTP_MAX_ATTEMPTS=5                   # Max attempts before new OTP
```

### Token Configuration
```env
JWT_EXPIRES_IN=59m                   # Access token expiry
REFRESH_TOKEN_EXPIRY=7d              # Refresh token expiry
REFRESH_TOKEN_EXPIRY_SECONDS=604800  # 7 days in seconds
```

### Cron Configuration
```env
CRON_TIMEZONE=Asia/Kolkata           # Timezone for cron jobs
USER_DEACTIVATION_CRON_SCHEDULE=0 0 * * *  # Daily at midnight
```

## Database Schema

### Key Tables
- **users** - User accounts with OTP, audit columns
- **roles** - Dynamic roles
- **permissions** - All available permissions
- **role_permissions** - Role-permission mapping
- **refresh_tokens** - Refresh token storage
- **action_logs** - API request logs
- **approval_requests** - Approval workflow (ready for implementation)

### Relationships
- User → Role (many-to-one)
- Role → Permissions (many-to-many)
- User → RefreshTokens (one-to-many)
- User → ActionLogs (one-to-many)

## Permissions

### Users Module
- users.view, users.create, users.update, users.delete
- users.activate, users.deactivate
- users.export, users.schedule_deactivation

### Roles Module
- roles.view, roles.create, roles.update, roles.delete
- roles.assign

### Permissions Module
- permissions.view, permissions.assign, permissions.remove

### Approval Module
- approval.view, approval.allow, approval.approve, approval.reject

### Audit Module
- audit.view, audit.export

### Action Logs Module
- action_logs.view, action_logs.export

### Settings Module
- settings.view, settings.update

### Reports Module
- reports.view, reports.create, reports.export

## System Roles

### SUPER_ADMIN
- All 29 permissions
- Full system access
- Cannot be deleted

### ADMIN
- 18 permissions
- User management, role management, approvals
- Cannot be deleted

### MANAGER
- 7 permissions
- View users, export reports
- Cannot be deleted

### USER
- 1 permission
- View users only
- Cannot be deleted

## Development Tips

### 1. Testing Without Email
Set `ENABLE_SMTP=false` to receive OTP in API response:
```json
{
  "otp": "123456",
  "devMode": true
}
```

### 2. Debugging
Enable detailed logging:
```env
ENABLE_DETAILED_LOGGING=true
LOG_LEVEL=debug
```

### 3. Database Reset
```bash
npm run migrate:undo
npm run migrate
npm run seed
```

### 4. Check Action Logs
Query the `action_logs` table to see all API requests:
```sql
SELECT * FROM action_logs ORDER BY created_at DESC LIMIT 10;
```

### 5. Check Scheduled Deactivations
```sql
SELECT user_id, email, scheduled_deactivation_at 
FROM users 
WHERE scheduled_deactivation_at IS NOT NULL;
```

## Production Deployment

### 1. Environment Setup
```env
NODE_ENV=production
ENABLE_SMTP=true
ENABLE_CLUSTER=true
ENABLE_DETAILED_LOGGING=false
```

### 2. Security
- Generate strong JWT secrets (32+ characters)
- Enable SSL/TLS for database
- Configure SMTP with app password
- Enable rate limiting
- Enable CSRF if needed
- Set up reverse proxy (nginx)

### 3. Database
- Use connection pooling
- Enable SSL connection
- Regular backups
- Monitor slow queries

### 4. Monitoring
- Set up APM (Application Performance Monitoring)
- Configure log aggregation
- Set up alerts for errors
- Monitor cron job execution

### 5. Scaling
- Enable cluster mode
- Configure workers based on CPU cores
- Use Redis for caching (optional)
- Load balancer for multiple instances

## Troubleshooting

### OTP Not Received
- Check `ENABLE_SMTP` setting
- Verify SMTP credentials
- Check email spam folder
- Review logs for email errors

### Token Expired
- Access tokens expire in 59 minutes
- Use refresh token to get new access token
- Refresh tokens expire in 7 days

### Permission Denied
- Check user's role permissions
- Verify token is valid
- Check permission key matches endpoint

### Database Connection Failed
- Verify database credentials
- Check database is running
- Verify network connectivity
- Check SSL settings

## Next Steps

1. Change default admin password
2. Configure SMTP for production
3. Customize permissions as needed
4. Implement admin module (optional)
5. Implement approval workflow (optional)
6. Add custom business logic
7. Update Swagger documentation
8. Write unit tests
9. Set up CI/CD pipeline
10. Deploy to production

## Support

- Check `IMPLEMENTATION_SUMMARY.md` for detailed implementation notes
- Check `NEXT_STEPS.md` for remaining tasks
- Review `schema.sql` for complete database schema
- Check logs in `logs/` directory

## License

MIT License - See LICENSE file for details
