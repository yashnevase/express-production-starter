const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const db = {};

db.User = require('../modules/user/models/User')(sequelize);
db.Role = require('../modules/admin/models/Role')(sequelize);
db.Permission = require('../modules/admin/models/Permission')(sequelize);
db.RolePermission = require('../modules/admin/models/RolePermission')(sequelize);
db.RefreshToken = require('../modules/auth/models/RefreshToken')(sequelize);
db.Otp = require('../modules/auth/models/Otp')(sequelize);
db.ApprovalRequest = require('../modules/approval/models/ApprovalRequest')(sequelize);
db.ActionLog = require('../modules/shared/models/ActionLog')(sequelize);
db.AuditLog = require('./AuditLog')(sequelize);

db.User.belongsTo(db.Role, { foreignKey: 'role', as: 'userRole' });
db.Role.hasMany(db.User, { foreignKey: 'role', as: 'users' });

db.Role.belongsToMany(db.Permission, { 
  through: db.RolePermission, 
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions'
});

db.Permission.belongsToMany(db.Role, { 
  through: db.RolePermission, 
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles'
});

db.RefreshToken.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
db.User.hasMany(db.RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens' });

db.Otp.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
db.User.hasMany(db.Otp, { foreignKey: 'user_id', as: 'otps' });

db.ApprovalRequest.belongsTo(db.User, { foreignKey: 'requested_by', as: 'requester' });
db.ApprovalRequest.belongsTo(db.User, { foreignKey: 'approved_by', as: 'approver' });

db.ActionLog.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
db.AuditLog.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

db.User.belongsTo(db.User, { foreignKey: 'created_by', as: 'creator' });
db.User.belongsTo(db.User, { foreignKey: 'updated_by', as: 'updater' });
db.User.belongsTo(db.User, { foreignKey: 'deleted_by', as: 'deleter' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
