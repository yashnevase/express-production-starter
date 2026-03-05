const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Permission = sequelize.define('Permission', {
    permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    permission_key: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    permission_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    module: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    tableName: 'permissions',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['permission_key'] },
      { fields: ['module'] },
      { fields: ['is_active'] }
    ]
  });

  return Permission;
};
