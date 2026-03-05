const moment = require('moment-timezone');

// Default timezone and format settings
const DEFAULT_TIMEZONE = 'UTC';
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// Available date formats for user selection

const FORMATS = {
  'DD-MM-YYYY 24H': 'DD-MM-YYYY HH:mm:ss',
  'DD-MM-YYYY 12H': 'DD-MM-YYYY hh:mm:ss A',
  'MM-DD-YYYY 24H': 'MM-DD-YYYY HH:mm:ss',
  'MM-DD-YYYY 12H': 'MM-DD-YYYY hh:mm:ss A',
  'YYYY-MM-DD 24H': 'YYYY-MM-DD HH:mm:ss',
  'YYYY-MM-DD 12H': 'YYYY-MM-DD hh:mm:ss A',
  'ISO': 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  'DATE_ONLY': 'YYYY-MM-DD',
  'TIME_ONLY_24H': 'HH:mm:ss',
  'TIME_ONLY_12H': 'hh:mm:ss A'
};

const TIMEZONES = {
  'UTC': 'UTC',
  'IST': 'Asia/Kolkata',
  'EST': 'America/New_York',
  'PST': 'America/Los_Angeles',
  'GMT': 'Europe/London',
  'JST': 'Asia/Tokyo',
  'AEST': 'Australia/Sydney'
};

const formatDateTime = (date, formatKey = 'YYYY-MM-DD 24H', timezone = 'UTC') => {
  const format = FORMATS[formatKey] || DEFAULT_FORMAT;
  const tz = TIMEZONES[timezone] || timezone || DEFAULT_TIMEZONE;
  
  return moment(date).tz(tz).format(format);
};

const getCurrentDateTime = (formatKey = 'YYYY-MM-DD 24H', timezone = 'UTC') => {
  return formatDateTime(new Date(), formatKey, timezone);
};

const convertTimezone = (date, fromTimezone, toTimezone) => {
  const fromTz = TIMEZONES[fromTimezone] || fromTimezone || DEFAULT_TIMEZONE;
  const toTz = TIMEZONES[toTimezone] || toTimezone || DEFAULT_TIMEZONE;
  
  return moment.tz(date, fromTz).tz(toTz).toDate();
};

const parseDateTime = (dateString, formatKey = 'YYYY-MM-DD 24H', timezone = 'UTC') => {
  const format = FORMATS[formatKey] || DEFAULT_FORMAT;
  const tz = TIMEZONES[timezone] || timezone || DEFAULT_TIMEZONE;
  
  return moment.tz(dateString, format, tz).toDate();
};

const addTime = (date, amount, unit = 'days') => {
  return moment(date).add(amount, unit).toDate();
};

const subtractTime = (date, amount, unit = 'days') => {
  return moment(date).subtract(amount, unit).toDate();
};

const getDifference = (date1, date2, unit = 'days') => {
  return moment(date1).diff(moment(date2), unit);
};

const isAfter = (date1, date2) => {
  return moment(date1).isAfter(moment(date2));
};

const isBefore = (date1, date2) => {
  return moment(date1).isBefore(moment(date2));
};

const isBetween = (date, startDate, endDate) => {
  return moment(date).isBetween(moment(startDate), moment(endDate));
};

const getStartOfDay = (date, timezone = 'UTC') => {
  const tz = TIMEZONES[timezone] || timezone || DEFAULT_TIMEZONE;
  return moment.tz(date, tz).startOf('day').toDate();
};

const getEndOfDay = (date, timezone = 'UTC') => {
  const tz = TIMEZONES[timezone] || timezone || DEFAULT_TIMEZONE;
  return moment.tz(date, tz).endOf('day').toDate();
};

const getStartOfMonth = (date, timezone = 'UTC') => {
  const tz = TIMEZONES[timezone] || timezone || DEFAULT_TIMEZONE;
  return moment.tz(date, tz).startOf('month').toDate();
};

const getEndOfMonth = (date, timezone = 'UTC') => {
  const tz = TIMEZONES[timezone] || timezone || DEFAULT_TIMEZONE;
  return moment.tz(date, tz).endOf('month').toDate();
};

const formatRelativeTime = (date) => {
  return moment(date).fromNow();
};

const getUserFormattedDateTime = (date, userPreferences = {}) => {
  const {
    timezone = 'UTC',
    format = 'YYYY-MM-DD 24H'
  } = userPreferences;
  
  return formatDateTime(date, format, timezone);
};

const getAvailableFormats = () => {
  return Object.keys(FORMATS).map(key => ({
    key,
    format: FORMATS[key],
    example: moment().format(FORMATS[key])
  }));
};

const getAvailableTimezones = () => {
  return Object.keys(TIMEZONES).map(key => ({
    key,
    timezone: TIMEZONES[key],
    currentTime: moment().tz(TIMEZONES[key]).format('YYYY-MM-DD HH:mm:ss')
  }));
};

module.exports = {
  FORMATS,
  TIMEZONES,
  formatDateTime,
  getCurrentDateTime,
  convertTimezone,
  parseDateTime,
  addTime,
  subtractTime,
  getDifference,
  isAfter,
  isBefore,
  isBetween,
  getStartOfDay,
  getEndOfDay,
  getStartOfMonth,
  getEndOfMonth,
  formatRelativeTime,
  getUserFormattedDateTime,
  getAvailableFormats,
  getAvailableTimezones
};
