import { Router } from "express";
import { validate } from "../middlewares/validation";
import controllers from "../controllers";
import { getAlbumSchema, postImageSchema } from "../schema/album.schema";

const router = Router();
export default router;

router.post("/", [validate(postImageSchema)], controllers.album.postAddImage);
router.get("/:alId", [validate(getAlbumSchema)], controllers.album.getAlbum);
