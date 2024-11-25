-- AlterTable
ALTER TABLE "PelaporanPenggunaanBahanB3" ADD COLUMN     "no_surat_notifikasi" TEXT,
ADD COLUMN     "no_surat_registrasi" TEXT,
ADD COLUMN     "tujuan_import" TEXT;

-- AlterTable
ALTER TABLE "PelaporanPenggunaanBahanB3Final" ADD COLUMN     "no_surat_notifikasi" TEXT,
ADD COLUMN     "no_surat_registrasi" TEXT,
ADD COLUMN     "tujuan_import" TEXT;
