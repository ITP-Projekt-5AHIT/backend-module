import { PrismaPromise } from "@prisma/client/runtime/library";
import db from "./db";

const runTransact = async (...promise: PrismaPromise<any>[]) => {
  return await db.$transaction(promise);
};
