const authService = require('../services/authService');
const ApiResponse = require('../../../utils/ApiResponse');

const register = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    
    const result = await authService.register(req.body, ipAddress, userAgent);
    return ApiResponse.created(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    
    const result = await authService.verifyOTP(req.body.email, req.body.otp, ipAddress, userAgent);
    return ApiResponse.success(res, result, 'Email verified successfully');
  } catch (error) {
    next(error);
  }
};

const resendOTP = async (req, res, next) => {
  try {
    const result = await authService.resendOTP(req.body.email);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    
    const result = await authService.login(req.body.email, req.body.password, ipAddress, userAgent);
    return ApiResponse.success(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    
    const result = await authService.refreshAccessToken(req.body.refreshToken, ipAddress, userAgent);
    return ApiResponse.success(res, result, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    const result = await authService.logout(refreshToken);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, new_password } = req.body;
    const result = await authService.resetPassword(email, otp, new_password);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { current_password, new_password } = req.body;
    const result = await authService.changePassword(userId, current_password, new_password);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword
};
