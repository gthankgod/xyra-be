const { AppError, ValidationError, UnProcessableError } = require('../utils/errors');
const winston = require('winston');

// Initialize logger with winston
const logger = winston.createLogger({
  level: 'error',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'errors.log' })
  ]
});

const errorHandler = (err, req, res, next) => {
  // Log error with full details
  logger.error('Error occurred:', { 
    error: err,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  // Prepare error response
  const errorResponse = {
    status: 'error',
    message: null,
    errors: null,
    data: null
  };

  if (err instanceof AppError) {
    if (err instanceof ValidationError) {
      // Handle validation errors which may contain multiple messages
      const messages = err.message.split(',');
      errorResponse.message = 'Validation failed';
      errorResponse.errors = messages;
    } else {
      // Handle other operational errors
      errorResponse.message = typeof err.message === 'string' ? err.message : 'Invalid error message format';
      if (typeof err.message !== 'string') {
        errorResponse.errors = [err.message];
      }
    }
    return res.status(err.statusCode || 400).json(errorResponse);
  }

  // Handle unexpected errors by converting to UnProcessableError
  const unprocessableError = new UnProcessableError(err);
  errorResponse.message = unprocessableError.message;
  if (process.env.NODE_ENV === 'development') {
    errorResponse.errors = [err.message];
  }
  return res.status(unprocessableError.statusCode).json(errorResponse);
};

module.exports = errorHandler;
