/**
 * postCode         Int
  country          String
  street           String
  houseNumber      String?
  latitude         Int
  longtitude       Int
  routeDescription String?
 */

import { coerce, number, object, string } from "zod";

export const locationSchema = object({
  postCode: number({ message: "Die PLZ fehlt" })
    .min(0, { message: "Die PLZ muss positiv sein" }),
  country: string({ message: "Das Land fehlt" }).max(255, {
    message: "Maximale Länge überschritten",
  }),
  street: string({ message: "Die Straße fehlt" }).max(255, {
    message: "Maximale Länge überschritten",
  }),
  houseNumber: string({ message: "Die Hausnummer fehlt" }).max(20, {
    message: "Maximale Länge überschritten",
  }),
  latitude: number({ message: "Die Latitude fehlt" })
    .min(-90, { message: "Minimaler Wert liegt bei -90" })
    .max(90, { message: "Maximaler Wert liegt bei +90" }),
  longtitude: number({ message: "Der Lontitude fehlt" })
    .min(-180, { message: "Minimaler Wert liegt bei -180" })
    .max(180, { message: "Maximaler Wert liegt bei +180" }),
});
