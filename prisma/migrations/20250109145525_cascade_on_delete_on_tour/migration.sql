-- DropForeignKey
ALTER TABLE "Checkpoint" DROP CONSTRAINT "Checkpoint_tourId_fkey";

-- DropForeignKey
ALTER TABLE "Tour" DROP CONSTRAINT "Tour_tourGuide_fkey";

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_tourGuide_fkey" FOREIGN KEY ("tourGuide") REFERENCES "Account"("aId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("tId") ON DELETE CASCADE ON UPDATE CASCADE;
