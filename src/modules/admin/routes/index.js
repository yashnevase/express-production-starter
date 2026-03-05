const express = require('express');
const router = express.Router();
const { roleController, permissionController } = require('../controllers');
const { validateBody } = require('../../../middleware/validate');
const { authenticateToken, requirePermission } = require('../../../middleware/auth');
const adminValidators = require('../validators/adminValidators');

// Admin Module Routes
// Base path: /api/admin
// All routes require authentication and appropriate permissions

// Get all roles with pagination and filters
// Query params: page, limit, is_active, search
// Permission required: roles.view
router.get('/roles',
  authenticateToken,
  requirePermission('roles.view'),
  roleController.getAllRoles
);

// Get role by ID
// URL param: id (role ID)
// Permission required: roles.view
router.get('/roles/:id',
  authenticateToken,
  requirePermission('roles.view'),
  roleController.getRoleById
);

// Create a new role
// Body: role_name (required), description (optional)
// Permission required: roles.create
router.post('/roles',
  authenticateToken,
  requirePermission('roles.create'),
  validateBody(adminValidators.createRoleSchema),
  roleController.createRole
);

// Update role by ID
// URL param: id (role ID)
// Body: role_name, description, is_active (all optional)
// Permission required: roles.update
router.put('/roles/:id',
  authenticateToken,
  requirePermission('roles.update'),
  validateBody(adminValidators.updateRoleSchema),
  roleController.updateRole
);

// Delete role by ID
// URL param: id (role ID)
// Permission required: roles.delete
// Note: Cannot delete roles with assigned users
router.delete('/roles/:id',
  authenticateToken,
  requirePermission('roles.delete'),
  roleController.deleteRole
);

// Assign multiple permissions to a role
// URL param: id (role ID)
// Body: permission_ids (array of permission IDs)
// Permission required: permissions.assign
router.post('/roles/:id/permissions',
  authenticateToken,
  requirePermission('permissions.assign'),
  validateBody(adminValidators.assignPermissionsSchema),
  roleController.assignPermissions
);

// Remove a permission from a role
// URL params: id (role ID), permissionId (permission ID)
// Permission required: permissions.remove
router.delete('/roles/:id/permissions/:permissionId',
  authenticateToken,
  requirePermission('permissions.remove'),
  roleController.removePermission
);

// Get all permissions with pagination and filters
// Query params: page, limit, module, search
// Permission required: permissions.view
router.get('/permissions',
  authenticateToken,
  requirePermission('permissions.view'),
  permissionController.getAllPermissions
);

// Get permissions grouped by module
// Returns object with module names as keys
// Permission required: permissions.view
router.get('/permissions/grouped',
  authenticateToken,
  requirePermission('permissions.view'),
  permissionController.getPermissionsByModule
);

// Get permission by ID
// URL param: id (permission ID)
// Permission required: permissions.view
router.get('/permissions/:id',
  authenticateToken,
  requirePermission('permissions.view'),
  permissionController.getPermissionById
);

module.exports = router;
