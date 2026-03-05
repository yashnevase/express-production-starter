const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const logger = require('../../config/logger');

// Configure email transporter using environment variables

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

const emailTemplates = {
  welcome: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Our Platform!</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.name},</h2>
          <p>Thank you for joining us! We're excited to have you on board.</p>
          <p>Your account has been successfully created with the email: <strong>${data.email}</strong></p>
          <p>Get started by exploring our features:</p>
          <a href="${data.loginUrl}" class="button">Go to Dashboard</a>
          <p>If you have any questions, feel free to reach out to our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  passwordReset: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.name},</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${data.resetUrl}" class="button">Reset Password</a>
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <div class="warning">
            <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact support if you have concerns.
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  otp: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #4facfe; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
        .otp-code { font-size: 36px; font-weight: bold; color: #4facfe; letter-spacing: 8px; }
        .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verification Code</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.name},</h2>
          <p>Your verification code is:</p>
          <div class="otp-box">
            <div class="otp-code">${data.otp}</div>
          </div>
          <p>This code will expire in <strong>${data.expiryMinutes} minutes</strong>.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  notification: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${data.title}</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.name},</h2>
          <p>${data.message}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const smtpEnabled = process.env.ENABLE_SMTP !== 'false';

    if (!smtpEnabled) {
      logger.info(`[SMTP DISABLED] Email would be sent to ${to}: ${subject}`);
      logger.info(`[SMTP DISABLED] Email content logged to console`);
      console.log('\n=== EMAIL CONTENT (SMTP DISABLED) ===');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`HTML: ${html.substring(0, 200)}...`);
      console.log('=====================================\n');
      
      return { 
        success: true, 
        messageId: 'dev-mode-' + Date.now(),
        smtpDisabled: true 
      };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      attachments
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent to ${to}: ${subject} (${info.messageId})`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
};

const sendWelcomeEmail = async (user, loginUrl) => {
  const html = emailTemplates.welcome({
    name: user.full_name,
    email: user.email,
    loginUrl: loginUrl || process.env.FRONTEND_URL || 'http://localhost:3000'
  });
  
  return await sendEmail(user.email, 'Welcome to Our Platform!', html);
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const html = emailTemplates.passwordReset({
    name: user.full_name,
    resetUrl
  });
  
  return await sendEmail(user.email, 'Password Reset Request', html);
};

const sendOTPEmail = async (user, otp, expiryMinutes = 5) => {
  const html = emailTemplates.otp({
    name: user.full_name,
    otp,
    expiryMinutes
  });
  
  const result = await sendEmail(user.email, 'Your Verification Code', html);
  
  if (result.smtpDisabled) {
    result.otp = otp;
  }
  
  return result;
};

const sendNotificationEmail = async (user, title, message) => {
  const html = emailTemplates.notification({
    name: user.full_name,
    title,
    message
  });
  
  return await sendEmail(user.email, title, html);
};

const sendBulkEmail = async (recipients, subject, html) => {
  const promises = recipients.map(recipient => 
    sendEmail(recipient, subject, html).catch(err => ({
      email: recipient,
      error: err.message
    }))
  );
  
  const results = await Promise.all(promises);
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => r.error);
  
  logger.info(`Bulk email sent: ${successful} successful, ${failed.length} failed`);
  
  return { successful, failed };
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOTPEmail,
  sendNotificationEmail,
  sendBulkEmail,
  emailTemplates
};
