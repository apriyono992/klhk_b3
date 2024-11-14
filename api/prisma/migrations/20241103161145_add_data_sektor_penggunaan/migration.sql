/*
  Warnings:

  - You are about to drop the column `SektorPenggunaanB3` on the `BahanB3Registrasi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BahanB3Registrasi" DROP COLUMN "SektorPenggunaanB3";

-- CreateTable
CREATE TABLE "SektorPenggunaanB3" (
    "id" TEXT NOT NULL,
    "bahanB3RegistrasiId" TEXT NOT NULL,
    "dataSektorPenggunaanId" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "SektorPenggunaanB3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSektorPenggunaanB3" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "DataSektorPenggunaanB3_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SektorPenggunaanB3" ADD CONSTRAINT "SektorPenggunaanB3_bahanB3RegistrasiId_fkey" FOREIGN KEY ("bahanB3RegistrasiId") REFERENCES "BahanB3Registrasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SektorPenggunaanB3" ADD CONSTRAINT "SektorPenggunaanB3_dataSektorPenggunaanId_fkey" FOREIGN KEY ("dataSektorPenggunaanId") REFERENCES "DataSektorPenggunaanB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
