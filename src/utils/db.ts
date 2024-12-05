import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export const getHealthCheck = async () => {
  return Promise.resolve(await prismaClient.$queryRaw`SELECT 1`);
};

export default prismaClient;
