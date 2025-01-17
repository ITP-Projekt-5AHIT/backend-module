-- CreateTable
CREATE TABLE "Attraction" (
    "atId" SERIAL NOT NULL,
    "minAge" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "openingHours" JSONB,
    "website" TEXT NOT NULL,
    "lId" INTEGER NOT NULL,

    CONSTRAINT "Attraction_pkey" PRIMARY KEY ("atId")
);

-- CreateTable
CREATE TABLE "Location" (
    "lId" SERIAL NOT NULL,
    "postCode" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "houseNumber" TEXT,
    "latitude" INTEGER NOT NULL,
    "longtitude" INTEGER NOT NULL,
    "routeDescription" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("lId")
);

-- CreateTable
CREATE TABLE "Checkpoint" (
    "cId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "isMeetingPoint" BOOLEAN NOT NULL,
    "lId" INTEGER NOT NULL,

    CONSTRAINT "Checkpoint_pkey" PRIMARY KEY ("cId")
);

-- CreateTable
CREATE TABLE "_tourAttractions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Attraction_atId_key" ON "Attraction"("atId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_lId_key" ON "Location"("lId");

-- CreateIndex
CREATE UNIQUE INDEX "_tourAttractions_AB_unique" ON "_tourAttractions"("A", "B");

-- CreateIndex
CREATE INDEX "_tourAttractions_B_index" ON "_tourAttractions"("B");

-- AddForeignKey
ALTER TABLE "Attraction" ADD CONSTRAINT "Attraction_lId_fkey" FOREIGN KEY ("lId") REFERENCES "Location"("lId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_lId_fkey" FOREIGN KEY ("lId") REFERENCES "Location"("lId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tourAttractions" ADD CONSTRAINT "_tourAttractions_A_fkey" FOREIGN KEY ("A") REFERENCES "Attraction"("atId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tourAttractions" ADD CONSTRAINT "_tourAttractions_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("tId") ON DELETE CASCADE ON UPDATE CASCADE;
