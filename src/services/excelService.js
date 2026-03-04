const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

// Create directory for Excel files if it doesn't exist

const excelDir = path.join(__dirname, '../../uploads/excel');
if (!fs.existsSync(excelDir)) {
  fs.mkdirSync(excelDir, { recursive: true });
}

const generateExcelFromData = async (data, options = {}) => {
  const {
    filename = `export_${Date.now()}.xlsx`,
    sheetName = 'Sheet1',
    columns = [],
    title = null,
    autoFilter = true,
    freezeHeader = true
  } = options;
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  
  if (title) {
    worksheet.mergeCells('A1', `${String.fromCharCode(65 + columns.length - 1)}1`);
    const titleCell = worksheet.getCell('A1');
    titleCell.value = title;
    titleCell.font = { size: 16, bold: true, color: { argb: 'FF2563EB' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF8FAFC' }
    };
    worksheet.getRow(1).height = 30;
  }
  
  const headerRow = title ? 2 : 1;
  
  worksheet.columns = columns.map(col => ({
    header: col.header,
    key: col.key,
    width: col.width || 15
  }));
  
  const headerRowObj = worksheet.getRow(headerRow);
  headerRowObj.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRowObj.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' }
  };
  headerRowObj.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRowObj.height = 25;
  
  data.forEach((item, index) => {
    const row = worksheet.addRow(item);
    
    if (index % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8FAFC' }
      };
    }
  });
  
  if (autoFilter) {
    worksheet.autoFilter = {
      from: { row: headerRow, column: 1 },
      to: { row: headerRow, column: columns.length }
    };
  }
  
  if (freezeHeader) {
    worksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: headerRow }
    ];
  }
  
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
    });
  });
  
  const filePath = path.join(excelDir, filename);
  await workbook.xlsx.writeFile(filePath);
  
  logger.info(`Excel file generated: ${filename}`);
  
  return {
    path: filePath,
    filename,
    url: `/uploads/excel/${filename}`
  };
};

const readExcelFile = async (filePath) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const data = {};
    
    workbook.eachSheet((worksheet, sheetId) => {
      const sheetData = [];
      const headers = [];
      
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          row.eachCell((cell) => {
            headers.push(cell.value);
          });
        } else {
          const rowData = {};
          row.eachCell((cell, colNumber) => {
            rowData[headers[colNumber - 1]] = cell.value;
          });
          sheetData.push(rowData);
        }
      });
      
      data[worksheet.name] = sheetData;
    });
    
    logger.info(`Excel file read: ${path.basename(filePath)}`);
    
    return data;
  } catch (error) {
    logger.error('Failed to read Excel file:', error);
    throw error;
  }
};

const updateExcelFile = async (filePath, sheetName, updates) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.getWorksheet(sheetName);
    
    if (!worksheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }
    
    updates.forEach(update => {
      const { row, column, value } = update;
      worksheet.getCell(row, column).value = value;
    });
    
    await workbook.xlsx.writeFile(filePath);
    
    logger.info(`Excel file updated: ${path.basename(filePath)}`);
    
    return { success: true, path: filePath };
  } catch (error) {
    logger.error('Failed to update Excel file:', error);
    throw error;
  }
};

const generateUserReportExcel = async (users) => {
  const columns = [
    { header: 'ID', key: 'user_id', width: 10 },
    { header: 'Full Name', key: 'full_name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Role', key: 'role', width: 15 },
    { header: 'Status', key: 'is_active', width: 12 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ];
  
  const data = users.map(user => ({
    user_id: user.user_id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active ? 'Active' : 'Inactive',
    created_at: new Date(user.created_at).toLocaleDateString()
  }));
  
  return await generateExcelFromData(data, {
    filename: `users_report_${Date.now()}.xlsx`,
    sheetName: 'Users',
    columns,
    title: 'User Report',
    autoFilter: true,
    freezeHeader: true
  });
};

module.exports = {
  generateExcelFromData,
  readExcelFile,
  updateExcelFile,
  generateUserReportExcel
};
