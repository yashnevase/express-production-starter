const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
    audit_log_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    actor_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actor_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    resource: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    status_code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    request_body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    response_body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    correlation_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    }
  }, {
    tableName: 'audit_logs',
    timestamps: true,
    underscored: true,
    updatedAt: false,
    indexes: [
      { fields: ['action'] },
      { fields: ['actor_id'] },
      { fields: ['created_at'] },
      { fields: ['correlation_id'] }
    ]
  });
  
  return AuditLog;
};
