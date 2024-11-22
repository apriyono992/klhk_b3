-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "caption" TEXT,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "originalName" TEXT;

-- CreateTable
CREATE TABLE "WilayahPertambanganRakyat" (
    "id" TEXT NOT NULL,
    "sumberData" TEXT,
    "status" TEXT,
    "tahunPengambilan" TIMESTAMP(3) NOT NULL,
    "luasWilayah" DOUBLE PRECISION NOT NULL,
    "locationId" TEXT,
    "polygon" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WilayahPertambanganRakyat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PhotoToWilayahPertambanganRakyat" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PhotoToWilayahPertambanganRakyat_AB_unique" ON "_PhotoToWilayahPertambanganRakyat"("A", "B");

-- CreateIndex
CREATE INDEX "_PhotoToWilayahPertambanganRakyat_B_index" ON "_PhotoToWilayahPertambanganRakyat"("B");

-- AddForeignKey
ALTER TABLE "WilayahPertambanganRakyat" ADD CONSTRAINT "WilayahPertambanganRakyat_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhotoToWilayahPertambanganRakyat" ADD CONSTRAINT "_PhotoToWilayahPertambanganRakyat_A_fkey" FOREIGN KEY ("A") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhotoToWilayahPertambanganRakyat" ADD CONSTRAINT "_PhotoToWilayahPertambanganRakyat_B_fkey" FOREIGN KEY ("B") REFERENCES "WilayahPertambanganRakyat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
