import assert from "assert";
import { loginType, signUpType } from "../../types/auth";
import db from "../../utils/db";
import bcrypt from "bcrypt";
import { Account } from "@prisma/client";
import { getExpirationTime, TOKEN_TYPE, tokenType } from "../../types/token";
import dayjs, { ManipulateType } from "dayjs";
import config from "../../config/config";
import jwt from "jsonwebtoken";

export const createAccount = async (accountData: signUpType) => {
  const created = await db.account.create({
    data: {
      ...accountData,
    },
  });
  return created;
};

export const findAccount = async (credentials: loginType) => {
  const found = await db.account.findUnique({
    where: {
      userName: credentials.userName,
    },
  });
  assert(found != null, new ApiError(401, "Username oder Passwort falsch"));
  const isPasswordCorrect = await bcrypt.compare(
    credentials.password,
    found.password
  );
  assert(isPasswordCorrect, new ApiError(401, "Username oder Passwort falsch"));
  return found;
};

export const generateToken = async (account: Account, type: TOKEN_TYPE) => {
  const { format, time } = getExpirationTime(type);
  const iat = dayjs();
  const exp = iat.add(time, format as ManipulateType);
  const sub = account.aId;
  const payload: tokenType = {
    exp: exp.toDate(),
    iat: iat.toDate(),
    sub,
    type,
  };
  const token: string = await new Promise((resolve, reject) =>
    jwt.sign({ ...payload }, config.JWT_SECRET, {}, (err, jwt) => {
      if (err || !jwt) return reject(err);
      return resolve(jwt);
    })
  );
  assert(
    token != null,
    new ApiError(500, "Bei der Erstellung des Tokens ist etwas schief gelaufen")
  );
  return token;
};

export const generateTokens = async (account: Account) => {
  const access = await generateToken(account, TOKEN_TYPE.ACCESS_TOKEN);
  const refresh = await generateToken(account, TOKEN_TYPE.REFRESH_TOKEN);
  return { access, refresh };
};
