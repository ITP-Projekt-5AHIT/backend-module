import { queryLocationSchema } from "../schema/location.schema";

type coordinatesQuery = typeof queryLocationSchema.shape.query;
export type coordinatesType = Zod.infer<coordinatesQuery>;

export type Place = {
  name: string;
  address: string;
  rating?: number;
  types: string[];
  userRatingsTotal?: number;
  openingHours?: boolean;
  latitude: number | undefined;
  longitude: number | undefined;
  image: string | undefined;
};
