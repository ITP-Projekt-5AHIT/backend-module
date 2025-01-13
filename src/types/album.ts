import { getAlbumSchema, postImageSchema } from "../schema/album.schema";

type postImageBody = typeof postImageSchema.shape.body;
export type postImageType = Zod.infer<postImageBody>;

type getAlbumParams = typeof getAlbumSchema.shape.params;
export type getAlbumType = Zod.infer<getAlbumParams>;
