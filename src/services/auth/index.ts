import assert from "assert";
import { loginType, signUpType } from "../../types/auth";
import db from "../../utils/db";
import bcrypt from "bcrypt";
import { Account } from "@prisma/client";
import { getExpirationTime, TOKEN_TYPE, tokenType } from "../../types/token";
import dayjs, { ManipulateType } from "dayjs";
import config from "../../config/config";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/apiError";
import { catchPrisma } from "../../middlewares/error";
import { NOT_FOUND, TOO_MANY_REQUESTS } from "http-status";

export const createAccount = async (accountData: signUpType) => {
  const hashed = await bcrypt.hash(accountData.password, config.SALT);
  const accountType: Omit<Account, "aId"> = {
    email: accountData.email,
    password: hashed,
    userName: accountData.userName,
  };

  const created = catchPrisma(
    async () =>
      await db.account.create({
        data: {
          ...accountType,
        },
      })
  );

  return created;
};

export const handlePasswordReset = async (token: string, password: string) => {
  const tokenFound = await catchPrisma(
    async () =>
      await db.token.findFirst({
        where: {
          sub: token,
          type: TOKEN_TYPE.PASSWORD_RESET_TOKEN.toString(),
        },
      })
  );
  assert(
    tokenFound != null && tokenFound.aId != null,
    new ApiError(
      NOT_FOUND,
      "Bitte probiere es erneut",
      "Kein Token wurde in der Datenbank gefunden"
    )
  );
  const hashed = await bcrypt.hash(password, config.SALT);
  await catchPrisma(async () => {
    await db.$transaction([
      db.token.delete({
        where: {
          tId: tokenFound.tId,
        },
      }),
      db.account.update({
        where: {
          aId: tokenFound.aId!,
        },
        data: {
          password: hashed,
        },
      }),
    ]);
  });
};

export const findAccountByCredentials = async (credentials: loginType) => {
  const found = await db.account.findUnique({
    where: {
      userName: credentials.userName,
    },
  });
  assert(
    found != null,
    new ApiError(
      401,
      "Username oder Passwort falsch",
      "Es wurde kein Eintrag aus der DB zurückgeliefert"
    )
  );
  const isPasswordCorrect = await bcrypt.compare(
    credentials.password,
    found.password
  );
  assert(
    isPasswordCorrect,
    new ApiError(
      401,
      "Username oder Passwort falsch",
      "Das Passwort ist nicht korrekt"
    )
  );
  return found;
};

/**
 * !won't compare passwords
 * throws api error with code 404 if not found
 * @param userName searched in db
 * @returns db account
 * @author TheConsoleLog
 */
export const findAccountByUserName = async (userName: string) => {
  const found = await db.account.findUnique({
    where: {
      userName: userName,
    },
  });
  assert(found != null, new ApiError(404, "User wurde nicht gefunden"));
  return found;
};

export const generatePwdResetToken = async (account: Account) => {
  const tokenFound = await catchPrisma(
    async () =>
      await db.token.findFirst({
        where: {
          aId: account.aId,
          type: TOKEN_TYPE.PASSWORD_RESET_TOKEN.toString(),
        },
      })
  );
  if (tokenFound != null) {
    const expires = dayjs.unix(Number(tokenFound.exp));
    const diff = expires.diff(dayjs(), "seconds");

    if (diff < 0) {
      await catchPrisma(async () =>
        db.token.delete({ where: { tId: tokenFound.tId } })
      );
      generatePwdResetToken(account);
    }

    const seconds = diff % 60;
    const minutes = Math.ceil(diff / 60);

    throw new ApiError(TOO_MANY_REQUESTS, `Bitte warte ${minutes}:${seconds}`);
  }
  const { token, payload } = await generateToken(
    account,
    TOKEN_TYPE.PASSWORD_RESET_TOKEN
  );
  await catchPrisma(
    async () =>
      await db.token.create({
        data: {
          aId: account.aId,
          exp: payload.exp,
          iat: payload.iat,
          sub: token,
          type: TOKEN_TYPE.PASSWORD_RESET_TOKEN.toString(),
        },
      })
  );
  return token;
};

export const generateToken = async (account: Account, type: TOKEN_TYPE) => {
  const { format, time } = getExpirationTime(type);
  const iat = dayjs();
  const exp = iat.add(time, format as ManipulateType);
  const sub = account.aId;
  const payload: tokenType = {
    exp: exp.unix(),
    iat: iat.unix(),
    sub,
    type,
  };
  const token: string = await new Promise((resolve, reject) =>
    type == TOKEN_TYPE.PASSWORD_RESET_TOKEN
      ? resolve(`${Math.floor(100000 + Math.random() * 900000)}`)
      : jwt.sign({ ...payload }, config.JWT_SECRET, {}, (err, jwt) => {
          if (err || !jwt) return reject(err);
          return resolve(jwt);
        })
  );
  assert(
    token != null,
    new ApiError(500, "Bei der Erstellung des Tokens ist etwas schief gelaufen")
  );
  return { token, payload };
};

export const generateTokens = async (account: Account) => {
  const { token: access } = await generateToken(
    account,
    TOKEN_TYPE.ACCESS_TOKEN
  );
  const { token: refresh } = await generateToken(
    account,
    TOKEN_TYPE.REFRESH_TOKEN
  );
  return { access, refresh };
};
