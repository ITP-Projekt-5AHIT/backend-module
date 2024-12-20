import { subscribeSchema, tourSchema } from "../schema/tour";

type tourSchemaBody = typeof tourSchema.shape.body;
export type tourType = Zod.infer<tourSchemaBody>;

type subscribeSchemaBody = typeof subscribeSchema.shape.body;
export type subscribeType = Zod.infer<subscribeSchemaBody>;
