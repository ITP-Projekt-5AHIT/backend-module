import express, { urlencoded, json } from "express";
import routes from "./routes";
import cors from "cors";
import { handleError } from "./middlewares/error";

const app = express();
export default app;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(routes);
app.use(handleError);
