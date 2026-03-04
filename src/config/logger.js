const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logsDir = path.join(__dirname, '../../logs');
const appLogsDir = path.join(logsDir, 'application');
const dbLogsDir = path.join(logsDir, 'database');
const systemLogsDir = path.join(logsDir, 'system');

[logsDir, appLogsDir, dbLogsDir, systemLogsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(appLogsDir, 'application.log'),
      maxsize: 10485760,
      maxFiles: 5,
      tailable: true
    }),
    new winston.transports.File({
      filename: path.join(appLogsDir, 'error.log'),
      level: 'error',
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});

// Create separate logger for database operations
const dbLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(dbLogsDir, 'database.log'),
      maxsize: 10485760,
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(dbLogsDir, 'slow-queries.log'),
      level: 'warn',
      maxsize: 10485760,
      maxFiles: 3
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      let msg = `${timestamp} [${level}]: ${message}`;
      if (Object.keys(meta).length > 0) {
        msg += ` ${JSON.stringify(meta)}`;
      }
      return msg;
    })
  );
  
  logger.add(new winston.transports.Console({ format: consoleFormat }));
  dbLogger.add(new winston.transports.Console({ format: consoleFormat }));
}

module.exports = logger;
module.exports.dbLogger = dbLogger;
