import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import { server } from "../index";
import db from "../utils/db";
import httpStatus, {
  BAD_REQUEST,
  CONFLICT,
  IM_USED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "http-status";
import errorResponseType from "../types/error";
import config from "../config/config";
import { Prisma } from "@prisma/client";
import logger from "../config/logger";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export const catchPrisma = async <T>(
  cb: () => T,
  apiError?: ApiError
): Promise<T> => {
  try {
    return await cb();
  } catch (err) {
    console.error(err);
    if (apiError) throw apiError;
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

  if (err instanceof PrismaClientValidationError) {
    if (err.message.includes("Expected a valid")) {
      error = new ApiError(
        BAD_REQUEST,
        `Validation failed: Invalid input provided.`
      );
    } else if (
      err.message.includes("Field") &&
      err.message.includes("is required")
    ) {
      error = new ApiError(
        BAD_REQUEST,
        `Validation failed: A required field is missing.`
      );
    } else if (err.message.includes("Invalid")) {
      error = new ApiError(
        BAD_REQUEST,
        `Validation failed: Invalid data type or value.`
      );
    } else {
      error = new ApiError(
        BAD_REQUEST,
        `Unhandled validation error: ${err.message}`
      );
    }
  }

  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2000": // Value too long for the column type
        error = new ApiError(BAD_REQUEST, `Value is too long for the field.`);
        break;
      case "P2001": // No record found for the given condition
        error = new ApiError(
          NOT_FOUND,
          `No record found for the given condition.`
        );
        break;
      case "P2002": // Unique constraint failed
        const fieldFailed = (err.meta?.target as string) || "Field";
        error = new ApiError(IM_USED, `${fieldFailed} is already used.`);
        break;
      case "P2003": // Foreign key constraint violation
        error = new ApiError(CONFLICT, `Foreign key constraint violation.`);
        break;
      case "P2004": // Invalid constraint operation
        error = new ApiError(CONFLICT, `Invalid constraint operation.`);
        break;
      case "P2005": // Invalid value for a field
        error = new ApiError(BAD_REQUEST, `Invalid value for a field.`);
        break;
      case "P2006": // Invalid type for a field
        error = new ApiError(BAD_REQUEST, `Invalid type for the field.`);
        break;
      case "P2007": // Data validation error
        error = new ApiError(CONFLICT, `Data validation error.`);
        break;
      case "P2025": // Record not found for update/delete
        error = new ApiError(CONFLICT, `Record not found.`);
        break;
      case "P2024": // Request timed out
        error = new ApiError(
          INTERNAL_SERVER_ERROR,
          `Database request timed out.`
        );
        break;
      default:
        error = new ApiError(
          INTERNAL_SERVER_ERROR,
          `Unhandled Prisma error: ${err.code}`
        );
        break;
    }
  }

  if (error instanceof SyntaxError && "body" in error) {
    error = new ApiError(BAD_REQUEST, "Malformed request body");
  }

  if (!(error instanceof ApiError)) {
    error = new ApiError(
      INTERNAL_SERVER_ERROR,
      err.message,
      "Ein unbehandelter Fehler ist aufgetreten --> Service ist nicht länger operationsfähig",
      "UnhandledError",
      false
    );
  }
  return next(error);
};

export const handleError = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (!(err instanceof ApiError) || !err?.isOperational) {
    handleSevereErrors(err.message);
    return;
  }
  logger.warn(err.message);
  if (res.headersSent) return;
  const errorResponse: errorResponseType = {
    name: err?.name,
    message: err?.message,
    statusCode: err?.statusCode,
    status: err?.status,
  };
  if (config.NODE_ENV === "development") {
    errorResponse.metaInfo = err.metaInfo;
    errorResponse.stack = err.stack;
  }
  res.status(err.statusCode).json(errorResponse);
};

export const handleSevereErrors = async (e?: string) => {
  logger.error("Server closing due to severe error!");
  await db.$disconnect();
  server.close(() => process.exit(1));
};
