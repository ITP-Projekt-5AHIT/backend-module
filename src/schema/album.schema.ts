import { coerce, number, object, string } from "zod";

export const postImageSchema = object({
  body: object({
    fileName: string({ message: "Filename muss gegeben sein" })
      .min(10, {
        message: "Filename zu kurz",
      })
      .max(128, { message: "Filename zu lang" }),
    tId: number({ message: "Tour-ID fehlt" })
      .min(0, {
        message: "Tour-ID muss positiv sein",
      })
      .max(Number.MAX_VALUE, "Tour-ID zu groß"),
  }),
});
