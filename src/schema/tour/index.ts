import dayjs from "dayjs";
import { coerce, number, object, string } from "zod";

export const deleteSubscriptionSchema = object({
  params: object({
    tId: coerce.number({ message: "Tour-Id fehlt" }),
  }),
});

export const deleteTourSchema = object({
  body: object({
    tourId: number({ message: "Eine Tourid muss angegeben werden" }).min(
      0,
      "PK muss positiv sein"
    ),
  }),
});

export const subscribeSchema = object({
  body: object({
    accessCode: coerce
      .number({ message: "Der Beitrittscode muss mitgesendet werden" })
      .min(100_000_000, { message: "Der Beitrittscode muss 9 stellig sein" })
      .max(999_999_999, { message: "Der Beitrittscode muss 9 stellig sein" }),
  }),
});

export const tourSchema = object({
  body: object({
    name: string({ message: "Die Tour muss einen Namen besitzen" })
      .min(5, {
        message: "Der Name muss mindestens 5 Zeichen lang sein",
      })
      .max(100, { message: "Der Name darf maximal 100 Zeichen lang sein" }),
    startDate: coerce
      .date({
        message: "Ein Startdatum muss festgelegt werden",
      })
      .refine((date) => dayjs().isBefore(date), {
        message: "Die Tour kann nicht in der Vergangenheit anfangen",
      }),
    endDate: coerce
      .date({
        message: "Ein Enddatum muss festgelegt werden",
      })
      .refine((date) => dayjs().isBefore(date), {
        message: "Die Tour kann nicht in der Vergangenheit aufhören",
      }),
    description: string({
      message: "Die Tour muss eine Beschreibung besitzen",
    })
      .min(10, {
        message: "Die Beschreibung muss mindestens 10 Zeichen lang sein",
      })
      .max(10000, {
        message: "Die Beschreibung darf maximal 10.000 Zeichen lang sein",
      }),
  }).refine(
    (tour) => {
      const begin = dayjs(tour.startDate);
      const end = dayjs(tour.endDate);
      return begin.isBefore(end) && end.diff(begin, "hours") >= 1;
    },
    { message: "Die Tour muss mindestens 1 Stunde dauern" }
  ),
});
