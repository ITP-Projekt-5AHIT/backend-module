import dotenv from "dotenv";
import { envSchema } from "../schema/env";
dotenv.configDotenv();

const env = envSchema.parse(process.env);

export default env;
