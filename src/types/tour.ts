import { Tour } from "@prisma/client";
import { subscribeSchema, tourSchema } from "../schema/tour";

type tourSchemaBody = typeof tourSchema.shape.body;
export type tourType = Zod.infer<tourSchemaBody>;

type subscribeSchemaBody = typeof subscribeSchema.shape.body;
export type subscribeType = Zod.infer<subscribeSchemaBody>;

export type tourDetails = Omit<Tour, "accessCode" | "tourGuide"> & {
  accessCode: string | null;
  tourGuide: string;
  participants: [{
    firstName: string;
    lastName: string;
  }] | [] | null;
  participantCount: number;
};

export type loadedTourGuideTours = {
  tId: number;
  accessCode: string;
  name: string;
  startDate: Date;
};
