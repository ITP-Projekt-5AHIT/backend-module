import { tipSchema, verifyTipSchema } from "../schema/tip.schema";

type tipBody = typeof tipSchema.shape.body;
export type tipType = Zod.infer<tipBody>;

type verifyTipBody = typeof verifyTipSchema.shape.body;
export type verifyTipType = Zod.infer<verifyTipBody>;
