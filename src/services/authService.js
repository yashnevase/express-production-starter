const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../models');
const { generateToken, getBcryptRounds } = require('../config/security');
const { getRolePermissions } = require('../constants/roles');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

const register = async (userData) => {
  const { email, password, full_name, role = 'USER' } = userData;
  
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }
  
  const passwordHash = await bcrypt.hash(password, getBcryptRounds());
  
  const user = await db.User.create({
    email,
    password_hash: passwordHash,
    full_name,
    role
  });
  
  const permissions = getRolePermissions(role);
  
  const token = generateToken({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    permissions
  });
  
  logger.info(`User registered: ${email}`);
  
  return {
    token,
    user: user.toJSON()
  };
};

const login = async (email, password) => {
  const user = await db.User.findOne({ where: { email } });
  
  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }
  
  if (!user.is_active) {
    throw ApiError.forbidden('Account is inactive');
  }
  
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw ApiError.unauthorized('Invalid credentials');
  }
  
  await user.update({ last_login_at: new Date() });
  
  const permissions = getRolePermissions(user.role);
  
  const token = generateToken({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    permissions
  });
  
  logger.info(`User logged in: ${email}`);
  
  return {
    token,
    user: user.toJSON()
  };
};

const forgotPassword = async (email) => {
  const user = await db.User.findOne({ where: { email } });
  
  if (!user) {
    return { message: 'If email exists, reset link has been sent' };
  }
  
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = await bcrypt.hash(resetToken, 10);
  
  await user.update({
    password_reset_token: resetTokenHash,
    password_reset_token_expires_at: new Date(Date.now() + 3600000)
  });
  
  logger.info(`Password reset requested for: ${email}`);
  
  return {
    message: 'If email exists, reset link has been sent',
    resetToken
  };
};

const resetPassword = async (token, newPassword) => {
  const users = await db.User.findAll({
    where: {
      password_reset_token_expires_at: {
        [db.Sequelize.Op.gt]: new Date()
      }
    }
  });
  
  let user = null;
  for (const u of users) {
    if (u.password_reset_token) {
      const valid = await bcrypt.compare(token, u.password_reset_token);
      if (valid) {
        user = u;
        break;
      }
    }
  }
  
  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }
  
  const newPasswordHash = await bcrypt.hash(newPassword, getBcryptRounds());
  
  await user.update({
    password_hash: newPasswordHash,
    password_reset_token: null,
    password_reset_token_expires_at: null
  });
  
  logger.info(`Password reset successful for user: ${user.email}`);
  
  return { message: 'Password reset successful' };
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await db.User.findByPk(userId);
  
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  
  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) {
    throw ApiError.unauthorized('Current password is incorrect');
  }
  
  const newPasswordHash = await bcrypt.hash(newPassword, getBcryptRounds());
  
  await user.update({ password_hash: newPasswordHash });
  
  logger.info(`Password changed for user: ${user.email}`);
  
  return { message: 'Password changed successfully' };
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword
};
