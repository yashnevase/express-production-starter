const userExportService = require('../services/userExportService');

const exportExcel = async (req, res, next) => {
  try {
    const { buffer, filename } = await userExportService.exportToExcel(req.query, req.user);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

const exportPDF = async (req, res, next) => {
  try {
    const { buffer, filename } = await userExportService.exportToPDF(req.query, req.user);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportExcel,
  exportPDF
};
