module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    const permissions = [
      { permission_key: 'users.view', permission_name: 'View Users', module: 'users', description: 'View user list and details', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'users.create', permission_name: 'Create Users', module: 'users', description: 'Create new users', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'users.update', permission_name: 'Update Users', module: 'users', description: 'Update user information', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'users.delete', permission_name: 'Delete Users', module: 'users', description: 'Delete users (soft delete)', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'users.activate', permission_name: 'Activate Users', module: 'users', description: 'Activate user accounts', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'users.deactivate', permission_name: 'Deactivate Users', module: 'users', description: 'Deactivate user accounts', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'users.export', permission_name: 'Export Users', module: 'users', description: 'Export user data to Excel/PDF', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'users.schedule_deactivation', permission_name: 'Schedule User Deactivation', module: 'users', description: 'Schedule automatic user deactivation', is_active: true, created_at: now, updated_at: now },
      
      { permission_key: 'roles.view', permission_name: 'View Roles', module: 'roles', description: 'View role list and details', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'roles.create', permission_name: 'Create Roles', module: 'roles', description: 'Create custom roles', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'roles.update', permission_name: 'Update Roles', module: 'roles', description: 'Update role information', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'roles.delete', permission_name: 'Delete Roles', module: 'roles', description: 'Delete custom roles', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'roles.assign', permission_name: 'Assign Roles', module: 'roles', description: 'Assign roles to users', is_active: true, created_at: now, updated_at: now },
      
      { permission_key: 'permissions.view', permission_name: 'View Permissions', module: 'permissions', description: 'View all available permissions', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'permissions.assign', permission_name: 'Assign Permissions', module: 'permissions', description: 'Assign permissions to roles', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'permissions.remove', permission_name: 'Remove Permissions', module: 'permissions', description: 'Remove permissions from roles', is_active: true, created_at: now, updated_at: now },
      
      { permission_key: 'approval.view', permission_name: 'View Approvals', module: 'approval', description: 'View pending approval requests', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'approval.allow', permission_name: 'Bypass Approval', module: 'approval', description: 'Bypass approval workflow for actions', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'approval.approve', permission_name: 'Approve Requests', module: 'approval', description: 'Approve pending requests', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'approval.reject', permission_name: 'Reject Requests', module: 'approval', description: 'Reject pending requests', is_active: true, created_at: now, updated_at: now },
      
      { permission_key: 'audit.view', permission_name: 'View Audit Logs', module: 'audit', description: 'View audit log entries', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'audit.export', permission_name: 'Export Audit Logs', module: 'audit', description: 'Export audit logs', is_active: true, created_at: now, updated_at: now },
      
      { permission_key: 'action_logs.view', permission_name: 'View Action Logs', module: 'action_logs', description: 'View action log entries', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'action_logs.export', permission_name: 'Export Action Logs', module: 'action_logs', description: 'Export action logs', is_active: true, created_at: now, updated_at: now },
      
      { permission_key: 'settings.view', permission_name: 'View Settings', module: 'settings', description: 'View system settings', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'settings.update', permission_name: 'Update Settings', module: 'settings', description: 'Update system settings', is_active: true, created_at: now, updated_at: now },
      
      { permission_key: 'reports.view', permission_name: 'View Reports', module: 'reports', description: 'View system reports', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'reports.create', permission_name: 'Create Reports', module: 'reports', description: 'Create custom reports', is_active: true, created_at: now, updated_at: now },
      { permission_key: 'reports.export', permission_name: 'Export Reports', module: 'reports', description: 'Export reports to Excel/PDF', is_active: true, created_at: now, updated_at: now }
    ];

    await queryInterface.bulkInsert('permissions', permissions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
