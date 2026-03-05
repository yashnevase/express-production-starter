const { Sequelize } = require('sequelize');
const logger = require('./logger');

// Get database configuration
const dialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

// SQLite configuration
if (dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
} else {
  // MySQL/PostgreSQL configuration
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || (dialect === 'mysql' ? 3306 : 5432),
      dialect: dialect,
      logging: (sql, timing) => {
        if (process.env.ENABLE_SLOW_QUERY_LOG === 'true' && timing > 500) {
          logger.warn(`Slow query (${timing}ms): ${sql.substring(0, 200)}`);
        }
      },
      benchmark: true,
      pool: {
        max: process.env.NODE_ENV === 'production' ? 120 : 80,
        min: process.env.NODE_ENV === 'production' ? 10 : 0,
        acquire: 30000,
        idle: 10000,
        evict: 1000
      },
      dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    }
  );
}

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✓ Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('✗ Database connection failed:', error);
    return false;
  }
};

const closeConnection = async () => {
  try {
    await sequelize.close();
    logger.info('Database connection closed gracefully');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};

module.exports = sequelize;
module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;
module.exports.testConnection = testConnection;
module.exports.closeConnection = closeConnection;
