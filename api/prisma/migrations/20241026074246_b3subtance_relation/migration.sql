-- DropForeignKey
ALTER TABLE "B3Substance" DROP CONSTRAINT "B3Substance_registrasiId_fkey";

-- AlterTable
ALTER TABLE "B3Substance" ALTER COLUMN "registrasiId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "B3Substance" ADD CONSTRAINT "B3Substance_registrasiId_fkey" FOREIGN KEY ("registrasiId") REFERENCES "Registrasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
