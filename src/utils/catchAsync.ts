import { NextFunction, Request, Response } from "express";
import ApiError from "./apiError";

const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: ApiError | Error) =>
      next(err)
    );
  };

export default catchAsync;
