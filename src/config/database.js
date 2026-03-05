require('dotenv').config();

module.exports = {
  development: {
    dialect: process.env.DB_DIALECT || 'sqlite',
    logging: console.log,
    // SQLite specific configuration
    storage: process.env.DB_STORAGE || './database.sqlite',
    // MySQL/PostgreSQL specific configuration (only used if dialect is not sqlite)
    username: process.env.DB_USER || null,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || null,
    host: process.env.DB_HOST || null,
    port: process.env.DB_PORT || null,
    // Dialect-specific options
    dialectOptions: {
      // MySQL options (only used for MySQL)
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      // PostgreSQL options (only used for PostgreSQL)
      // ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    }
  },
  test: {
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE_TEST || './test.sqlite',
    username: process.env.DB_USER || null,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME ? `${process.env.DB_NAME}_test` : 'express_starter_test',
    host: process.env.DB_HOST || null,
    port: process.env.DB_PORT || null,
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 120,
      min: 10,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
};
