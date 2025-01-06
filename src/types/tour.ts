import { Tour } from "@prisma/client";
import {
  deleteSubscriptionSchema,
  deleteTourSchema,
  subscribeSchema,
  tourSchema,
} from "../schema/tour";

type tourSchemaBody = typeof tourSchema.shape.body;
export type tourType = Zod.infer<tourSchemaBody>;

type subscribeSchemaBody = typeof subscribeSchema.shape.body;
export type subscribeType = Zod.infer<subscribeSchemaBody>;

type deleteTourSchemaBody = typeof deleteTourSchema.shape.params;
export type deleteTourType = Zod.infer<deleteTourSchemaBody>;

type deleteTourSubscriptionParams =
  typeof deleteSubscriptionSchema.shape.params;
export type deleteSubscriptionType = Zod.infer<deleteTourSubscriptionParams>;

export type tourDetails = Omit<Tour, "accessCode" | "tourGuide"> & {
  accessCode: string | null;
  tourGuide: string;
  participants:
    | [
        {
          firstName: string;
          lastName: string;
        }
      ]
    | []
    | null;
  participantCount: number;
};

export type loadedTourGuideTours = {
  tId: number;
  accessCode: string;
  name: string;
  startDate: Date;
};
