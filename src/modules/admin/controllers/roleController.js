const { roleService } = require('../services');
const { ApiResponse } = require('../../../utils/ApiResponse');

const getAllRoles = async (req, res, next) => {
  try {
    const result = await roleService.getAllRoles(req.query);
    return ApiResponse.success(res, result.roles, 'Roles retrieved successfully', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getRoleById = async (req, res, next) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    return ApiResponse.success(res, role, 'Role retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createRole = async (req, res, next) => {
  try {
    const role = await roleService.createRole(req.body, req.user);
    return ApiResponse.success(res, role, 'Role created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body, req.user);
    return ApiResponse.success(res, role, 'Role updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const result = await roleService.deleteRole(req.params.id, req.user);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

const assignPermissions = async (req, res, next) => {
  try {
    const role = await roleService.assignPermissions(req.params.id, req.body.permission_ids, req.user);
    return ApiResponse.success(res, role, 'Permissions assigned successfully');
  } catch (error) {
    next(error);
  }
};

const removePermission = async (req, res, next) => {
  try {
    const result = await roleService.removePermission(req.params.id, req.params.permissionId, req.user);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermissions,
  removePermission
};
