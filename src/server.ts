import express, { json, urlencoded } from "express";
import router from "./routes";
import cors from "cors";
import { handleError } from "./middlewares/error";

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(router);
app.use(handleError);

export default app;
