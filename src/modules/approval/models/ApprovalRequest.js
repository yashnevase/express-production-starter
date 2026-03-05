const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ApprovalRequest = sequelize.define('ApprovalRequest', {
    request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    requested_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    request_type: {
      type: DataTypes.ENUM(
        'USER_CREATE',
        'USER_UPDATE',
        'USER_DELETE',
        'USER_ROLE_CHANGE',
        'ROLE_CREATE',
        'ROLE_UPDATE',
        'ROLE_DELETE',
        'PERMISSION_ASSIGN',
        'PERMISSION_REMOVE',
        'OTHER'
      ),
      allowNull: false
    },
    target_entity: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    target_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    old_values: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    new_values: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING',
      allowNull: false
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    approval_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'approval_requests',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['requested_by'] },
      { fields: ['status'] },
      { fields: ['request_type'] },
      { fields: ['target_entity', 'target_id'] }
    ]
  });

  return ApprovalRequest;
};
