/*
  Warnings:

  - A unique constraint covering the columns `[accessCode]` on the table `Tour` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessCode` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "accessCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tour_accessCode_key" ON "Tour"("accessCode");
