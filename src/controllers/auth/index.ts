import { NextFunction, Request, Response } from "express";
import services from "../../services";
import {
  loginType,
  passwordResetRequestType,
  passwordSetType,
  signUpType,
} from "../../types/auth";
import {
  findAccountByCredentials,
  findAccountByUserName,
  generatePwdResetToken,
  generateTokens,
  handlePasswordReset,
} from "../../services/auth";
import catchAsync from "../../utils/catchAsync";
import { sendPwdResetMail } from "../../services/mail/index";

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
    const resetToken = await generatePwdResetToken(account);
    await sendPwdResetMail(resetToken, account.email);
    return res.status(200).json({ message: "Email wurde versendet" });
  }
);

export const postPasswordReset = catchAsync(
  async (req: Request<{}, {}, passwordSetType>, res, next) => {
    const { token, password } = req.body;
    await handlePasswordReset(`${token}`, password);
    return res.status(200).json({ message: "Passwort wurde geändert" });
  }
);
