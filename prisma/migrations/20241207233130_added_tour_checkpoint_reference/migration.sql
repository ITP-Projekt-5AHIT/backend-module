/*
  Warnings:

  - Added the required column `tourId` to the `Checkpoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Checkpoint" ADD COLUMN     "tourId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("tId") ON DELETE RESTRICT ON UPDATE CASCADE;
