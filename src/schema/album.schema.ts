import { coerce, number, object, string } from "zod";

export const postImageSchema = object({
  body: object({
    fileName: string({ message: "Filename muss gegeben sein" })
      .min(10, {
        message: "Filename zu kurz",
      })
      .max(128, { message: "Filename zu lang" }),
    tId: number({ message: "Tour-Id fehlt" })
      .min(0, {
        message: "Tour-Id muss positiv sein",
      })
      .max(Number.MAX_VALUE, "Tour-Id zu groß"),
  }),
});

export const getAlbumSchema = object({
  params: object({
    alId: coerce
      .number({ message: "Album-Id fehlt" })
      .min(0, {
        message: "Album-Id muss positiv sein",
      })
      .max(Number.MAX_VALUE, "Album-Id zu groß"),
  }),
});
