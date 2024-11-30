-- CreateTable
CREATE TABLE "Tour" (
    "tId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "tourGuide" INTEGER NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("tId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tour_tId_key" ON "Tour"("tId");

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_tourGuide_fkey" FOREIGN KEY ("tourGuide") REFERENCES "Account"("aId") ON DELETE RESTRICT ON UPDATE CASCADE;
