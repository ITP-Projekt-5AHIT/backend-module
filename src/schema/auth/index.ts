import { coerce, object, string } from "zod";
import validator from "validator";

export const requestPasswordResetSchema = object({
  params: object({
    userName: string({ message: "Bitte gib einen Usernamen ein" }),
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
    email: string({ message: "Email muss enthalten sein" })
      .trim()
      .email({ message: "Ungültige Email-Adresse" })
      .max(128, { message: "Maximal 128 Zeichen erlaubt" }),
    dateOfBirth: coerce.date({
      message: "Bitte gib das Datum im gültigen Format ein",
    }),
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
