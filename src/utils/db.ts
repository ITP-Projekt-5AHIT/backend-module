import { PrismaClient } from "@prisma/client";
import ApiError from "./apiError";
import { INTERNAL_SERVER_ERROR } from "http-status";

const prismaClient = new PrismaClient();

export const getHealthCheck = async () => {
  return Promise.resolve(await prismaClient.$queryRaw`SELECT 1`);
};

export const generateAccessCode = async (n: number = 0): Promise<number> => {
  const min = 100_000_000;
  const max = 999_999_999;

  const error = new ApiError(
    INTERNAL_SERVER_ERROR,
    "Could not generate a key for Tour.accessCode"
  );
  
  if (n < 100) {
    const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
    const existingRecord = await prismaClient.tour.findUnique({
      where: { accessCode: String(randomId) },
    });
    if (!existingRecord) return randomId;
    setImmediate(generateAccessCode.bind(n + 1));
  }
  throw error;
};

export default prismaClient;
