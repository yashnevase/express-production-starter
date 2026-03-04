module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      audit_log_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      action: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      actor_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      actor_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      resource: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      method: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      status_code: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      request_body: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      response_body: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      correlation_id: {
        type: Sequelize.STRING(36),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
    
    await queryInterface.addIndex('audit_logs', ['action']);
    await queryInterface.addIndex('audit_logs', ['actor_id']);
    await queryInterface.addIndex('audit_logs', ['created_at']);
    await queryInterface.addIndex('audit_logs', ['correlation_id']);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('audit_logs');
  }
};
