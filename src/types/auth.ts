import {
  loginSchema,
  renewTokenSchema,
  requestPasswordResetSchema,
  setPasswordSchema,
  signUpSchema,
} from "../schema/auth.schema";

type signUpSchemaType = typeof signUpSchema.shape.body;
export type signUpType = Zod.infer<signUpSchemaType>;

type loginSchemaType = typeof loginSchema.shape.body;
export type loginType = Zod.infer<loginSchemaType>;

type passwordReset = typeof requestPasswordResetSchema.shape.params;
export type passwordResetRequestType = Zod.infer<passwordReset>;

type passwordSet = typeof setPasswordSchema.shape.body;
export type passwordSetType = Zod.infer<passwordSet>;

type renewToken = typeof renewTokenSchema.shape.body;
export type renewTokenType = Zod.infer<renewToken>;
