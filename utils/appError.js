class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('5') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.contructor);
  }
}

module.exports = { AppError };
