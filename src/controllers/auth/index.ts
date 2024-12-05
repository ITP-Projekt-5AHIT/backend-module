import { NextFunction, Request, Response } from "express";
import services from "../../services";
import {
  loginType,
  passwordResetRequestType,
  passwordSetType,
  renewTokenType,
  signUpType,
} from "../../types/auth";
import {
  findAccountByCredentials,
  findAccountByUserName,
  generateAccessToken,
  generatePwdResetToken,
  generateTokens,
  handlePasswordReset,
  isValidToken,
} from "../../services/auth";
import catchAsync from "../../utils/catchAsync";
import { sendPwdResetMail } from "../../services/mail/index";
import { TOKEN_TYPE } from "../../types/token";
import { OK } from "http-status";
import { Account } from "@prisma/client";

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

export const postLogout = catchAsync(async (req, res, _next) => {
  const user = req.user as Account;
  console.log(user);
  await services.auth.deleteAllTokens(user.aId);
  return res.status(200).json({});
});

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
  async (req: Request<{}, {}, passwordSetType>, res, _next) => {
    const { token, password } = req.body;
    await handlePasswordReset(`${token}`, password);
    return res.status(200).json({ message: "Passwort wurde geändert" });
  }
);

export const postRenewToken = catchAsync(
  async (req: Request<{}, {}, renewTokenType>, res, _next) => {
    const tokenFound = await isValidToken(
      req.body.refresh,
      TOKEN_TYPE.REFRESH_TOKEN
    );
    const accessToken = await generateAccessToken(tokenFound);
    return res.status(OK).json(accessToken);
  }
);
