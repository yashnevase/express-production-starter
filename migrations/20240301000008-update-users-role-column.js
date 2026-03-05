module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'role_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addIndex('users', ['role']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('users', ['role']);
    
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER'),
      defaultValue: 'USER',
      allowNull: false
    });
  }
};
