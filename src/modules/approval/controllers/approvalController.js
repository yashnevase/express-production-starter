const { approvalService } = require('../services');
const { ApiResponse } = require('../../../utils/ApiResponse');

const getPendingApprovals = async (req, res, next) => {
  try {
    const result = await approvalService.getPendingApprovals(req.query, req.user);
    return ApiResponse.success(res, result.approvals, 'Pending approvals retrieved successfully', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getApprovalById = async (req, res, next) => {
  try {
    const approval = await approvalService.getApprovalById(req.params.id, req.user);
    return ApiResponse.success(res, approval, 'Approval request retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getMyApprovals = async (req, res, next) => {
  try {
    const result = await approvalService.getMyApprovals(req.query, req.user);
    return ApiResponse.success(res, result.approvals, 'My approval requests retrieved successfully', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

const approveRequest = async (req, res, next) => {
  try {
    const approval = await approvalService.approveRequest(req.params.id, req.body, req.user);
    return ApiResponse.success(res, approval, 'Request approved successfully');
  } catch (error) {
    next(error);
  }
};

const rejectRequest = async (req, res, next) => {
  try {
    const approval = await approvalService.rejectRequest(req.params.id, req.body, req.user);
    return ApiResponse.success(res, approval, 'Request rejected successfully');
  } catch (error) {
    next(error);
  }
};

const getApprovalHistory = async (req, res, next) => {
  try {
    const result = await approvalService.getApprovalHistory(req.query, req.user);
    return ApiResponse.success(res, result.history, 'Approval history retrieved successfully', 200, result.pagination);
  } catch (error) {
    next(error);
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
