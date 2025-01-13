import { postImageSchema } from "../schema/album.schema";

type postImageBody = typeof postImageSchema.shape.body;
export type postImageType = Zod.infer<postImageBody>;
