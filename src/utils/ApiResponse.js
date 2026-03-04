const { HTTP_STATUS } = require('../constants/httpStatus');

class ApiResponse {
  static success(res, data, message = 'Success') {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data
    });
  }
  
  static created(res, data, message = 'Created successfully') {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message,
      data
    });
  }
  
  static paginated(res, data, pagination, message = 'Data retrieved successfully') {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data,
      pagination: {
        total: pagination.total || 0,
        page: parseInt(pagination.page) || 1,
        limit: parseInt(pagination.limit) || 10,
        totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10)),
        hasNext: (pagination.page * pagination.limit) < pagination.total,
        hasPrev: pagination.page > 1
      }
    });
  }
  
  static deleted(res, message = 'Deleted successfully') {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message
    });
  }
  
  static noContent(res) {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }
  
  static error(res, statusCode, message, errors = null) {
    const response = {
      success: false,
      error: message
    };
    
    if (errors) {
      response.errors = errors;
    }
    
    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
