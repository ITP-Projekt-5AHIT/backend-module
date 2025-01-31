import { coerce, object, string } from "zod";
import { locationSchema } from "./location.schema";

export const deleteCheckpointSchema = object({
  params: object({
    cId: coerce.number({ message: "Checkpoint-ID missing" }),
  }),
});

export const checkpointSchema = object({
  body: object({
    name: string({ message: "Der Name fehlt" })
      .min(2, {
        message: "Name ist zu kurz",
      })
      .max(100, { message: "Name ist zu lang" }),
    description: string({ message: "Die Beschreibung fehlt" })
      .min(10, {
        message: "Beschreibung ist zu kurz",
      })
      .max(1000, { message: "Beschreibung ist zu lang" }),
    time: coerce.date({ message: "Die Treffpunktszeit fehlt" }).optional(),
    isMeetingPoint: coerce
      .boolean({
        message: "Die Angabe, ob es sich um einen Treffpunkt handelt, fehlt",
      })
      .default(true),
    tourId: coerce
      .number({ message: "Die Referenz zur Tour fehlt" })
      .min(0, { message: "PK koennen nicht negativ sein" }),
    locationId: coerce
      .number({ message: "Die Referenz zur Location fehlt" })
      .min(0, { message: "PK koennen nicht negativ sein" })
      .optional(),
    location: locationSchema.optional(),
  })
    .refine((data) => data.isMeetingPoint && data.time, {
      message:
        "Wenn der CP als Treffpunkt gilt, muss eine Zeit angegeben werden",
    })
    .refine((data) => !!data.location || !!data.locationId, {
      message:
        "Es muss entweder eine Location oder eine bestehende ID angegeben sein",
    }),
});
