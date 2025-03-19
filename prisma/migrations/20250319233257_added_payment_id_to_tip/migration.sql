/*
  Warnings:

  - Added the required column `paymentId` to the `Tip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tip" ADD COLUMN     "paymentId" TEXT NOT NULL;
