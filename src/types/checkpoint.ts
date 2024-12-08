import { checkpointSchema } from "../schema/checkpoint";

type checkPointBody = typeof checkpointSchema.shape.body;
export type checkPointType = Zod.infer<checkPointBody>;
