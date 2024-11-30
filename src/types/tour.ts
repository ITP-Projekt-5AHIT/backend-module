import { tourSchema } from "../schema/tour";

type tourSchemaBody = typeof tourSchema.shape.body;
export type tourType = Zod.infer<tourSchemaBody>;
