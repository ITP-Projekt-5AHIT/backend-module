import { NextFunction, Request, Response } from "express";
import services from "../../services";
import { loginType, signUpType } from "../../types/auth";
import { findAccount, generateTokens } from "../../services/auth";
import catchAsync from "../../utils/catchAsync";

export const postSignUp = catchAsync(
  async (
    req: Request<{}, {}, signUpType>,
    res: Response,
    _next: NextFunction
  ) => {
    const account = await services.auth.createAccount(req.body);
    const tokens = await generateTokens(account);
    return res.status(201).json({ ...tokens });
  }
);

export const postLogin = catchAsync(
  async (
    req: Request<{}, {}, loginType>,
    res: Response,
    _next: NextFunction
  ) => {
    const account = await findAccount(req.body);
    const tokens = await generateTokens(account);
    return res.status(200).json({ ...tokens });
  }
);
