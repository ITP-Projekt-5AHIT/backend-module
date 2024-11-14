import { NextFunction, Request, Response } from "express";

export const postSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(201).json({ access: "test", refresh: "test" });
};
