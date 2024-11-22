import { NextFunction, Request, Response } from "express";
import services from "../../services";
import {
  loginType,
  passwordResetRequestType,
  signUpType,
} from "../../types/auth";
import {
  findAccountByCredentials,
  findAccountByUserName,
  generateToken,
  generateTokens,
} from "../../services/auth";
import catchAsync from "../../utils/catchAsync";
import { sendPwdResetMail } from "../../services/mail/index";
import { TOKEN_TYPE } from "../../types/token";

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
    const account = await findAccountByCredentials(req.body);
    const tokens = await generateTokens(account);
    return res.status(200).json({ ...tokens });
  }
);

export const postRequestPasswordReset = catchAsync(
  async (
    req: Request<passwordResetRequestType>,
    res: Response,
    next: NextFunction
  ) => {
    const { userName } = req.params;
    const account = await findAccountByUserName(userName);
    const resetToken = await generateToken(
      account,
      TOKEN_TYPE.PASSWORD_RESET_TOKEN
    );
    await sendPwdResetMail(resetToken, account.email);
  }
);
