-- AlterTable
ALTER TABLE "Registrasi" ALTER COLUMN "status_izin" DROP NOT NULL,
ALTER COLUMN "keterangan_sk" DROP NOT NULL,
ALTER COLUMN "tanggal_terbit" DROP NOT NULL,
ALTER COLUMN "berlaku_dari" DROP NOT NULL,
ALTER COLUMN "berlaku_sampai" DROP NOT NULL,
ALTER COLUMN "nomor_notifikasi_impor" DROP NOT NULL,
ALTER COLUMN "kode_db_klh_perusahaan" DROP NOT NULL,
ALTER COLUMN "nama_perusahaan" DROP NOT NULL,
ALTER COLUMN "alamat_perusahaan" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "bulan" DROP NOT NULL;
