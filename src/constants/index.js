const permissions = require('./permissions');
const roles = require('./roles');
const httpStatus = require('./httpStatus');

module.exports = {
  ...permissions,
  ...roles,
  ...httpStatus
};
