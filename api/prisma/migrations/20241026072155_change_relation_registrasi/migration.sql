/*
  Warnings:

  - You are about to drop the `_DataBahanB3ToRegistrasi` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `registrasiId` to the `B3Substance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DataBahanB3ToRegistrasi" DROP CONSTRAINT "_DataBahanB3ToRegistrasi_A_fkey";

-- DropForeignKey
ALTER TABLE "_DataBahanB3ToRegistrasi" DROP CONSTRAINT "_DataBahanB3ToRegistrasi_B_fkey";

-- AlterTable
ALTER TABLE "B3Substance" ADD COLUMN     "registrasiId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Registrasi" ADD COLUMN     "approval_status" TEXT NOT NULL DEFAULT 'created',
ADD COLUMN     "approved_by" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "_DataBahanB3ToRegistrasi";

-- AddForeignKey
ALTER TABLE "B3Substance" ADD CONSTRAINT "B3Substance_registrasiId_fkey" FOREIGN KEY ("registrasiId") REFERENCES "Registrasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
