module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    const roles = [
      {
        role_name: 'SUPER_ADMIN',
        description: 'Super Administrator with full system access',
        is_system_role: true,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        role_name: 'ADMIN',
        description: 'Administrator with management access',
        is_system_role: true,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        role_name: 'MANAGER',
        description: 'Manager with limited administrative access',
        is_system_role: true,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        role_name: 'USER',
        description: 'Standard user with basic access',
        is_system_role: true,
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('roles', roles);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
