const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    password_reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password_reset_token_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refresh_token_version: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    scheduled_deactivation_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    profile_photo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: false,
    indexes: [
      { fields: ['email'] },
      { fields: ['role'] },
      { fields: ['is_active'] },
      { fields: ['scheduled_deactivation_at'] },
      { fields: ['deleted_at'] }
    ]
  });
  
  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password_hash;
    delete values.password_reset_token;
    delete values.otp_code;
    return values;
  };
  
  return User;
};
