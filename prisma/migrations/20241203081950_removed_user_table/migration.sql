/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TourToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TourToUser" DROP CONSTRAINT "_TourToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TourToUser" DROP CONSTRAINT "_TourToUser_B_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT 'Max',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT 'Mustermann',
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_TourToUser";

-- CreateTable
CREATE TABLE "_joined" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_joined_AB_unique" ON "_joined"("A", "B");

-- CreateIndex
CREATE INDEX "_joined_B_index" ON "_joined"("B");

-- AddForeignKey
ALTER TABLE "_joined" ADD CONSTRAINT "_joined_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("aId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_joined" ADD CONSTRAINT "_joined_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("tId") ON DELETE CASCADE ON UPDATE CASCADE;
