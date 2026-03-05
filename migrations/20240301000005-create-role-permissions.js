module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'role_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'permission_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('role_permissions', ['role_id']);
    await queryInterface.addIndex('role_permissions', ['permission_id']);
    await queryInterface.addIndex('role_permissions', ['role_id', 'permission_id'], {
      unique: true,
      name: 'unique_role_permission'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('role_permissions');
  }
};
