const { PERMISSIONS } = require('./permissions');

const ROLES = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    description: 'Full system access',
    permissions: Object.keys(PERMISSIONS)
  },
  
  ADMIN: {
    name: 'Admin',
    description: 'Administrative access',
    permissions: [
      'users.view',
      'users.create',
      'users.update',
      'roles.view',
      'settings.view',
      'settings.update',
      'audit.view',
      'reports.view',
      'reports.export'
    ]
  },
  
  MANAGER: {
    name: 'Manager',
    description: 'Manager level access',
    permissions: [
      'users.view',
      'reports.view',
      'reports.export',
      'reports.create'
    ]
  },
  
  USER: {
    name: 'User',
    description: 'Standard user access',
    permissions: [
      'users.view'
    ]
  }
};

const getRolePermissions = (roleName) => {
  const role = ROLES[roleName];
  return role ? role.permissions : [];
};

const hasPermission = (userPermissions, requiredPermission) => {
  return userPermissions.includes(requiredPermission);
};

module.exports = {
  ROLES,
  getRolePermissions,
  hasPermission
};
