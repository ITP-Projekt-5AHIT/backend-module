import {
  loginSchema,
  requestPasswordResetSchema,
  signUpSchema,
} from "../schema/auth";

type signUpSchemaType = typeof signUpSchema.shape.body;
export type signUpType = Zod.infer<signUpSchemaType>;

type loginSchemaType = typeof loginSchema.shape.body;
export type loginType = Zod.infer<loginSchemaType>;

type passwordReset = typeof requestPasswordResetSchema.shape.params;
export type passwordResetRequestType = Zod.infer<passwordReset>;
