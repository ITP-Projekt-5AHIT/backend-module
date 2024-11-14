import { NextFunction, Request, Response } from "express";

export const handleError = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (res.headersSent) return;
  res.status(500).json({ message: error.message });
};
