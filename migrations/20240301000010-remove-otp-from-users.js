module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'otp_code');
    await queryInterface.removeColumn('users', 'otp_expires_at');
    await queryInterface.removeColumn('users', 'otp_attempts');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'otp_code', {
      type: Sequelize.STRING(6),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'otp_expires_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'otp_attempts', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
  }
};
