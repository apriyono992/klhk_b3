/*
  Warnings:

  - You are about to drop the column `asalMuat` on the `B3Substance` table. All the data in the column will be lost.
  - You are about to drop the column `tujuanBongkar` on the `B3Substance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "B3Substance" DROP COLUMN "asalMuat",
DROP COLUMN "tujuanBongkar";

-- CreateTable
CREATE TABLE "LocationDetails" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "b3SubstanceIdAsalMuat" TEXT,
    "b3SubstanceIdTujuanBongkar" TEXT,
    "locationType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "AsalMuatForeignKey" FOREIGN KEY ("b3SubstanceIdAsalMuat") REFERENCES "B3Substance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "TujuanBongkarForeignKey" FOREIGN KEY ("b3SubstanceIdTujuanBongkar") REFERENCES "B3Substance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
