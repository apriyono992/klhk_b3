/*
  Warnings:

  - You are about to drop the column `endDate` on the `Period` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Period` table. All the data in the column will be lost.
  - You are about to drop the column `rolesId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endPeriodDate` to the `Period` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endReportingDate` to the `Period` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startPeriodDate` to the `Period` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startReportingDate` to the `Period` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KewajibanPelaporanAplikasi" ADD COLUMN     "bulan" INTEGER,
ADD COLUMN     "tahun" INTEGER;

-- AlterTable
ALTER TABLE "KewajibanPelaporanPerusahaan" ADD COLUMN     "bulan" INTEGER,
ADD COLUMN     "tahun" INTEGER;

-- AlterTable
ALTER TABLE "KewajibanPelaporanRegistrasi" ADD COLUMN     "bulan" INTEGER,
ADD COLUMN     "tahun" INTEGER;

-- AlterTable
ALTER TABLE "PelaporanPenggunaanBahanB3" ADD COLUMN     "registrasiId" TEXT;

-- AlterTable
ALTER TABLE "Period" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "endPeriodDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endReportingDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isReportingActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startPeriodDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startReportingDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rolesId";

-- CreateTable
CREATE TABLE "UserRoles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRoles_userId_roleId_key" ON "UserRoles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_name_key" ON "Roles"("name");

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPenggunaanBahanB3" ADD CONSTRAINT "PelaporanPenggunaanBahanB3_registrasiId_fkey" FOREIGN KEY ("registrasiId") REFERENCES "Registrasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
