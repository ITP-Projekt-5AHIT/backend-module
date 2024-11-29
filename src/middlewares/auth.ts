import {
  Strategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { TOKEN_TYPE, tokenType } from "../types/token";
import ApiError from "../utils/apiError";
import httpStatus, { UNAUTHORIZED } from "http-status";
import * as authService from "../services/auth";
import { NextFunction, Request, Response } from "express";
import config from "../config/config";
import passport, { DoneCallback } from "passport";
import { Account } from "@prisma/client";

const jwtOptions: StrategyOptionsWithoutRequest = {
  secretOrKey: config.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const verifyAccessToken = async (payload: tokenType, done: DoneCallback) => {
  try {
    if (payload.type != TOKEN_TYPE.ACCESS_TOKEN)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Token must be an access token!"
      );
    const account = await authService.findAccountByUserName(
      payload.sub as string
    );
    done(null, account);
  } catch (e) {
    done(e, null);
  }
};

const verifyAuth =
  (
    req: Request,
    resolve: (value: unknown) => void,
    reject: (err: Error) => void
  ) =>
  (err: Error, user: unknown, info: unknown) => {
    if (err || !user || info) {
      reject(new ApiError(UNAUTHORIZED, "Bitte erneut anmelden"));
    }
    req.user = user as Account;
    resolve(user);
  };

export const auth = async (req: Request, res: Response, next: NextFunction) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyAuth(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) =>
      next(new ApiError(UNAUTHORIZED, `${err.message}`))
    );

const JwtStrategy = new Strategy(jwtOptions, verifyAccessToken);

export default JwtStrategy;
