class ApiError extends Error {
  declare readonly statusCode: number;
  declare isOperational: boolean;
  declare stack: string;

  constructor(
    s: number,
    message: string,
    isOperational: boolean = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = s;
    this.isOperational = isOperational;
    this.name = "APIError";
    this.stack = stack;
    if (!this.stack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
