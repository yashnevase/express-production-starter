const cron = require('node-cron');
const db = require('../models');
const logger = require('../config/logger');
const emailService = require('../lib/email');
const datetimeService = require('../lib/datetime');

const runUserDeactivation = async () => {
  try {
    const now = new Date();
    
    const usersToDeactivate = await db.User.findAll({
      where: {
        scheduled_deactivation_at: {
          [db.Sequelize.Op.lte]: now
        },
        is_active: true,
        deleted_at: null
      }
    });

    if (usersToDeactivate.length === 0) {
      logger.info('No users scheduled for deactivation');
      return;
    }

    for (const user of usersToDeactivate) {
      await user.update({
        is_active: false,
        scheduled_deactivation_at: null
      });

      try {
        await emailService.sendNotificationEmail(
          user,
          'Account Deactivated',
          `Your account has been automatically deactivated as scheduled on ${datetimeService.formatDateTime(now)}. If you believe this is an error, please contact support.`
        );
      } catch (emailError) {
        logger.error(`Failed to send deactivation email to ${user.email}:`, emailError);
      }

      logger.info(`User automatically deactivated: ${user.email}`);
    }

    logger.info(`Deactivated ${usersToDeactivate.length} user(s)`);
  } catch (error) {
    logger.error('Error in user deactivation job:', error);
  }
};

const startUserDeactivationJob = () => {
  if (process.env.ENABLE_USER_DEACTIVATION_CRON !== 'true') {
    logger.info('User deactivation cron job is disabled');
    return null;
  }

  const schedule = process.env.USER_DEACTIVATION_CRON_SCHEDULE || '0 0 * * *';
  const timezone = process.env.CRON_TIMEZONE || 'UTC';

  const job = cron.schedule(schedule, runUserDeactivation, {
    scheduled: true,
    timezone: timezone
  });

  logger.info(`User deactivation cron job started with schedule: ${schedule} (${timezone})`);
  
  return job;
};

module.exports = {
  startUserDeactivationJob,
  runUserDeactivation
};
