-- AlterTable
ALTER TABLE "BaseSuratNotfikasi" ADD COLUMN     "namaPengirimNotifikasi" TEXT,
ADD COLUMN     "perusaahaanAsal" TEXT;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "tipePerusahaan" TEXT;

-- AlterTable
ALTER TABLE "DocumentRekomendasiB3" ADD COLUMN     "isValidTelaah" BOOLEAN,
ADD COLUMN     "telaahNotes" TEXT;

-- CreateTable
CREATE TABLE "PelaporanPengangkutan" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "periodId" TEXT NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PelaporanPengangkutan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengangkutanDetail" (
    "id" TEXT NOT NULL,
    "pelaporanPengangkutanId" TEXT NOT NULL,
    "b3SubstanceId" TEXT NOT NULL,
    "jumlahB3" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PengangkutanDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerusahaanAsalMuat" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "pengangkutanDetailId" TEXT NOT NULL,
    "namaPerusahaan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "locationType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerusahaanAsalMuat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerusahaanTujuanBongkar" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "pengangkutanDetailId" TEXT NOT NULL,
    "namaPerusahaan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerusahaanTujuanBongkar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "finalizationDeadline" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanPengangkutanFinal" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "perusahaanId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "finalisasiPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalJumlahB3" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LaporanPengangkutanFinal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanPengangkutanFinalDetail" (
    "id" TEXT NOT NULL,
    "laporanPengangkutanFinalId" TEXT NOT NULL,
    "b3SubstanceId" TEXT NOT NULL,
    "jumlahB3" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LaporanPengangkutanFinalDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelaahTeknisRekomendasiB3" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "printed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "kronologi_permohonan" TEXT[],
    "lain_lain" TEXT[],
    "tindak_lanjut" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TelaahTeknisRekomendasiB3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DataPejabatToTelaahTeknisRekomendasiB3" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PelaporanPengangkutan_vehicleId_bulan_tahun_key" ON "PelaporanPengangkutan"("vehicleId", "bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "PengangkutanDetail_b3SubstanceId_pelaporanPengangkutanId_key" ON "PengangkutanDetail"("b3SubstanceId", "pelaporanPengangkutanId");

-- CreateIndex
CREATE UNIQUE INDEX "LaporanPengangkutanFinal_applicationId_perusahaanId_bulan_t_key" ON "LaporanPengangkutanFinal"("applicationId", "perusahaanId", "bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "LaporanPengangkutanFinalDetail_laporanPengangkutanFinalId_b_key" ON "LaporanPengangkutanFinalDetail"("laporanPengangkutanFinalId", "b3SubstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "TelaahTeknisRekomendasiB3_applicationId_key" ON "TelaahTeknisRekomendasiB3"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "_DataPejabatToTelaahTeknisRekomendasiB3_AB_unique" ON "_DataPejabatToTelaahTeknisRekomendasiB3"("A", "B");

-- CreateIndex
CREATE INDEX "_DataPejabatToTelaahTeknisRekomendasiB3_B_index" ON "_DataPejabatToTelaahTeknisRekomendasiB3"("B");

-- AddForeignKey
ALTER TABLE "PelaporanPengangkutan" ADD CONSTRAINT "PelaporanPengangkutan_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPengangkutan" ADD CONSTRAINT "PelaporanPengangkutan_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPengangkutan" ADD CONSTRAINT "PelaporanPengangkutan_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPengangkutan" ADD CONSTRAINT "PelaporanPengangkutan_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengangkutanDetail" ADD CONSTRAINT "PengangkutanDetail_pelaporanPengangkutanId_fkey" FOREIGN KEY ("pelaporanPengangkutanId") REFERENCES "PelaporanPengangkutan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengangkutanDetail" ADD CONSTRAINT "PengangkutanDetail_b3SubstanceId_fkey" FOREIGN KEY ("b3SubstanceId") REFERENCES "B3Substance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanAsalMuat" ADD CONSTRAINT "PerusahaanAsalMuat_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanAsalMuat" ADD CONSTRAINT "PerusahaanAsalMuat_pengangkutanDetailId_fkey" FOREIGN KEY ("pengangkutanDetailId") REFERENCES "PengangkutanDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanTujuanBongkar" ADD CONSTRAINT "PerusahaanTujuanBongkar_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanTujuanBongkar" ADD CONSTRAINT "PerusahaanTujuanBongkar_pengangkutanDetailId_fkey" FOREIGN KEY ("pengangkutanDetailId") REFERENCES "PengangkutanDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanPengangkutanFinal" ADD CONSTRAINT "LaporanPengangkutanFinal_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanPengangkutanFinal" ADD CONSTRAINT "LaporanPengangkutanFinal_perusahaanId_fkey" FOREIGN KEY ("perusahaanId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanPengangkutanFinalDetail" ADD CONSTRAINT "LaporanPengangkutanFinalDetail_laporanPengangkutanFinalId_fkey" FOREIGN KEY ("laporanPengangkutanFinalId") REFERENCES "LaporanPengangkutanFinal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanPengangkutanFinalDetail" ADD CONSTRAINT "LaporanPengangkutanFinalDetail_b3SubstanceId_fkey" FOREIGN KEY ("b3SubstanceId") REFERENCES "B3Substance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelaahTeknisRekomendasiB3" ADD CONSTRAINT "TelaahTeknisRekomendasiB3_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelaahTeknisRekomendasiB3" ADD CONSTRAINT "TelaahTeknisRekomendasiB3_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataPejabatToTelaahTeknisRekomendasiB3" ADD CONSTRAINT "_DataPejabatToTelaahTeknisRekomendasiB3_A_fkey" FOREIGN KEY ("A") REFERENCES "DataPejabat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataPejabatToTelaahTeknisRekomendasiB3" ADD CONSTRAINT "_DataPejabatToTelaahTeknisRekomendasiB3_B_fkey" FOREIGN KEY ("B") REFERENCES "TelaahTeknisRekomendasiB3"("id") ON DELETE CASCADE ON UPDATE CASCADE;
