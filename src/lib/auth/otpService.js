const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../../models');
const logger = require('../../config/logger');
const { ApiError } = require('../../middleware/errorHandler');

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const storeOTP = async (userId, otp, purpose = 'REGISTRATION') => {
  try {
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    const otpHash = await bcrypt.hash(otp, 10);

    await db.Otp.destroy({
      where: {
        user_id: userId,
        purpose: purpose,
        is_used: false
      }
    });

    await db.Otp.create({
      user_id: userId,
      otp_hash: otpHash,
      purpose: purpose,
      expires_at: expiresAt,
      attempts: 0,
      is_used: false
    });

    return { otp, expiresAt };
  } catch (error) {
    logger.error('Error storing OTP:', error);
    throw error;
  }
};

const validateOTP = async (userId, otp, purpose = 'REGISTRATION') => {
  try {
    const otpRecord = await db.Otp.findOne({
      where: {
        user_id: userId,
        purpose: purpose,
        is_used: false
      },
      order: [['created_at', 'DESC']]
    });

    if (!otpRecord) {
      throw ApiError.badRequest('No OTP found. Please request a new one');
    }

    if (new Date() > otpRecord.expires_at) {
      await clearOTP(userId, purpose);
      throw ApiError.badRequest('OTP has expired. Please request a new one');
    }

    const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS) || 5;
    if (otpRecord.attempts >= maxAttempts) {
      await clearOTP(userId, purpose);
      throw ApiError.badRequest('Maximum OTP attempts exceeded. Please request a new one');
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp_hash);
    
    if (!isValid) {
      await otpRecord.increment('attempts');
      
      const remainingAttempts = maxAttempts - (otpRecord.attempts + 1);
      throw ApiError.badRequest(
        `Invalid OTP. ${remainingAttempts} attempt(s) remaining`
      );
    }

    await otpRecord.update({ is_used: true });
    return true;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    logger.error('Error validating OTP:', error);
    throw ApiError.internal('Error validating OTP');
  }
};

const clearOTP = async (userId, purpose = null) => {
  try {
    const where = { user_id: userId };
    if (purpose) {
      where.purpose = purpose;
    }
    
    await db.Otp.destroy({ where });
    return true;
  } catch (error) {
    logger.error('Error clearing OTP:', error);
    return false;
  }
};

const cleanupExpiredOTPs = async () => {
  try {
    const result = await db.Otp.destroy({
      where: {
        expires_at: {
          [db.Sequelize.Op.lt]: new Date()
        }
      }
    });

    logger.info(`Cleaned up ${result} expired OTPs`);
    return result;
  } catch (error) {
    logger.error('Error cleaning up expired OTPs:', error);
    return 0;
  }
};

module.exports = {
  generateOTP,
  storeOTP,
  validateOTP,
  clearOTP,
  cleanupExpiredOTPs
};
