import { shouldPass, shouldFail } from "../../src/utils/testUtils";
import { loginSchema } from "../../src/schema/auth/index";

const baseData = {
  userName: "Maxi",
  password: "Password123!",
};

const buildData = (values: Partial<typeof baseData>) => {
  return { body: { ...baseData, values } };
};

describe("Login utilities", () => {
  test.only("test if valid data is passing", async () => {
    shouldPass(loginSchema, buildData({}));
  });
  test("if fails when username is not set", async () => {
    const parsed = shouldFail(loginSchema, buildData({ userName: undefined }));
    expect(parsed.error?.message).toBe("Bitte gib einen Usernamen ein");
  });
  test("if fails when password is not set", async () => {
    const parsed = shouldFail(loginSchema, buildData({ password: undefined }));
    expect(parsed.error?.message).toBe("Bitte gib ein Passwort ein");
  });
});
