const db = require('../../../models');
const { ApiError } = require('../../../middleware/errorHandler');
const logger = require('../../../config/logger');
const emailService = require('../../../lib/email/emailService');

const getPendingApprovals = async (query, currentUser) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {
      status: 'PENDING'
    };

    if (query.request_type) {
      whereClause.request_type = query.request_type;
    }

    const { count, rows } = await db.ApprovalRequest.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'requester',
          attributes: ['user_id', 'email', 'full_name']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      approvals: rows,
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
    logger.error('Error fetching pending approvals:', error);
    throw error;
  }
};

const getApprovalById = async (requestId, currentUser) => {
  try {
    const approval = await db.ApprovalRequest.findByPk(requestId, {
      include: [
        {
          model: db.User,
          as: 'requester',
          attributes: ['user_id', 'email', 'full_name']
        },
        {
          model: db.User,
          as: 'approver',
          attributes: ['user_id', 'email', 'full_name']
        }
      ]
    });

    if (!approval) {
      throw ApiError.notFound('Approval request not found');
    }

    return approval;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    logger.error('Error fetching approval:', error);
    throw ApiError.internal('Error fetching approval');
  }
};

const getMyApprovals = async (query, currentUser) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {
      requested_by: currentUser.user_id
    };

    if (query.status) {
      whereClause.status = query.status;
    }

    const { count, rows } = await db.ApprovalRequest.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'approver',
          attributes: ['user_id', 'email', 'full_name']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      approvals: rows,
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
    logger.error('Error fetching my approvals:', error);
    throw error;
  }
};

const approveRequest = async (requestId, approvalData, currentUser) => {
  try {
    const approval = await db.ApprovalRequest.findByPk(requestId, {
      include: [
        {
          model: db.User,
          as: 'requester',
          attributes: ['user_id', 'email', 'full_name']
        }
      ]
    });

    if (!approval) {
      throw ApiError.notFound('Approval request not found');
    }

    if (approval.status !== 'PENDING') {
      throw ApiError.badRequest(`Request already ${approval.status.toLowerCase()}`);
    }

    await approval.update({
      status: 'APPROVED',
      approved_by: currentUser.user_id,
      approval_note: approvalData.note || null,
      approved_at: new Date()
    });

    logger.info(`Approval request ${requestId} approved by user ${currentUser.user_id}`);

    try {
      await emailService.sendEmail({
        to: approval.requester.email,
        subject: 'Your Request Has Been Approved',
        html: `
          <h2>Request Approved</h2>
          <p>Dear ${approval.requester.full_name},</p>
          <p>Your ${approval.request_type.replace('_', ' ').toLowerCase()} request has been approved.</p>
          ${approvalData.note ? `<p><strong>Note:</strong> ${approvalData.note}</p>` : ''}
          <p>Thank you!</p>
        `
      });
    } catch (emailError) {
      logger.error('Error sending approval email:', emailError);
    }

    return approval;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    logger.error('Error approving request:', error);
    throw ApiError.internal('Error approving request');
  }
};

const rejectRequest = async (requestId, rejectionData, currentUser) => {
  try {
    const approval = await db.ApprovalRequest.findByPk(requestId, {
      include: [
        {
          model: db.User,
          as: 'requester',
          attributes: ['user_id', 'email', 'full_name']
        }
      ]
    });

    if (!approval) {
      throw ApiError.notFound('Approval request not found');
    }

    if (approval.status !== 'PENDING') {
      throw ApiError.badRequest(`Request already ${approval.status.toLowerCase()}`);
    }

    await approval.update({
      status: 'REJECTED',
      approved_by: currentUser.user_id,
      approval_note: rejectionData.note || null,
      approved_at: new Date()
    });

    logger.info(`Approval request ${requestId} rejected by user ${currentUser.user_id}`);

    try {
      await emailService.sendEmail({
        to: approval.requester.email,
        subject: 'Your Request Has Been Rejected',
        html: `
          <h2>Request Rejected</h2>
          <p>Dear ${approval.requester.full_name},</p>
          <p>Your ${approval.request_type.replace('_', ' ').toLowerCase()} request has been rejected.</p>
          ${rejectionData.note ? `<p><strong>Reason:</strong> ${rejectionData.note}</p>` : ''}
          <p>Please contact support if you have questions.</p>
        `
      });
    } catch (emailError) {
      logger.error('Error sending rejection email:', emailError);
    }

    return approval;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    logger.error('Error rejecting request:', error);
    throw ApiError.internal('Error rejecting request');
  }
};

const getApprovalHistory = async (query, currentUser) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {
      status: {
        [db.Sequelize.Op.in]: ['APPROVED', 'REJECTED']
      }
    };

    if (query.request_type) {
      whereClause.request_type = query.request_type;
    }

    if (query.status) {
      whereClause.status = query.status;
    }

    const { count, rows } = await db.ApprovalRequest.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'requester',
          attributes: ['user_id', 'email', 'full_name']
        },
        {
          model: db.User,
          as: 'approver',
          attributes: ['user_id', 'email', 'full_name']
        }
      ],
      limit,
      offset,
      order: [['approved_at', 'DESC']]
    });

    return {
      history: rows,
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
    logger.error('Error fetching approval history:', error);
    throw error;
  }
};

module.exports = {
  getPendingApprovals,
  getApprovalById,
  getMyApprovals,
  approveRequest,
  rejectRequest,
  getApprovalHistory
};
