const express = require('express');
const router = express.Router();
const { approvalController } = require('../controllers');
const { validateBody } = require('../../../middleware/validate');
const { authenticateToken, requirePermission } = require('../../../middleware/auth');
const approvalValidators = require('../validators/approvalValidators');

// Approval Workflow Routes
// Base path: /api/approvals
// Most routes require authentication and appropriate permissions

// Get all pending approval requests
// Query params: page, limit, request_type
// Permission required: approval.view
router.get('/pending',
  authenticateToken,
  requirePermission('approval.view'),
  approvalController.getPendingApprovals
);

// Get current user's approval requests
// Query params: page, limit, status
// No special permission required (only authentication)
router.get('/my-requests',
  authenticateToken,
  approvalController.getMyApprovals
);

// Get approval history (approved/rejected requests)
// Query params: page, limit, request_type, status
// Permission required: approval.view
router.get('/history',
  authenticateToken,
  requirePermission('approval.view'),
  approvalController.getApprovalHistory
);

// Get approval request by ID
// URL param: id (request ID)
// Permission required: approval.view
router.get('/:id',
  authenticateToken,
  requirePermission('approval.view'),
  approvalController.getApprovalById
);

// Approve a request
// URL param: id (request ID)
// Body: note (optional approval note)
// Permission required: approval.approve
router.post('/:id/approve',
  authenticateToken,
  requirePermission('approval.approve'),
  validateBody(approvalValidators.approveRequestSchema),
  approvalController.approveRequest
);

// Reject a request
// URL param: id (request ID)
// Body: note (required rejection reason)
// Permission required: approval.reject
router.post('/:id/reject',
  authenticateToken,
  requirePermission('approval.reject'),
  validateBody(approvalValidators.rejectRequestSchema),
  approvalController.rejectRequest
);

module.exports = router;
