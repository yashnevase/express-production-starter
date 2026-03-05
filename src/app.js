const express = require('express');
const path = require('path');
const { initMiddleware } = require('./middleware/initMiddleware');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { trackAPIPerformance, getAPIStats, getTopSlowAPIs } = require('./middleware/apiTracker');
const logger = require('./config/logger');
const cache = require('./utils/cache');
const { getQuickStats } = require('./utils/systemMonitor');

const app = express();

initMiddleware(app);

if (process.env.ENABLE_ACTION_LOGGING !== 'false') {
  const actionLogger = require('./middleware/actionLogger');
  app.use(actionLogger);
}

if (process.env.ENABLE_API_TRACKING !== 'false') {
  app.use(trackAPIPerformance);
}

if (process.env.ENABLE_SWAGGER !== 'false') {
  const { specs, swaggerUi, swaggerOptions } = require('./config/swagger');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
  logger.info('Swagger documentation available at /api-docs');
}

app.get('/health', async (req, res) => {
  const systemStats = await getQuickStats();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    cache: cache.getStats(),
    system: systemStats
  });
});

app.get('/health/detailed', async (req, res) => {
  const { getSystemHealth } = require('./utils/systemMonitor');
  const systemHealth = await getSystemHealth();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    ...systemHealth,
    cache: cache.getStats(),
    api: {
      stats: getAPIStats(),
      slowest: getTopSlowAPIs(5)
    }
  });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use('/api', require('./routes'));

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
