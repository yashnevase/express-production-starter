const db = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const cache = require('../utils/cache');
const { getPaginationParams, getSortParams, buildPaginationResponse } = require('../utils/pagination');
const logger = require('../config/logger');

const getAll = async (query) => {
  const cacheKey = `users:all:${JSON.stringify(query)}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;
  
  const { page, limit, offset } = getPaginationParams(query);
  const { sort, order } = getSortParams(query, ['user_id', 'email', 'full_name', 'created_at']);
  
  const whereClause = {};
  
  if (query.role) {
    whereClause.role = query.role;
  }
  
  if (query.is_active !== undefined) {
    whereClause.is_active = query.is_active === 'true';
  }
  
  if (query.search) {
    whereClause[db.Sequelize.Op.or] = [
      { email: { [db.Sequelize.Op.iLike]: `%${query.search}%` } },
      { full_name: { [db.Sequelize.Op.iLike]: `%${query.search}%` } }
    ];
  }
  
  const { count, rows } = await db.User.findAndCountAll({
    where: whereClause,
    order: [[sort, order]],
    limit,
    offset
  });
  
  const result = buildPaginationResponse(rows, count, page, limit);
  
  await cache.set(cacheKey, result, 300);
  
  return result;
};

const getById = async (userId) => {
  const cacheKey = `user:${userId}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;
  
  const user = await db.User.findByPk(userId);
  
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  
  await cache.set(cacheKey, user, 300);
  
  return user;
};

const create = async (userData) => {
  const user = await db.User.create(userData);
  
  await cache.del(`users:all:*`);
  
  logger.info(`User created: ${user.email}`);
  
  return user;
};

const update = async (userId, updateData) => {
  const user = await db.User.findByPk(userId);
  
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  
  await user.update(updateData);
  
  await cache.del(`user:${userId}`);
  await cache.del(`users:all:*`);
  
  logger.info(`User updated: ${user.email}`);
  
  return user;
};

const remove = async (userId) => {
  const user = await db.User.findByPk(userId);
  
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  
  await user.destroy();
  
  await cache.del(`user:${userId}`);
  await cache.del(`users:all:*`);
  
  logger.info(`User deleted: ${user.email}`);
  
  return { message: 'User deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
