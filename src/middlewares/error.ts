import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import { server } from "../index";
import db from "../utils/db";
import httpStatus, { INTERNAL_SERVER_ERROR } from "http-status";
import errorResponseType from "../types/error";
import config from "../config/config";
import { Prisma } from "@prisma/client";

export const catchPrisma = async <T>(cb: () => T): Promise<T> => {
  try {
    return await cb();
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      let fieldFailed: string = (
        (err.meta?.target?.toString() as string) ?? "unknown"
      ).toLowerCase();
      if (fieldFailed.length >= 1)
        fieldFailed = `${fieldFailed
          .substring(0, 1)
          .toUpperCase()}${fieldFailed.substring(1)}`;
      throw new ApiError(
        httpStatus.IM_USED,
        `${fieldFailed} ist leider bereits vergeben`
      );
    }
    throw new ApiError(500, "Fehler bei der DB");
  }
};

export const convertError = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  let error: Error | ApiError = err;

  // if (err instanceof PrismaClientValidationError) {
  //   const validationError: PrismaClientValidationError = err;
  //   error = new ApiError(
  //     INTERNAL_SERVER_ERROR,
  //     validationError.message.toString(),
  //     true
  //   );
  // }

  // if (err instanceof PrismaClientKnownRequestError) {
  //   const dbError: PrismaClientKnownRequestError = err;
  //   error = new ApiError(
  //     INTERNAL_SERVER_ERROR,
  //     "Error occurred with db transaction;" +
  //       ` code: ${dbError.code} | meta: ${dbError.meta} | message: ${dbError.message}`,
  //     true
  //   );
  // }

  if (!(err instanceof ApiError)) {
    error = new ApiError(
      INTERNAL_SERVER_ERROR,
      err.message,
      "Ein unbehandelter Fehler ist aufgetreten --> Service ist nicht länger operationsfähig",
      "UnhandledError",
      false
    );
  }

  next(error);
};

export const handleError = async (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!err.isOperational) {
    await handleSevereErrors(err.message);
    return;
  }
  if (res.headersSent) return;
  const errorResponse: errorResponseType = {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
    status: err.status,
  };
  if (config.NODE_ENV === "development") {
    errorResponse.metaInfo = err.metaInfo;
    errorResponse.stack = err.stack;
  }
  res.status(err.statusCode).json(errorResponse);
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
