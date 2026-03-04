# Quick Start Guide

Get your production-ready backend running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ running
- npm or yarn package manager

## Step 1: Create Project

```bash
npx @production-backend/express-starter my-backend
cd my-backend
```

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update these critical values:

```bash
# Database
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Security (IMPORTANT: Change in production!)
JWT_SECRET=generate-a-strong-random-secret-minimum-32-characters

# Server
PORT=3001
NODE_ENV=development
```

## Step 3: Create Database

```bash
# Using psql
createdb your_database_name

# Or using PostgreSQL client
psql -U postgres
CREATE DATABASE your_database_name;
\q
```

## Step 4: Run Migrations

```bash
npm run migrate
```

## Step 5: Start Development Server

```bash
npm run dev
```

Your server is now running at `http://localhost:3001`!

## Step 6: Test the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Register a User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "full_name": "Admin User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!"
  }'
```

Save the token from the response!

### Get Users (Protected Route)
```bash
curl http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Next Steps

1. **Add Your Business Logic**
   - Create new models in `src/models/`
   - Add services in `src/services/`
   - Define routes in `src/routes/`

2. **Customize Permissions**
   - Edit `src/constants/permissions.js`
   - Update `src/constants/roles.js`

3. **Configure Security**
   - Review `src/config/security.js`
   - Adjust rate limits in `src/config/rateLimiters.js`

4. **Read Documentation**
   - [API Documentation](./API.md)
   - [Security Guide](./SECURITY.md)
   - [Deployment Guide](./DEPLOYMENT.md)

## Troubleshooting

### Database Connection Failed
- Verify PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Ensure database exists: `psql -l`

### Port Already in Use
- Change `PORT` in `.env`
- Kill process using port: `lsof -ti:3001 | xargs kill`

### Migration Errors
- Ensure database exists
- Check database user has CREATE TABLE permissions
- Run `npm run migrate:undo` to rollback

## Development Workflow

```bash
# Start dev server with hot reload
npm run dev

# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:undo

# Run tests
npm test

# Lint code
npm run lint
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

Quick production start:
```bash
NODE_ENV=production ENABLE_CLUSTER=true npm start
```

---

**Need Help?** Check the [full documentation](../README.md) or open an issue on GitHub.
