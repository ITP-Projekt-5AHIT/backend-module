import { coerce, object, string } from "zod";
import validator from "validator";

export const requestPasswordResetSchema = object({
  params: object({
    userName: string({ message: "Bitte gib einen Usernamen ein" }),
  }),
});

export const setPasswordSchema = object({
  body: object({
    token: coerce
      .number({ message: "Bitte gib die 6-stellige Nummer ein" })
      .min(100_000, { message: "Zahl zu klein" })
      .max(999_999, { message: "Zahl zu groß" }),
    password: string({ message: "Bitte gib ein neues, starked Password ein" })
      .max(256)
      .refine((pwd) => validator.isStrongPassword(pwd), {
        message: "Bitte verwende ein starkes Passwort",
      }),
  }),
});

export const renewTokenSchema = object({
  body: object({
    refresh: string({ message: "Kein refresh Token gefunden" }).min(1, {
      message: "Der Token darf nicht leer sein",
    }),
  }),
});

export const loginSchema = object({
  body: object({
    userName: string({ message: "Bitte gib einen Usernamen ein" }),
    password: string({ message: "Bitte gib ein Passwort ein" }),
  }),
});

export const signUpSchema = object({
  body: object({
    userName: string({ message: "Username muss enthalten sein" })
      .trim()
      .min(3, { message: "Username zu kurz" })
      .max(15, { message: "Username zu lang" })
      .refine((userName) => validator.isAlphanumeric(userName), {
        message: "Username enthält Sonderzeichen!",
      }),
    password: string({ message: "Passwort muss enthalten sein" })
      .trim()
      .max(256)
      .refine((pwd) => validator.isStrongPassword(pwd), {
        message: "Bitte verwende ein starkes Passwort",
      }),
    email: string({ message: "Email muss enthalten sein" }).refine(
      (data) => validator.isEmail(data),
      {
        message: "Das Email-Format ist ungültig",
      }
    ),
    firstName: string({ message: "Vorname muss enthalten sein" })
      .trim()
      .min(2, { message: "Vorname zu kurz" })
      .max(30, { message: "Vorname zu lang" }),
    lastName: string({ message: "Nachname muss enthalten sein" })
      .trim()
      .min(2, { message: "Nachname zu kurz" })
      .max(50, { message: "Nachname zu lang" }),
  }),
});
