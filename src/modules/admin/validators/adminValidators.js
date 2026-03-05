const Joi = require('joi');

const createRoleSchema = Joi.object({
  role_name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Role name must be at least 2 characters long',
      'string.max': 'Role name must not exceed 50 characters',
      'any.required': 'Role name is required'
    }),
  description: Joi.string()
    .max(255)
    .allow('', null)
    .messages({
      'string.max': 'Description must not exceed 255 characters'
    })
});

const updateRoleSchema = Joi.object({
  role_name: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Role name must be at least 2 characters long',
      'string.max': 'Role name must not exceed 50 characters'
    }),
  description: Joi.string()
    .max(255)
    .allow('', null)
    .messages({
      'string.max': 'Description must not exceed 255 characters'
    }),
  is_active: Joi.boolean()
}).min(1);

const assignPermissionsSchema = Joi.object({
  permission_ids: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one permission must be provided',
      'any.required': 'Permission IDs are required'
    })
});

module.exports = {
  createRoleSchema,
  updateRoleSchema,
  assignPermissionsSchema
};
