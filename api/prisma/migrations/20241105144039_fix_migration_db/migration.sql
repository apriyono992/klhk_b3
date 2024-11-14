/*
  Warnings:

  - You are about to drop the column `dataSektorPenggunaanId` on the `SektorPenggunaanB3` table. All the data in the column will be lost.
  - You are about to drop the `DataSektorPenggunaanB3` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `SektorPenggunaanB3` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SektorPenggunaanB3" DROP CONSTRAINT "SektorPenggunaanB3_dataSektorPenggunaanId_fkey";

-- AlterTable
ALTER TABLE "Registrasi" ADD COLUMN     "jabatan_pengurus" TEXT,
ADD COLUMN     "nama_pengurus" TEXT,
ADD COLUMN     "tanggal_pengajuan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SektorPenggunaanB3" DROP COLUMN "dataSektorPenggunaanId",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "DataSektorPenggunaanB3";
