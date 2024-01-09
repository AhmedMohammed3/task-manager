/**
 * This acts like interface (Please do not instansiate)
 */
class ResponseErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = ResponseErrorHandler;
  