import { tipSchema } from "../schema/tip.schema";

type tipBody = typeof tipSchema.shape.body;
export type tipType = Zod.infer<tipBody>;