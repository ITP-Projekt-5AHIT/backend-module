import { NextFunction } from "express";

const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: Error) =>
      next(new ApiError(500, err.message)),
    );
  };

export default catchAsync;
