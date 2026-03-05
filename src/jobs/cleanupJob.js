const cron = require('node-cron');
const { tokenService, otpService } = require('../lib/auth');
const logger = require('../config/logger');

const runCleanup = async () => {
  try {
    logger.info('Starting cleanup job...');

    const expiredTokens = await tokenService.cleanupExpiredTokens();
    logger.info(`Cleaned up ${expiredTokens} expired refresh tokens`);

    const expiredOTPs = await otpService.cleanupExpiredOTPs();
    logger.info(`Cleaned up ${expiredOTPs} expired OTPs`);

    logger.info('Cleanup job completed successfully');
  } catch (error) {
    logger.error('Error in cleanup job:', error);
  }
};

const startCleanupJob = () => {
  if (process.env.ENABLE_CRON !== 'true') {
    logger.info('Cleanup cron job is disabled');
    return null;
  }

  const schedule = '0 * * * *';
  const timezone = process.env.CRON_TIMEZONE || 'UTC';

  const job = cron.schedule(schedule, runCleanup, {
    scheduled: true,
    timezone: timezone
  });

  logger.info(`Cleanup cron job started with schedule: ${schedule} (${timezone})`);
  
  return job;
};

module.exports = {
  startCleanupJob,
  runCleanup
};
