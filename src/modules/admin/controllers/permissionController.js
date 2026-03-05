const { permissionService } = require('../services');
const { ApiResponse } = require('../../../utils/ApiResponse');

const getAllPermissions = async (req, res, next) => {
  try {
    const result = await permissionService.getAllPermissions(req.query);
    return ApiResponse.success(res, result.permissions, 'Permissions retrieved successfully', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getPermissionById = async (req, res, next) => {
  try {
    const permission = await permissionService.getPermissionById(req.params.id);
    return ApiResponse.success(res, permission, 'Permission retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getPermissionsByModule = async (req, res, next) => {
  try {
    const permissions = await permissionService.getPermissionsByModule();
    return ApiResponse.success(res, permissions, 'Permissions grouped by module retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPermissions,
  getPermissionById,
  getPermissionsByModule
};
