const db = require('../../../models');
const { ApiError } = require('../../../middleware/errorHandler');
const logger = require('../../../config/logger');

const getAllPermissions = async (query) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 50;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (query.module) {
      whereClause.module = query.module;
    }

    if (query.search) {
      whereClause[db.Sequelize.Op.or] = [
        { permission_key: { [db.Sequelize.Op.iLike]: `%${query.search}%` } },
        { permission_name: { [db.Sequelize.Op.iLike]: `%${query.search}%` } }
      ];
    }

    const { count, rows } = await db.Permission.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['module', 'ASC'], ['permission_key', 'ASC']]
    });

    return {
      permissions: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  } catch (error) {
    logger.error('Error fetching permissions:', error);
    throw error;
  }
};

const getPermissionById = async (permissionId) => {
  try {
    const permission = await db.Permission.findByPk(permissionId);

    if (!permission) {
      throw ApiError.notFound('Permission not found');
    }

    return permission;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    logger.error('Error fetching permission:', error);
    throw ApiError.internal('Error fetching permission');
  }
};

const getPermissionsByModule = async () => {
  try {
    const permissions = await db.Permission.findAll({
      order: [['module', 'ASC'], ['permission_key', 'ASC']]
    });

    const groupedByModule = permissions.reduce((acc, permission) => {
      const module = permission.module || 'other';
      if (!acc[module]) {
        acc[module] = [];
      }
      acc[module].push(permission);
      return acc;
    }, {});

    return groupedByModule;
  } catch (error) {
    logger.error('Error fetching permissions by module:', error);
    throw error;
  }
};

module.exports = {
  getAllPermissions,
  getPermissionById,
  getPermissionsByModule
};
