import { NextFunction, Request, Response } from "express";
import ApiError from "./apiError";
import { INTERNAL_SERVER_ERROR } from "http-status";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

const catchAsync =
  (
    fn: (
      req: Request<any, any, any, any>,
      res: Response,
      next: NextFunction
    ) => void
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: ApiError | Error) =>
      next(
        !(
          err instanceof ApiError ||
          err instanceof PrismaClientValidationError ||
          err instanceof PrismaClientKnownRequestError
        )
          ? new ApiError(
              INTERNAL_SERVER_ERROR,
              "Controller has received an unhandled exception"
            )
          : err
      )
    );
  };

export default catchAsync;
