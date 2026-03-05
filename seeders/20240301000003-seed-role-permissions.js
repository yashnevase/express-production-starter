module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    const roles = await queryInterface.sequelize.query(
      'SELECT role_id, role_name FROM roles WHERE is_system_role = true',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const permissions = await queryInterface.sequelize.query(
      'SELECT permission_id, permission_key FROM permissions',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.role_name] = role.role_id;
    });

    const permissionMap = {};
    permissions.forEach(perm => {
      permissionMap[perm.permission_key] = perm.permission_id;
    });

    const rolePermissions = [];

    if (roleMap['SUPER_ADMIN']) {
      permissions.forEach(perm => {
        rolePermissions.push({
          role_id: roleMap['SUPER_ADMIN'],
          permission_id: perm.permission_id,
          created_at: now
        });
      });
    }

    if (roleMap['ADMIN']) {
      const adminPermissions = [
        'users.view', 'users.create', 'users.update', 'users.activate', 'users.deactivate', 'users.export', 'users.schedule_deactivation',
        'roles.view', 'roles.create', 'roles.update', 'roles.assign',
        'permissions.view', 'permissions.assign', 'permissions.remove',
        'approval.view', 'approval.allow', 'approval.approve', 'approval.reject',
        'audit.view', 'audit.export',
        'action_logs.view',
        'settings.view', 'settings.update',
        'reports.view', 'reports.create', 'reports.export'
      ];

      adminPermissions.forEach(permKey => {
        if (permissionMap[permKey]) {
          rolePermissions.push({
            role_id: roleMap['ADMIN'],
            permission_id: permissionMap[permKey],
            created_at: now
          });
        }
      });
    }

    if (roleMap['MANAGER']) {
      const managerPermissions = [
        'users.view', 'users.export',
        'roles.view',
        'permissions.view',
        'approval.view',
        'reports.view', 'reports.create', 'reports.export'
      ];

      managerPermissions.forEach(permKey => {
        if (permissionMap[permKey]) {
          rolePermissions.push({
            role_id: roleMap['MANAGER'],
            permission_id: permissionMap[permKey],
            created_at: now
          });
        }
      });
    }

    if (roleMap['USER']) {
      const userPermissions = [
        'users.view'
      ];

      userPermissions.forEach(permKey => {
        if (permissionMap[permKey]) {
          rolePermissions.push({
            role_id: roleMap['USER'],
            permission_id: permissionMap[permKey],
            created_at: now
          });
        }
      });
    }

    if (rolePermissions.length > 0) {
      await queryInterface.bulkInsert('role_permissions', rolePermissions);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};
