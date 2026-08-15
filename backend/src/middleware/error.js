const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errorCode: err.errorCode || "INTERNAL_ERROR",
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

module.exports = errorHandler;
