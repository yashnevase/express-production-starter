const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

// Image processing utilities using Sharp for high-performance operations

const compressImage = async (inputPath, options = {}) => {
  const {
    quality = 80,
    maxWidth = 1920,
    maxHeight = 1080,
    format = 'jpeg',
    outputPath = null
  } = options;
  
  try {
    const output = outputPath || inputPath;
    
    await sharp(inputPath)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat(format, { quality })
      .toFile(output + '.tmp');
    
    fs.renameSync(output + '.tmp', output);
    
    const stats = fs.statSync(output);
    logger.info(`Image compressed: ${path.basename(output)} (${(stats.size / 1024).toFixed(2)} KB)`);
    
    return output;
  } catch (error) {
    logger.error('Image compression failed:', error);
    throw error;
  }
};

const generateThumbnail = async (inputPath, outputPath, size = 200) => {
  try {
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .toFormat('jpeg', { quality: 70 })
      .toFile(outputPath);
    
    logger.info(`Thumbnail generated: ${path.basename(outputPath)}`);
    return outputPath;
  } catch (error) {
    logger.error('Thumbnail generation failed:', error);
    throw error;
  }
};

const getImageMetadata = async (inputPath) => {
  try {
    const metadata = await sharp(inputPath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      hasAlpha: metadata.hasAlpha
    };
  } catch (error) {
    logger.error('Failed to get image metadata:', error);
    throw error;
  }
};

const convertImageFormat = async (inputPath, outputPath, format = 'jpeg') => {
  try {
    await sharp(inputPath)
      .toFormat(format)
      .toFile(outputPath);
    
    logger.info(`Image converted to ${format}: ${path.basename(outputPath)}`);
    return outputPath;
  } catch (error) {
    logger.error('Image format conversion failed:', error);
    throw error;
  }
};

module.exports = {
  compressImage,
  generateThumbnail,
  getImageMetadata,
  convertImageFormat
};
