const Queue = require('bull');
const logger = require('./logger');

const emailQueue = new Queue('email', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

const pdfQueue = new Queue('pdf', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  },
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 5000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

const excelQueue = new Queue('excel', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  },
  defaultJobOptions: {
    attempts: 2,
    removeOnComplete: true,
    removeOnFail: false
  }
});

// Log queue type
if (useRedis) {
  logger.info('Bull queues using Redis for job storage');
} else {
  logger.info('Bull queues using in-memory storage (Redis not configured)');
}

emailQueue.on('completed', (job, result) => {
  logger.info(`Email job ${job.id} completed:`, result);
});

emailQueue.on('failed', (job, err) => {
  logger.error(`Email job ${job.id} failed:`, err);
});

pdfQueue.on('completed', (job, result) => {
  logger.info(`PDF job ${job.id} completed:`, result);
});

pdfQueue.on('failed', (job, err) => {
  logger.error(`PDF job ${job.id} failed:`, err);
});

excelQueue.on('completed', (job, result) => {
  logger.info(`Excel job ${job.id} completed:`, result);
});

excelQueue.on('failed', (job, err) => {
  logger.error(`Excel job ${job.id} failed:`, err);
});

const processEmailQueue = async (job) => {
  const emailService = require('../services/emailService');
  const { to, subject, html, attachments } = job.data;
  
  return await emailService.sendEmail(to, subject, html, attachments);
};

const processPDFQueue = async (job) => {
  const pdfService = require('../services/pdfService');
  const { type, data } = job.data;
  
  if (type === 'invoice') {
    return await pdfService.generateInvoicePDF(data);
  } else if (type === 'report') {
    return await pdfService.generateReportPDF(data);
  } else if (type === 'html') {
    return await pdfService.generatePDFFromHTML(data.html, data.filename);
  }
  
  throw new Error(`Unknown PDF type: ${type}`);
};

const processExcelQueue = async (job) => {
  const excelService = require('../services/excelService');
  const { type, data, options } = job.data;
  
  if (type === 'generate') {
    return await excelService.generateExcelFromData(data, options);
  } else if (type === 'read') {
    return await excelService.readExcelFile(data.filePath);
  } else if (type === 'update') {
    return await excelService.updateExcelFile(data.filePath, data.sheetName, data.updates);
  }
  
  throw new Error(`Unknown Excel operation: ${type}`);
};

emailQueue.process(5, processEmailQueue);
pdfQueue.process(2, processPDFQueue);
excelQueue.process(3, processExcelQueue);

const addEmailJob = async (emailData, options = {}) => {
  return await emailQueue.add(emailData, options);
};

const addPDFJob = async (pdfData, options = {}) => {
  return await pdfQueue.add(pdfData, options);
};

const addExcelJob = async (excelData, options = {}) => {
  return await excelQueue.add(excelData, options);
};

const getQueueStats = async () => {
  const [emailStats, pdfStats, excelStats] = await Promise.all([
    emailQueue.getJobCounts(),
    pdfQueue.getJobCounts(),
    excelQueue.getJobCounts()
  ]);
  
  return {
    email: emailStats,
    pdf: pdfStats,
    excel: excelStats
  };
};

module.exports = {
  emailQueue,
  pdfQueue,
  excelQueue,
  addEmailJob,
  addPDFJob,
  addExcelJob,
  getQueueStats
};
