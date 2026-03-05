const { startUserDeactivationJob } = require('./userDeactivationJob');
const { startCleanupJob } = require('./cleanupJob');
const logger = require('../config/logger');

const startAllJobs = () => {
  logger.info('Initializing cron jobs...');

  const jobs = {
    userDeactivation: startUserDeactivationJob(),
    cleanup: startCleanupJob()
  };

  const activeJobs = Object.entries(jobs)
    .filter(([, job]) => job !== null)
    .map(([name]) => name);

  logger.info(`Active cron jobs: ${activeJobs.join(', ') || 'none'}`);

  return jobs;
};

module.exports = {
  startAllJobs
};
