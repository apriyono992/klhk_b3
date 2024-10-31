-- CreateTable
CREATE TABLE "Registrasi" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "nomor" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "status_izin" TEXT NOT NULL,
    "keterangan_sk" TEXT NOT NULL,
    "tanggal_terbit" TIMESTAMP(3) NOT NULL,
    "berlaku_dari" TIMESTAMP(3) NOT NULL,
    "berlaku_sampai" TIMESTAMP(3) NOT NULL,
    "nomor_notifikasi_impor" TEXT NOT NULL,
    "kode_db_klh_perusahaan" TEXT NOT NULL,
    "nama_perusahaan" TEXT NOT NULL,
    "alamat_perusahaan" TEXT NOT NULL,

    CONSTRAINT "Registrasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DataBahanB3ToRegistrasi" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DataTembusanToRegistrasi" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DataBahanB3ToRegistrasi_AB_unique" ON "_DataBahanB3ToRegistrasi"("A", "B");

-- CreateIndex
CREATE INDEX "_DataBahanB3ToRegistrasi_B_index" ON "_DataBahanB3ToRegistrasi"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DataTembusanToRegistrasi_AB_unique" ON "_DataTembusanToRegistrasi"("A", "B");

-- CreateIndex
CREATE INDEX "_DataTembusanToRegistrasi_B_index" ON "_DataTembusanToRegistrasi"("B");

-- AddForeignKey
ALTER TABLE "Registrasi" ADD CONSTRAINT "Registrasi_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataBahanB3ToRegistrasi" ADD CONSTRAINT "_DataBahanB3ToRegistrasi_A_fkey" FOREIGN KEY ("A") REFERENCES "DataBahanB3"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataBahanB3ToRegistrasi" ADD CONSTRAINT "_DataBahanB3ToRegistrasi_B_fkey" FOREIGN KEY ("B") REFERENCES "Registrasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataTembusanToRegistrasi" ADD CONSTRAINT "_DataTembusanToRegistrasi_A_fkey" FOREIGN KEY ("A") REFERENCES "DataTembusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataTembusanToRegistrasi" ADD CONSTRAINT "_DataTembusanToRegistrasi_B_fkey" FOREIGN KEY ("B") REFERENCES "Registrasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
