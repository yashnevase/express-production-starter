const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

// Create directory for PDFs if it doesn't exist

const pdfDir = path.join(__dirname, '../../uploads/pdfs');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

const generateInvoicePDF = async (data) => {
  const {
    invoiceNumber,
    date,
    customerName,
    customerEmail,
    items = [],
    subtotal,
    tax,
    total
  } = data;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
        .company { font-size: 28px; font-weight: bold; color: #2563eb; }
        .invoice-details { text-align: right; }
        .invoice-number { font-size: 24px; font-weight: bold; color: #2563eb; }
        .customer-info { margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        th { background: #2563eb; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        tr:hover { background: #f8fafc; }
        .totals { margin-top: 30px; text-align: right; }
        .totals div { margin: 8px 0; font-size: 16px; }
        .total-amount { font-size: 24px; font-weight: bold; color: #2563eb; margin-top: 15px; padding-top: 15px; border-top: 2px solid #2563eb; }
        .footer { margin-top: 50px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company">Your Company</div>
        <div class="invoice-details">
          <div class="invoice-number">Invoice #${invoiceNumber}</div>
          <div style="color: #64748b; margin-top: 5px;">${date}</div>
        </div>
      </div>
      
      <div class="customer-info">
        <div style="font-weight: bold; margin-bottom: 8px; font-size: 18px;">Bill To:</div>
        <div style="font-size: 16px;">${customerName}</div>
        <div style="color: #64748b; margin-top: 4px;">${customerEmail}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totals">
        <div>Subtotal: <strong>$${subtotal.toFixed(2)}</strong></div>
        <div>Tax: <strong>$${tax.toFixed(2)}</strong></div>
        <div class="total-amount">Total: $${total.toFixed(2)}</div>
      </div>
      
      <div class="footer">
        <div>Thank you for your business!</div>
        <div style="margin-top: 8px;">Questions? Contact us at support@yourcompany.com</div>
      </div>
    </body>
    </html>
  `;
  
  return await generatePDFFromHTML(html, `invoice_${invoiceNumber}.pdf`);
};

const generateReportPDF = async (data) => {
  const { title, date, sections = [] } = data;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #10b981; padding-bottom: 20px; }
        h1 { color: #10b981; font-size: 32px; margin-bottom: 10px; }
        .date { color: #64748b; font-size: 16px; }
        .section { margin: 30px 0; }
        .section-title { font-size: 22px; color: #10b981; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #d1fae5; }
        .content { line-height: 1.8; font-size: 15px; }
        .metric { background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #10b981; }
        .metric-label { color: #64748b; font-size: 14px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #10b981; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <div class="date">${date}</div>
      </div>
      
      ${sections.map(section => `
        <div class="section">
          <div class="section-title">${section.title}</div>
          <div class="content">${section.content}</div>
          ${section.metrics ? section.metrics.map(metric => `
            <div class="metric">
              <div class="metric-label">${metric.label}</div>
              <div class="metric-value">${metric.value}</div>
            </div>
          `).join('') : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;
  
  return await generatePDFFromHTML(html, `report_${Date.now()}.pdf`);
};

const generatePDFFromHTML = async (html, filename) => {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfPath = path.join(pdfDir, filename);
    
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    logger.info(`PDF generated: ${filename}`);
    
    return {
      path: pdfPath,
      filename,
      url: `/uploads/pdfs/${filename}`
    };
  } catch (error) {
    if (browser) await browser.close();
    logger.error('PDF generation failed:', error);
    throw error;
  }
};

const generatePDFFromURL = async (url, filename) => {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const pdfPath = path.join(pdfDir, filename);
    
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true
    });
    
    await browser.close();
    
    logger.info(`PDF generated from URL: ${filename}`);
    
    return {
      path: pdfPath,
      filename,
      url: `/uploads/pdfs/${filename}`
    };
  } catch (error) {
    if (browser) await browser.close();
    logger.error('PDF generation from URL failed:', error);
    throw error;
  }
};

module.exports = {
  generateInvoicePDF,
  generateReportPDF,
  generatePDFFromHTML,
  generatePDFFromURL
};
