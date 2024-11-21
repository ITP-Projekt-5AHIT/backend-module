import { NextFunction, Request, Response } from "express";
import services from "../../services";
import { loginType, signUpType } from "../../types/auth";
import { findAccount, generateTokens } from "../../services/auth";
import catchAsync from "../../utils/catchAsync";

export const postSignUp = async (
  req: Request<{}, {}, signUpType>,
  res: Response,
  _next: NextFunction
) => {
  const account = await services.auth.createAccount(req.body);
  res.status(201).json({ account });
};

export const postLogin = async (
  req: Request<{}, {}, loginType>,
  res: Response,
  _next: NextFunction
) => {
  const account = await findAccount(req.body);
  const tokens = await generateTokens(account);
  res.status(200).json({ ...tokens });
};
