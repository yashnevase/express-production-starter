const userService = require('../services/userService');
const ApiResponse = require('../../../utils/ApiResponse');

const getAll = async (req, res, next) => {
  try {
    const currentUserId = req.user.user_id;
    const result = await userService.getAll(req.query, currentUserId);
    return ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    return ApiResponse.success(res, user);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const currentUserId = req.user.user_id;
    const user = await userService.create(req.body, currentUserId);
    return ApiResponse.created(res, user, 'User created successfully');
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const currentUserId = req.user.user_id;
    const user = await userService.update(req.params.id, req.body, currentUserId);
    return ApiResponse.success(res, user, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const currentUserId = req.user.user_id;
    const result = await userService.remove(req.params.id, currentUserId);
    return ApiResponse.deleted(res, result.message);
  } catch (error) {
    next(error);
  }
};

const activate = async (req, res, next) => {
  try {
    const currentUserId = req.user.user_id;
    const result = await userService.activate(req.params.id, currentUserId);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

const deactivate = async (req, res, next) => {
  try {
    const currentUserId = req.user.user_id;
    const result = await userService.deactivate(req.params.id, currentUserId);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

const scheduleDeactivation = async (req, res, next) => {
  try {
    const currentUserId = req.user.user_id;
    const result = await userService.scheduleDeactivation(
      req.params.id, 
      req.body.deactivation_date, 
      currentUserId
    );
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

const assignRole = async (req, res, next) => {
  try {
    const currentUserId = req.user.user_id;
    const result = await userService.assignRole(
      req.params.id, 
      req.body.role_name, 
      currentUserId
    );
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  activate,
  deactivate,
  scheduleDeactivation,
  assignRole
};
