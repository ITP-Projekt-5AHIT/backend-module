import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import { server } from "../index";
import db from "../utils/db";
import { INTERNAL_SERVER_ERROR } from "http-status";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export const convertError = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  let error: Error | ApiError = err;

  if (err instanceof PrismaClientValidationError) {
    const validationError: PrismaClientValidationError = err;
    error = new ApiError(
      INTERNAL_SERVER_ERROR,
      validationError.message.toString(),
      true
    );
  }

  if (err instanceof PrismaClientKnownRequestError) {
    const dbError: PrismaClientKnownRequestError = err;
    error = new ApiError(
      INTERNAL_SERVER_ERROR,
      "Error occurred with db transaction;" +
        ` code: ${dbError.code} | meta: ${dbError.meta} | message: ${dbError.message}`,
      true
    );
  }

  if (!(err instanceof ApiError)) {
    error = new ApiError(INTERNAL_SERVER_ERROR, err.message, false);
  }

  next(error);
};

export const handleError = async (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("handling error ");
  if (!err.isOperational) {
    await handleSevereErrors(err.message);
    return;
  }
  if (res.headersSent) return;
  const errorFormat = {
    error: true,
    message: err.message,
    name: err.name,
    statusCode: err.statusCode,
  };
  res.status(err.statusCode || INTERNAL_SERVER_ERROR).json(errorFormat);
};

export const handleSevereErrors = async (e?: string) => {
  try {
    await db.$disconnect();
  } catch {}
  if (server)
    await Promise.resolve(
      new Promise((resolve, _reject) => server.close(resolve))
    );
  process.exit(1);
};
