const express = require('express');
const router = express.Router();
const Joi = require('joi');
const userService = require('../services/userService');
const ApiResponse = require('../utils/ApiResponse');
const { authenticateToken, requirePermission } = require('../middleware/auth');
const { validateBody, validateParams, commonSchemas } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/errorHandler');
const { auditLog } = require('../middleware/auditLog');

const updateUserSchema = Joi.object({
  full_name: Joi.string().min(2).max(100),
  role: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER'),
  is_active: Joi.boolean()
});

const userIdSchema = Joi.object({
  id: commonSchemas.id
});

router.get('/',
  authenticateToken,
  requirePermission('users.view'),
  asyncHandler(async (req, res) => {
    const result = await userService.getAll(req.query);
    return ApiResponse.paginated(res, result.data, result.pagination);
  })
);

router.get('/:id',
  authenticateToken,
  requirePermission('users.view'),
  validateParams(userIdSchema),
  asyncHandler(async (req, res) => {
    const user = await userService.getById(req.params.id);
    return ApiResponse.success(res, user);
  })
);

router.put('/:id',
  authenticateToken,
  requirePermission('users.update'),
  validateParams(userIdSchema),
  validateBody(updateUserSchema),
  auditLog('UPDATE_USER'),
  asyncHandler(async (req, res) => {
    const user = await userService.update(req.params.id, req.body);
    return ApiResponse.success(res, user, 'User updated successfully');
  })
);

router.delete('/:id',
  authenticateToken,
  requirePermission('users.delete'),
  validateParams(userIdSchema),
  auditLog('DELETE_USER'),
  asyncHandler(async (req, res) => {
    await userService.remove(req.params.id);
    return ApiResponse.deleted(res, 'User deleted successfully');
  })
);

module.exports = router;
