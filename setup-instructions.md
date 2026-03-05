# 🚀 Quick Setup Instructions

## 1. Create Environment File

Create a `.env` file in the root directory with:

```bash
# Database (SQLite for development)
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite

# JWT Keys (change these in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Server
PORT=3001
NODE_ENV=development

# Email (disabled by default)
SMTP_ENABLED=false
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Run Database Migrations

```bash
npm run migrate
```

## 4. Seed the Database

```bash
npm run seed
```

## 5. Start the Server

```bash
npm run dev
```

or

```bash
npm start
```

## 6. Access the Application

- **API Base URL**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

## Default Admin User

- **Email**: admin@example.com
- **Password**: Admin@123

## Notes

- SQLite is used by default for easier development
- Email functionality is disabled by default
- All logs are shown in development mode
- The database file will be created as `database.sqlite` in the root directory
