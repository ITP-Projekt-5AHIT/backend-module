class ApiError extends Error {
  declare statusCode: number;
  declare name: string;
  declare isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}