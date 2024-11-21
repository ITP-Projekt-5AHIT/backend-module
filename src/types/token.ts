import assert from "assert";
import config from "../config/config";
import { ManipulateType, UnitType } from "dayjs";
import lodash from "lodash";

export enum TOKEN_TYPE {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  PASSWORD_RESET_TOKEN,
}

export const getExpirationTime = (type: TOKEN_TYPE) => {
  const expTime =
    [
      {
        type: TOKEN_TYPE.ACCESS_TOKEN,
        time: config.ACCESS_EXP_MINS,
        format: "mins",
      },
      {
        type: TOKEN_TYPE.REFRESH_TOKEN,
        time: config.REFRESH_EXP_DAYS,
        format: "days",
      },
      {
        type: TOKEN_TYPE.PASSWORD_RESET_TOKEN,
        time: config.PWD_RESET_EXP_MINS,
        format: "mins",
      },
    ].find((f) => f.type == type);
  assert(
    expTime,
    new ApiError(500, `No expiration type found for type ${type}`)
  );
  return lodash.omit(expTime, "type");
};

export type tokenType = {
  iat: Date;
  exp: Date;
  type: TOKEN_TYPE;
  sub: unknown;
};
