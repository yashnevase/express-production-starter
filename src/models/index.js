const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const db = {};

db.User = require('./User')(sequelize);
db.AuditLog = require('./AuditLog')(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
