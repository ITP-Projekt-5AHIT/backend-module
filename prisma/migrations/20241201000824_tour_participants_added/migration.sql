-- CreateTable
CREATE TABLE "_TourToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TourToUser_AB_unique" ON "_TourToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TourToUser_B_index" ON "_TourToUser"("B");

-- AddForeignKey
ALTER TABLE "_TourToUser" ADD CONSTRAINT "_TourToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Tour"("tId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourToUser" ADD CONSTRAINT "_TourToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uId") ON DELETE CASCADE ON UPDATE CASCADE;
