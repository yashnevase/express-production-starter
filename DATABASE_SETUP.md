# 🗄️ Database Setup Guide

## Supported Databases

This project supports three databases:

### 1. SQLite (Default - Easiest)
- No installation required
- File-based database
- Perfect for development and testing

### 2. MySQL
- Requires MySQL server
- Good for production
- Widely used

### 3. PostgreSQL
- Requires PostgreSQL server
- Advanced features
- Great for complex applications

## Quick Setup

### Option 1: SQLite (Recommended for Development)

1. Create `.env` file:
```bash
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite
```

2. Run migrations:
```bash
npm run migrate
```

### Option 2: MySQL

1. Install and start MySQL server
2. Create database:
```sql
CREATE DATABASE express_starter_dev;
```

3. Create `.env` file:
```bash
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=express_starter_dev
```

4. Run migrations:
```bash
npm run migrate
```

### Option 3: PostgreSQL

1. Install and start PostgreSQL server
2. Create database:
```sql
CREATE DATABASE express_starter_dev;
```

3. Create `.env` file:
```bash
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=express_starter_dev
```

4. Run migrations:
```bash
npm run migrate
```

## Switching Databases

Simply change `DB_DIALECT` in your `.env` file and run:

```bash
# Warning: This will delete all data!
npm run migrate
```

## Database Commands

```bash
# Run migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Seed the database
npm run seed

# Reset database (delete and recreate)
npm run migrate:undo:all
npm run migrate
npm run seed
```

## Notes

- SQLite database file is created automatically
- MySQL/PostgreSQL require running database server
- Default port for MySQL: 3306
- Default port for PostgreSQL: 5432
- All database configurations are in `src/config/database.js`
