# Migration & Seed Guide

## What are Migrations?

**Migrations** are version-controlled database schema changes. Think of them as "recipes" that tell the database how to create or modify tables.

### Example:
```javascript
// Migration file: 20240301000001-create-users.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create users table
    await queryInterface.createTable('users', {
      user_id: { type: Sequelize.INTEGER, primaryKey: true },
      email: { type: Sequelize.STRING, unique: true }
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Rollback: drop users table
    await queryInterface.dropTable('users');
  }
};
```

### Key Points:
- **up()** = Apply the change (create/modify table)
- **down()** = Rollback the change (undo)
- Files run in order by timestamp (20240301000001, 20240301000002, etc.)
- Once run, Sequelize tracks which migrations have been applied

## What are Seeds?

**Seeds** are initial data to populate your database. They insert rows into tables.

### Example:
```javascript
// Seed file: 20240301000001-seed-permissions.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('permissions', [
      { permission_key: 'users.view', permission_name: 'View Users' },
      { permission_key: 'users.create', permission_name: 'Create Users' }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
```

### Key Points:
- Seeds insert initial/test data
- Run after migrations
- Create default admin, roles, permissions, etc.

## Running Migrations

### 1. Run All Pending Migrations
```bash
npm run migrate
```

This executes all migration files that haven't been run yet. It creates/modifies tables in your connected database.

**Yes, running migrations creates the EXACT schema in your database!**

### 2. Rollback Last Migration
```bash
npm run migrate:undo
```

Runs the `down()` function of the last migration to undo changes.

### 3. Check Migration Status
```bash
npx sequelize-cli db:migrate:status
```

Shows which migrations have been applied.

## Running Seeds

### 1. Run All Seeds
```bash
npm run seed
```

This inserts initial data (permissions, roles, default admin).

### 2. Undo All Seeds
```bash
npx sequelize-cli db:seed:undo:all
```

## Complete Setup Process

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Create database (if not exists)
createdb your_database_name

# 4. Run migrations (creates all tables)
npm run migrate

# 5. Run seeds (inserts initial data)
npm run seed

# 6. Start server
npm run dev
```

### Reset Database
```bash
# Undo all migrations (drops all tables)
npm run migrate:undo:all

# Re-run migrations
npm run migrate

# Re-run seeds
npm run seed
```

## Migration Files in This Project

### Order of Execution:
1. `20240301000001-update-users-table.js` - Adds new columns to users
2. `20240301000002-create-refresh-tokens.js` - Creates refresh_tokens table
3. `20240301000003-create-roles.js` - Creates roles table
4. `20240301000004-create-permissions.js` - Creates permissions table
5. `20240301000005-create-role-permissions.js` - Creates role_permissions junction table
6. `20240301000006-create-approval-requests.js` - Creates approval_requests table
7. `20240301000007-create-action-logs.js` - Creates action_logs table
8. `20240301000008-update-users-role-column.js` - Changes role column to FK
9. `20240301000009-create-otps-table.js` - Creates otps table (separate from users)
10. `20240301000010-remove-otp-from-users.js` - Removes OTP columns from users table

## Seed Files in This Project

### Order of Execution:
1. `20240301000001-seed-permissions.js` - Inserts 29 permissions
2. `20240301000002-seed-roles.js` - Inserts 4 system roles
3. `20240301000003-seed-role-permissions.js` - Assigns permissions to roles

## Alternative: Using schema.sql

Instead of running migrations, you can directly execute the `schema.sql` file:

```bash
# PostgreSQL
psql -U postgres -d your_database_name -f schema.sql

# Or using psql interactive
psql -U postgres
\c your_database_name
\i /path/to/schema.sql
```

**schema.sql contains:**
- All table definitions
- All indexes
- All foreign keys
- Initial data (permissions, roles, role_permissions, default admin)

## Key Changes Made

### 1. Separate OTP Table ✅
**Before:** OTP stored in users table (otp_code, otp_expires_at, otp_attempts)

**After:** Separate `otps` table with:
- `otp_hash` (bcrypt hashed, not plain text)
- `purpose` (REGISTRATION, PASSWORD_RESET, etc.)
- `expires_at`, `attempts`, `is_used`
- One user can have multiple OTPs for different purposes

**Why?**
- Security: OTPs are hashed
- Flexibility: Multiple OTPs per user
- History: Can track OTP usage
- Clean: Users table not cluttered

### 2. Role as Foreign Key ✅
**Confirmed:** Role column in users table is an INTEGER FK to roles.role_id

**How it works:**
```sql
-- Users table
role INTEGER REFERENCES roles(role_id)

-- Roles table
role_id SERIAL PRIMARY KEY
role_name VARCHAR(100) UNIQUE

-- One user has ONE role
-- One role can have MANY users
```

### 3. One Role → Multiple Permissions ✅
**Confirmed:** Implemented via `role_permissions` junction table

**How it works:**
```sql
-- Many-to-many relationship
roles (role_id) ←→ role_permissions ←→ permissions (permission_id)

-- Example:
-- ADMIN role has permissions: users.view, users.create, users.update, etc.
-- You can add/remove permissions from any role dynamically
```

**In Code:**
```javascript
// Get role with permissions
const role = await db.Role.findByPk(roleId, {
  include: [{
    model: db.Permission,
    as: 'permissions'
  }]
});

// role.permissions = array of permission objects
```

## Database Schema Overview

### Users Table
- Stores user accounts
- `role` column is FK to roles table (one role per user)
- NO OTP columns (moved to separate table)

### Roles Table
- Stores role definitions (SUPER_ADMIN, ADMIN, MANAGER, USER, custom roles)
- `is_system_role` = true for default roles (cannot be deleted)

### Permissions Table
- Stores all available permissions (29 total)
- Fixed list, defined in code and seeded

### Role_Permissions Table
- Junction table (many-to-many)
- Links roles to permissions
- One role can have multiple permissions
- One permission can belong to multiple roles

### OTPs Table (NEW)
- Stores OTPs separately from users
- `otp_hash` = bcrypt hashed OTP (not plain text)
- `purpose` = REGISTRATION, PASSWORD_RESET, etc.
- `is_used` = prevents OTP reuse
- Automatically cleaned up by cron job

### Refresh_Tokens Table
- Stores refresh tokens (hashed)
- Tracks IP address and user agent
- Supports token rotation

### Action_Logs Table
- Logs every API request
- Tracks user actions, execution time, errors

### Approval_Requests Table
- Stores pending approval requests
- Tracks old vs new values (JSONB)

## Verification

After running migrations and seeds, verify:

```sql
-- Check tables exist
\dt

-- Check users table structure (no OTP columns)
\d users

-- Check otps table exists
\d otps

-- Check roles and permissions
SELECT * FROM roles;
SELECT * FROM permissions;

-- Check role-permission assignments
SELECT r.role_name, p.permission_key 
FROM roles r
JOIN role_permissions rp ON r.role_id = rp.role_id
JOIN permissions p ON rp.permission_id = p.permission_id
ORDER BY r.role_name, p.permission_key;

-- Check default admin user
SELECT * FROM users WHERE email = 'admin@example.com';
```

## Troubleshooting

### Migration Already Run
```
Error: Migration 20240301000001-update-users-table has already been run
```

**Solution:** Migration was already applied. Skip or rollback first.

### Table Already Exists
```
Error: relation "users" already exists
```

**Solution:** Drop table or rollback migrations:
```bash
npm run migrate:undo:all
npm run migrate
```

### Foreign Key Constraint
```
Error: insert or update on table "users" violates foreign key constraint
```

**Solution:** Ensure roles table is populated before inserting users:
```bash
npm run seed
```

## Summary

- **Migrations** = Create/modify database structure
- **Seeds** = Insert initial data
- **Running migrations** = Creates exact schema in your database
- **OTPs now in separate table** with hashing
- **Role is FK** to roles table (already was)
- **One role → multiple permissions** via role_permissions table (already implemented)

Run `npm run migrate && npm run seed` to set up your database!
