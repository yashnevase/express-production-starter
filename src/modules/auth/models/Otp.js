const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Otp = sequelize.define('Otp', {
    otp_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    otp_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    purpose: {
      type: DataTypes.ENUM('REGISTRATION', 'PASSWORD_RESET', 'EMAIL_VERIFICATION', 'OTHER'),
      allowNull: false,
      defaultValue: 'REGISTRATION'
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    tableName: 'otps',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['expires_at'] },
      { fields: ['is_used'] }
    ]
  });

  return Otp;
};
