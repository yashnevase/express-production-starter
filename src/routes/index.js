const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/auth/routes');
const userRoutes = require('../modules/user/routes');
const adminRoutes = require('../modules/admin/routes');
const approvalRoutes = require('../modules/approval/routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/approvals', approvalRoutes);

module.exports = router;
