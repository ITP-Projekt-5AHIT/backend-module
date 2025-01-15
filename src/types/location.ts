import { queryLocationSchema } from "../schema/location.schema";

type coordinatesQuery = typeof queryLocationSchema.shape.query;
export type coordinatesType = Zod.infer<coordinatesQuery>;
