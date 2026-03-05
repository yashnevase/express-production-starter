module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('otps', {
      otp_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      otp_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      purpose: {
        type: Sequelize.ENUM('REGISTRATION', 'PASSWORD_RESET', 'EMAIL_VERIFICATION', 'OTHER'),
        allowNull: false,
        defaultValue: 'REGISTRATION'
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      is_used: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('otps', ['user_id']);
    await queryInterface.addIndex('otps', ['expires_at']);
    await queryInterface.addIndex('otps', ['is_used']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('otps');
  }
};
