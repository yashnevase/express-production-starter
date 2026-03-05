const db = require('../../../models');
const { ApiError } = require('../../../middleware/errorHandler');
const logger = require('../../../config/logger');

const getAllRoles = async (query) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (query.is_active !== undefined) {
      whereClause.is_active = query.is_active === 'true';
    }

    if (query.search) {
      whereClause[db.Sequelize.Op.or] = [
        { role_name: { [db.Sequelize.Op.iLike]: `%${query.search}%` } },
        { description: { [db.Sequelize.Op.iLike]: `%${query.search}%` } }
      ];
    }

    const { count, rows } = await db.Role.findAndCountAll({
      where: whereClause,
      include: [{
        model: db.Permission,
        as: 'permissions',
        through: { attributes: [] }
      }],
      limit,
      offset,
      order: [['created_at', 'DESC']],
      distinct: true
    });

    return {
      roles: rows,
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
    logger.error('Error fetching roles:', error);
    throw error;
  }
};

const getRoleById = async (roleId) => {
  try {
    const role = await db.Role.findByPk(roleId, {
      include: [{
        model: db.Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    if (!role) {
      throw ApiError.notFound('Role not found');
    }

    return role;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    logger.error('Error fetching role:', error);
    throw ApiError.internal('Error fetching role');
  }
};

const createRole = async (roleData, currentUser) => {
  try {
    const existingRole = await db.Role.findOne({
      where: { role_name: roleData.role_name }
    });

    if (existingRole) {
      throw ApiError.conflict('Role name already exists');
    }

    const role = await db.Role.create({
      role_name: roleData.role_name,
      description: roleData.description,
      is_system_role: false,
      is_active: true,
      created_by: currentUser.user_id
    });

    logger.info(`Role created: ${role.role_name} by user ${currentUser.user_id}`);

    return role;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    logger.error('Error creating role:', error);
    throw ApiError.internal('Error creating role');
  }
};

const updateRole = async (roleId, updateData, currentUser) => {
  try {
    const role = await db.Role.findByPk(roleId);

    if (!role) {
      throw ApiError.notFound('Role not found');
    }

    if (role.is_system_role) {
      throw ApiError.forbidden('Cannot modify system roles');
    }

    if (updateData.role_name && updateData.role_name !== role.role_name) {
      const existingRole = await db.Role.findOne({
        where: { role_name: updateData.role_name }
      });

      if (existingRole) {
        throw ApiError.conflict('Role name already exists');
      }
    }

    await role.update({
      ...updateData,
      updated_by: currentUser.user_id
    });

    logger.info(`Role updated: ${role.role_name} by user ${currentUser.user_id}`);

    return role;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    logger.error('Error updating role:', error);
    throw ApiError.internal('Error updating role');
  }
};

const deleteRole = async (roleId, currentUser) => {
  try {
    const role = await db.Role.findByPk(roleId);

    if (!role) {
      throw ApiError.notFound('Role not found');
    }

    if (role.is_system_role) {
      throw ApiError.forbidden('Cannot delete system roles');
    }

    const usersWithRole = await db.User.count({
      where: { role: roleId, deleted_at: null }
    });

    if (usersWithRole > 0) {
      throw ApiError.badRequest(`Cannot delete role. ${usersWithRole} user(s) still have this role`);
    }

    await role.destroy();

    logger.info(`Role deleted: ${role.role_name} by user ${currentUser.user_id}`);

    return { message: 'Role deleted successfully' };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    logger.error('Error deleting role:', error);
    throw ApiError.internal('Error deleting role');
  }
};

const assignPermissions = async (roleId, permissionIds, currentUser) => {
  try {
    const role = await db.Role.findByPk(roleId);

    if (!role) {
      throw ApiError.notFound('Role not found');
    }

    const permissions = await db.Permission.findAll({
      where: { permission_id: permissionIds }
    });

    if (permissions.length !== permissionIds.length) {
      throw ApiError.badRequest('One or more permissions not found');
    }

    await db.RolePermission.destroy({
      where: { role_id: roleId }
    });

    const rolePermissions = permissionIds.map(permissionId => ({
      role_id: roleId,
      permission_id: permissionId,
      created_by: currentUser.user_id
    }));

    await db.RolePermission.bulkCreate(rolePermissions);

    logger.info(`Permissions assigned to role ${role.role_name} by user ${currentUser.user_id}`);

    const updatedRole = await db.Role.findByPk(roleId, {
      include: [{
        model: db.Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    return updatedRole;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    logger.error('Error assigning permissions:', error);
    throw ApiError.internal('Error assigning permissions');
  }
};

const removePermission = async (roleId, permissionId, currentUser) => {
  try {
    const role = await db.Role.findByPk(roleId);

    if (!role) {
      throw ApiError.notFound('Role not found');
    }

    const deleted = await db.RolePermission.destroy({
      where: {
        role_id: roleId,
        permission_id: permissionId
      }
    });

    if (deleted === 0) {
      throw ApiError.notFound('Permission not assigned to this role');
    }

    logger.info(`Permission removed from role ${role.role_name} by user ${currentUser.user_id}`);

    return { message: 'Permission removed successfully' };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    logger.error('Error removing permission:', error);
    throw ApiError.internal('Error removing permission');
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
