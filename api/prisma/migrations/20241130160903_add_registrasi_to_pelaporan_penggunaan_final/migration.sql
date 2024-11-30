-- AlterTable
ALTER TABLE "PelaporanPenggunaanBahanB3Final" ADD COLUMN     "registrasiId" TEXT;

-- AddForeignKey
ALTER TABLE "PelaporanPenggunaanBahanB3Final" ADD CONSTRAINT "PelaporanPenggunaanBahanB3Final_registrasiId_fkey" FOREIGN KEY ("registrasiId") REFERENCES "Registrasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
