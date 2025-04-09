-- CreateTable
CREATE TABLE "Payout" (
    "pId" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "aId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("pId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payout_pId_key" ON "Payout"("pId");

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_aId_fkey" FOREIGN KEY ("aId") REFERENCES "Account"("aId") ON DELETE CASCADE ON UPDATE CASCADE;
