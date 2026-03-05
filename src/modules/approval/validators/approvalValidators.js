const Joi = require('joi');

const approveRequestSchema = Joi.object({
  note: Joi.string()
    .max(500)
    .allow('', null)
    .messages({
      'string.max': 'Note must not exceed 500 characters'
    })
});

const rejectRequestSchema = Joi.object({
  note: Joi.string()
    .max(500)
    .required()
    .messages({
      'string.max': 'Note must not exceed 500 characters',
      'any.required': 'Rejection reason is required'
    })
});

module.exports = {
  approveRequestSchema,
  rejectRequestSchema
};
