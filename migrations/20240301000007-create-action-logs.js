module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('action_logs', {
      log_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      action_type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      module: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      entity_type: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      request_method: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      request_path: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      request_body: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      request_query: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      response_status: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      response_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      execution_time_ms: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('action_logs', ['user_id']);
    await queryInterface.addIndex('action_logs', ['action_type']);
    await queryInterface.addIndex('action_logs', ['module']);
    await queryInterface.addIndex('action_logs', ['created_at']);
    await queryInterface.addIndex('action_logs', ['request_method']);
    await queryInterface.addIndex('action_logs', ['response_status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('action_logs');
  }
};
