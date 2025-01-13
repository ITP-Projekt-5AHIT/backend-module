import { test } from "mocha";
import { loginSchema } from "../src/schema/auth.schema";
import { AnyZodObject, boolean } from "zod";
import { loginType } from "../src/types/auth";
import assert from "assert";
import lodash from "lodash";

const baseData: loginType = {
  userName: "MaxMustermann",
  password: "Password123!",
};

type BodyLoginSchema = {
  body: loginType;
};
const buildBody = <T>(values?: Partial<loginType>): BodyLoginSchema => {
  return { body: { ...baseData, ...values } };
};

const omitBody = <T>(omit: string) => {
  const data = lodash.omit(baseData, omit);
  return { body: { ...data } };
};

export const shouldPass = (schema: AnyZodObject, data: object) => {
  const parsed = schema.safeParse(data);
  assert(parsed.success);
  assert(!parsed.error);
  assert(parsed.data != undefined && parsed.data != null);
  return parsed;
};

export const shouldFail = (schema: AnyZodObject, data: object) => {
  const parsed = schema.safeParse(data);
  assert(!parsed.success);
  assert(parsed.error != undefined && parsed.error != null);
  assert(!parsed.data);
  return parsed;
};

describe("Auth/Login-Validation", () => {
  test("if valid credentials will pass", () => {
    const parsed = shouldPass(loginSchema, buildBody());
  });
  test("if null/ undefined/ ommitted username's will fail", () => {
    const undefinedUserName = shouldFail(
      loginSchema,
      buildBody({ userName: undefined })
    );
    const nullUserName = shouldFail(
      loginSchema,
      buildBody({ userName: null! })
    );
    const userNameOmitted = shouldFail(loginSchema, omitBody("userName"));
  });
  test("if null/ undefined/ omitted username's will fail", () => {
    const undefinedPassword = shouldFail(
      loginSchema,
      buildBody({ password: undefined })
    );
    const nullPassword = shouldFail(
      loginSchema,
      buildBody({ password: null! })
    );
    const passwordOmitted = shouldFail(loginSchema, omitBody("password"));
  });
});
