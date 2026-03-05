const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../../models');
const logger = require('../../config/logger');

const generateAccessToken = (payload) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '59m';
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const generateRefreshToken = (payload) => {
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRY || '7d';
  const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

const storeRefreshToken = async (userId, token, ipAddress, userAgent) => {
  try {
    const tokenHash = await bcrypt.hash(token, 10);
    const expirySeconds = parseInt(process.env.REFRESH_TOKEN_EXPIRY_SECONDS) || 604800;
    const expiresAt = new Date(Date.now() + expirySeconds * 1000);

    const refreshToken = await db.RefreshToken.create({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      is_revoked: false,
      ip_address: ipAddress,
      user_agent: userAgent
    });

    return refreshToken;
  } catch (error) {
    logger.error('Error storing refresh token:', error);
    throw error;
  }
};

const validateRefreshToken = async (token, userId) => {
  try {
    const tokens = await db.RefreshToken.findAll({
      where: {
        user_id: userId,
        is_revoked: false,
        expires_at: {
          [db.Sequelize.Op.gt]: new Date()
        }
      }
    });

    for (const storedToken of tokens) {
      const isValid = await bcrypt.compare(token, storedToken.token_hash);
      if (isValid) {
        return storedToken;
      }
    }

    return null;
  } catch (error) {
    logger.error('Error validating refresh token:', error);
    return null;
  }
};

const revokeRefreshToken = async (tokenId) => {
  try {
    await db.RefreshToken.update(
      { is_revoked: true },
      { where: { token_id: tokenId } }
    );
    return true;
  } catch (error) {
    logger.error('Error revoking refresh token:', error);
    return false;
  }
};

const revokeAllUserTokens = async (userId, exceptTokenId = null) => {
  try {
    const where = { user_id: userId };
    if (exceptTokenId) {
      where.token_id = { [db.Sequelize.Op.ne]: exceptTokenId };
    }

    await db.RefreshToken.update(
      { is_revoked: true },
      { where }
    );

    return true;
  } catch (error) {
    logger.error('Error revoking all user tokens:', error);
    return false;
  }
};

const incrementRefreshTokenVersion = async (userId) => {
  try {
    await db.User.increment('refresh_token_version', {
      where: { user_id: userId }
    });
    return true;
  } catch (error) {
    logger.error('Error incrementing refresh token version:', error);
    return false;
  }
};

const cleanupExpiredTokens = async () => {
  try {
    const result = await db.RefreshToken.destroy({
      where: {
        expires_at: {
          [db.Sequelize.Op.lt]: new Date()
        }
      }
    });

    logger.info(`Cleaned up ${result} expired refresh tokens`);
    return result;
  } catch (error) {
    logger.error('Error cleaning up expired tokens:', error);
    return 0;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  storeRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  incrementRefreshTokenVersion,
  cleanupExpiredTokens
};
