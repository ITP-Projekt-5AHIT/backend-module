import { NextFunction, Request, Response } from "express";
import ApiError from "./apiError";
import { INTERNAL_SERVER_ERROR } from "http-status";

const catchAsync =
  (fn: (req: Request<any>, res: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: ApiError | Error) =>
      next(
        err instanceof ApiError
          ? err
          : new ApiError(
              INTERNAL_SERVER_ERROR,
              err.message,
              `Eine vom Controller aufgerufene Funktion hat einen Fehler geworfen und wurde abgefangen
                protocol: ${req.protocol}, ip: ${req.ip}, hostname: ${req.hostname}
              `
            )
      )
    );
  };

export default catchAsync;
