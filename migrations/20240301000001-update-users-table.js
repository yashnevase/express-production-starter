module.exports = {
  up: async (queryInterface, Sequelize) => {
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

    await queryInterface.addColumn('users', 'refresh_token_version', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });

    await queryInterface.addColumn('users', 'scheduled_deactivation_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'profile_photo', {
      type: Sequelize.STRING(500),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('users', 'updated_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('users', 'deleted_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('users', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addIndex('users', ['scheduled_deactivation_at']);
    await queryInterface.addIndex('users', ['deleted_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('users', ['deleted_at']);
    await queryInterface.removeIndex('users', ['scheduled_deactivation_at']);
    
    await queryInterface.removeColumn('users', 'deleted_at');
    await queryInterface.removeColumn('users', 'deleted_by');
    await queryInterface.removeColumn('users', 'updated_by');
    await queryInterface.removeColumn('users', 'created_by');
    await queryInterface.removeColumn('users', 'profile_photo');
    await queryInterface.removeColumn('users', 'scheduled_deactivation_at');
    await queryInterface.removeColumn('users', 'refresh_token_version');
    await queryInterface.removeColumn('users', 'otp_attempts');
    await queryInterface.removeColumn('users', 'otp_expires_at');
    await queryInterface.removeColumn('users', 'otp_code');
  }
};
