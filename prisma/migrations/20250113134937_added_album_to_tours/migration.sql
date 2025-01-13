-- CreateTable
CREATE TABLE "Album" (
    "alId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tId" INTEGER NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("alId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Album_tId_key" ON "Album"("tId");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_tId_fkey" FOREIGN KEY ("tId") REFERENCES "Tour"("tId") ON DELETE CASCADE ON UPDATE CASCADE;
