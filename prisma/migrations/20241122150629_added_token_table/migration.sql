-- CreateTable
CREATE TABLE "Token" (
    "tId" SERIAL NOT NULL,
    "exp" BIGINT NOT NULL,
    "iat" BIGINT NOT NULL,
    "sub" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "aId" INTEGER,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("tId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_tId_key" ON "Token"("tId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_aId_fkey" FOREIGN KEY ("aId") REFERENCES "Account"("aId") ON DELETE SET NULL ON UPDATE CASCADE;
