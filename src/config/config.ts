import dotenv from "dotenv";
import { envSchema } from "../schema/env.schema";
dotenv.configDotenv();

const env = envSchema.parse(process.env);

export default env;
