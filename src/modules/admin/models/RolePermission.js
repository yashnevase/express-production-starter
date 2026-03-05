const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RolePermission = sequelize.define('RolePermission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'role_permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
    indexes: [
      { fields: ['role_id'] },
      { fields: ['permission_id'] },
      { 
        fields: ['role_id', 'permission_id'],
        unique: true,
        name: 'unique_role_permission'
      }
    ]
  });

  return RolePermission;
};
