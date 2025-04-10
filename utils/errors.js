const { StatusCodes } = require('http-status-codes');

class AppError extends Error {
    constructor(message, statusCode) {
      super(message instanceof Error ? message.message : message);
      this.statusCode = statusCode;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class ValidationError extends AppError {
    constructor(message) {
      super(message instanceof Error ? message.message : message, StatusCodes.BAD_REQUEST);
    }
  }
  
  class AuthError extends AppError {
    constructor(message) {
      super(message instanceof Error ? message.message : message, StatusCodes.UNAUTHORIZED);
    }
  }

  class UnProcessableError extends AppError {
    constructor(message) {
      super(message instanceof Error ? message.message : message, StatusCodes.UNPROCESSABLE_ENTITY);
    }
  }
  
  class DatabaseError extends AppError {
    constructor(message) {
      super(message instanceof Error ? message.message : message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  class NotFoundError extends AppError {
    constructor(message) {
      super(message instanceof Error ? message.message : message, StatusCodes.NOT_FOUND);
    }
  }

  class ForbiddenError extends AppError {
    constructor(message) {
      super(message instanceof Error ? message.message : message, StatusCodes.FORBIDDEN); 
    }
  }
  
  module.exports = { 
    AppError, 
    ValidationError, 
    AuthError, 
    UnProcessableError, 
    DatabaseError,
    NotFoundError,
    ForbiddenError 
  };
