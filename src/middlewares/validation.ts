import { NextFunction, Request, Response } from "express";
import { BAD_REQUEST } from "http-status";
import { AnyZodObject } from "zod";
import ApiError from "../utils/apiError";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (parsed.error && !res.headersSent) {
      const validationError = parsed.error.errors?.at(0)?.message;
      const error: ApiError = new ApiError(
        BAD_REQUEST,
        validationError ?? "Validation failed"
      );
      return next(error);
    }
    Object.assign(req.body, parsed.data);
    return next();
  };
