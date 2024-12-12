import assert from "assert";
import { loginType, signUpType } from "../../types/auth";
import db from "../../utils/db";
import bcrypt from "bcrypt";
import { Account, Token } from "@prisma/client";
import { getExpirationTime, TOKEN_TYPE, tokenType } from "../../types/token";
import dayjs from "dayjs";
import config from "../../config/config";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/apiError";
import { catchPrisma } from "../../middlewares/error";
import { NOT_FOUND, TOO_MANY_REQUESTS } from "http-status";
import { omit } from "lodash";

export const findAccountByPk = async (aId: number) => {
  const foundAccount = await db.account.findFirst({
    where: {
      aId,
    },
  });
  return foundAccount;
};

export const createAccount = async (accountData: signUpType) => {
  const hashed = await bcrypt.hash(accountData.password, config.SALT);
  const data = {
    ...accountData,
    timestamp: dayjs().toDate(),
  };

  const created = catchPrisma(
    async () =>
      await db.account.create({
        data: {
          ...omit(data, "body"),
          password: hashed,
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
  const found = await db.account.findFirst({
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
  assert(found != null, new ApiError(404, "Account wurde nicht gefunden"));
  return found;
};

export const isValidToken = async (token: string, expectedType: TOKEN_TYPE) => {
  const found = await catchPrisma(
    async () =>
      await db.token.findFirst({
        where: {
          sub: token,
          type: expectedType.toString(),
        },
      })
  );
  assert(
    found != null,
    new ApiError(
      NOT_FOUND,
      "Anmeldung abgelaufen",
      "Der Token wurde in der DB nicht gefunden"
    )
  );
  const now = dayjs();
  assert(
    now.isBefore(dayjs.unix(Number(found.exp))),
    new ApiError(
      NOT_FOUND,
      "Anmeldung abgelaufen",
      "Der Token ist gefunden worden, jedoch bereits abgelaufen --> neue Anmeldung!"
    )
  );
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

export const findAccountByAccessToken = async (access: string) => {
  assert(
    access != null,
    new ApiError(
      NOT_FOUND,
      "Anmeldung abgelaufen",
      "Token wurde nicht an die Methode übergeben"
    )
  );
  const token = await db.token.findFirst({
    where: {
      sub: access,
    },
  });
  assert(
    token != null,
    new ApiError(NOT_FOUND, "Token ungültig", "Kein Token in der DB gefunden")
  );
  return await catchPrisma(async () =>
    db.account.findFirst({
      where: {
        aId: token.aId!,
      },
    })
  );
};

export const generateAccessToken = async (refresh: Token) => {
  const account = await catchPrisma(
    async () =>
      await db.account.findFirst({
        where: {
          aId: refresh.aId!,
        },
      })
  );
  assert(
    account != null,
    new ApiError(
      NOT_FOUND,
      "Anmeldung abgelaufen",
      "Kein Account mit der aId gefunden"
    )
  );
  const { payload, token: access } = await generateToken(
    account,
    TOKEN_TYPE.ACCESS_TOKEN
  );
  const savedToken = await catchPrisma(async () => {
    const [deleted, saved] = await db.$transaction([
      db.token.deleteMany({
        where: {
          aId: refresh.aId,
          type: TOKEN_TYPE.ACCESS_TOKEN.toString(),
        },
      }),
      db.token.create({
        data: {
          exp: payload.exp,
          iat: payload.iat,
          sub: access,
          type: TOKEN_TYPE.ACCESS_TOKEN.toString(),
        },
      }),
    ]);
    return saved;
  });
  return { access: savedToken.sub };
};

const generateToken = async (account: Account, type: TOKEN_TYPE) => {
  const { format, time } = getExpirationTime(type);
  const iat = dayjs();
  const exp = iat.add(time, "minutes");
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
  const { token: access, payload: accessPayload } = await generateToken(
    account,
    TOKEN_TYPE.ACCESS_TOKEN
  );
  const { token: refresh, payload: refreshPayload } = await generateToken(
    account,
    TOKEN_TYPE.REFRESH_TOKEN
  );
  await catchPrisma(async () => {
    await Promise.allSettled(
      await db.$transaction([
        db.token.deleteMany({
          where: {
            aId: account.aId,
            type: TOKEN_TYPE.ACCESS_TOKEN.toString(),
          },
        }),
        db.token.deleteMany({
          where: {
            aId: account.aId,
            type: TOKEN_TYPE.REFRESH_TOKEN.toString(),
          },
        }),
        db.token.create({
          data: {
            exp: accessPayload.exp,
            iat: accessPayload.iat,
            sub: access,
            type: TOKEN_TYPE.ACCESS_TOKEN.toString(),
            aId: account.aId,
          },
        }),
        db.token.create({
          data: {
            exp: refreshPayload.exp,
            iat: refreshPayload.iat,
            sub: refresh,
            type: TOKEN_TYPE.REFRESH_TOKEN.toString(),
            aId: account.aId,
          },
        }),
      ])
    );
  });
  return { access, refresh };
};

export const deleteAllTokens = async (aId: number) => {
  return await catchPrisma(async () =>
    db.token.deleteMany({
      where: {
        aId,
      },
    })
  );
};
