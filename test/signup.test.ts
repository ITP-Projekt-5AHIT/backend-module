import { test } from "mocha";
import { signUpSchema } from "../src/schema/auth.schema";
import { AnyZodObject } from "zod";
import { signUpType } from "../src/types/auth";
import assert from "assert";
import lodash from "lodash";

const baseData: signUpType = {
  userName: "MaxMustermann",
  password: "Password123!",
  email: "max@mustermann.at",
  firstName: "Max",
  lastName: "Mustermann",
};

type BodySignupSchema = {
  body: signUpType;
};
const buildBody = (values?: Partial<signUpType>): BodySignupSchema => {
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

describe("Auth/Signup-Validation", () => {
  test("if valid credentials will pass", () => {
    const parsed = shouldPass(signUpSchema, buildBody());
  });
  test("if null/ undefined/ ommitted username's will fail", () => {
    const undefinedUserName = shouldFail(
      signUpSchema,
      buildBody({ userName: undefined })
    );
    const nullUserName = shouldFail(
      signUpSchema,
      buildBody({ userName: null! })
    );
    const userNameOmitted = shouldFail(signUpSchema, omitBody("userName"));
  });
  test("if null/ undefined/ omitted username's will fail", () => {
    const undefinedPassword = shouldFail(
      signUpSchema,
      buildBody({ password: undefined })
    );
    const nullPassword = shouldFail(
      signUpSchema,
      buildBody({ password: null! })
    );
    const passwordOmitted = shouldFail(signUpSchema, omitBody("password"));
  });
  test("if null/ undefined/ omitted firstName will fail", () => {
    const undefinedFirstName = shouldFail(
      signUpSchema,
      buildBody({ firstName: undefined })
    );
    const nullFirstName = shouldFail(
      signUpSchema,
      buildBody({ firstName: null! })
    );
    const firstNameOmitted = shouldFail(signUpSchema, omitBody("firstName"));
  });
  test("if null/ undefined/ omitted lastName will fail", () => {
    const undefinedLastName = shouldFail(
      signUpSchema,
      buildBody({ lastName: undefined })
    );
    const nullLastName = shouldFail(
      signUpSchema,
      buildBody({ lastName: null! })
    );
    const lastNameOmitted = shouldFail(signUpSchema, omitBody("lastName"));
  });
  test("if null/ undefined/ omitted email will fail", () => {
    const undefinedEmail = shouldFail(
      signUpSchema,
      buildBody({ email: undefined })
    );
    const nullEmail = shouldFail(signUpSchema, buildBody({ email: null! }));
    const emailOmitted = shouldFail(signUpSchema, omitBody("email"));
  });
  test("if invalid email address will fail", async () => {
    const invalidEmailAddresses = [
      "maxmustermann.at",
      "max@mustermann",
      "max@@mustermann",
      "maxmustermann",
      "@maxmuster.at",
    ];
    invalidEmailAddresses.forEach((email) => {
      shouldFail(signUpSchema, buildBody({ email }));
    });
  });
  test("if unsecure password will fail", async () => {
    const unsecurePasswords = [
      "123",
      "passwort",
      "passwort123",
      "hallo",
      "@@@",
    ];
    unsecurePasswords.forEach((pwd) => {
      shouldFail(signUpSchema, buildBody({ password: pwd }));
    });
  });
});
