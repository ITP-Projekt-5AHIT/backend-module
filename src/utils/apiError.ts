import * as HttpStatus from "http-status";

class ApiError extends Error {
  declare statusCode: number;
  declare isOperational: boolean;
  declare stack: string;
  declare metaInfo: string;
  declare status: string;

  constructor(
    statusCode: number,
    message: string,
    metaInfo?: string,
    name: string = "APIError",
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = HttpStatus[statusCode as keyof typeof HttpStatus].toString();
    this.isOperational = isOperational;
    (this.name = name), (this.metaInfo = metaInfo ?? message);
    if (!this.stack) Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
