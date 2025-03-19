-- CreateTable
CREATE TABLE "Tip" (
    "tId" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "fromAId" INTEGER NOT NULL,
    "toAId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("tId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tip_tId_key" ON "Tip"("tId");

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_fromAId_fkey" FOREIGN KEY ("fromAId") REFERENCES "Account"("aId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_toAId_fkey" FOREIGN KEY ("toAId") REFERENCES "Account"("aId") ON DELETE RESTRICT ON UPDATE CASCADE;
