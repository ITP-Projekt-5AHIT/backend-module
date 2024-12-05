import express, { urlencoded, json } from "express";
import routes from "./routes";
import cors from "cors";
import { convertError, handleError } from "./middlewares/error";
import passport from "passport";
import JwtStrategy from "./middlewares/auth";

const app = express();
export default app;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(passport.initialize());
passport.use(JwtStrategy);
app.use(routes);
app.use(convertError);
app.use(handleError);
