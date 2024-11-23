/*
  Warnings:

  - You are about to drop the column `pejabat_id` on the `Registrasi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Registrasi" DROP COLUMN "pejabat_id",
ADD COLUMN     "pejabatId" TEXT;

-- AddForeignKey
ALTER TABLE "Registrasi" ADD CONSTRAINT "Registrasi_pejabatId_fkey" FOREIGN KEY ("pejabatId") REFERENCES "DataPejabat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
