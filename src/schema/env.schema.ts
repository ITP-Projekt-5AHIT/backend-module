import zod, { array, coerce, object, string } from "zod";

export const envSchema = object({
  PORT: coerce.number({ message: "Bitte gib einen PORT an" }),
  SALT: coerce.number({ message: "Ein Salt muss in der .env stehen" }),
  REFRESH_EXP_DAYS: coerce.number({
    message: "Die Ablaufzeit des refresh tokens muss angegeben werden",
  }),
  ACCESS_EXP_MINS: coerce.number({
    message: "Die Ablaufzeit des access tokens muss angegeben werden",
  }),
  PWD_RESET_EXP_MINS: coerce.number({
    message: "Die Ablaufzeit des password reset tokens muss angegeben werden",
  }),
  JWT_SECRET: string({ message: "Ein JWT Secret Key muss angegeben werden" }),
  EMAIL_HOST: string({ message: "Email Host fehlt" }),
  EMAIL_FROM_ADDRESS: string({ message: "Email from adress fehlt" }),
  EMAIL_PASSWORD: string({ message: "Email passwort fehlt" }),
  DATABASE_URL: string({ message: "Datenbank URL fehlt" }),
  EMAIL_PORT: coerce.number({ message: "Email Port muss angegeben werden" }),
  NODE_ENV: zod.enum(["production", "development"], {
    message: "NODE_ENV muss angegeben sein",
  }),
  MAPS_API: string({ message: "Maps-API-KEY fehlt" }),
});
