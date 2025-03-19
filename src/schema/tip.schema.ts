import { coerce, object, string } from "zod";

export const tipSchema = object({
  body: object({
    userName: string({ message: "Username invalid" })
      .trim()
      .min(3, { message: "Username too short" })
      .max(15, { message: "Username too long" }),
    amount: coerce
      .number({ message: "Amount invalid" })
      .min(0.5, { message: "Amount too small" })
      .max(50, { message: "Amount too big" }),
    text: string({ message: "Text invalid" }).nullable(),
  }),
});

export const verifyTipSchema = object({
  body: object({
    id: string({ message: "Id invalid" }),
  }),
});