module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('approval_requests', {
      request_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      requested_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      request_type: {
        type: Sequelize.ENUM(
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
        type: Sequelize.STRING(100),
        allowNull: false
      },
      target_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      old_values: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      new_values: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING',
        allowNull: false
      },
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      approval_note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
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

    await queryInterface.addIndex('approval_requests', ['requested_by']);
    await queryInterface.addIndex('approval_requests', ['status']);
    await queryInterface.addIndex('approval_requests', ['request_type']);
    await queryInterface.addIndex('approval_requests', ['target_entity', 'target_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('approval_requests');
  }
};
