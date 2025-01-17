import { checkpointSchema } from "../schema/checkpoint.schema";

type checkPointBody = typeof checkpointSchema.shape.body;
export type checkPointType = Zod.infer<checkPointBody>;
