-- CreateTable
CREATE TABLE "KewajibanPelaporanPerusahaan" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "jenisLaporan" TEXT NOT NULL,
    "sudahDilaporkan" BOOLEAN NOT NULL DEFAULT false,
    "tanggalBatas" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KewajibanPelaporanPerusahaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KewajibanPelaporanAplikasi" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "sudahDilaporkan" BOOLEAN NOT NULL DEFAULT false,
    "tanggalBatas" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KewajibanPelaporanAplikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KewajibanPelaporanRegistrasi" (
    "id" TEXT NOT NULL,
    "registrasiId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "sudahDilaporkan" BOOLEAN NOT NULL DEFAULT false,
    "tanggalBatas" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KewajibanPelaporanRegistrasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KewajibanPelaporanPerusahaan_companyId_periodId_jenisLapora_key" ON "KewajibanPelaporanPerusahaan"("companyId", "periodId", "jenisLaporan");

-- CreateIndex
CREATE UNIQUE INDEX "KewajibanPelaporanAplikasi_companyId_applicationId_periodId_key" ON "KewajibanPelaporanAplikasi"("companyId", "applicationId", "periodId", "vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "KewajibanPelaporanRegistrasi_registrasiId_companyId_periodI_key" ON "KewajibanPelaporanRegistrasi"("registrasiId", "companyId", "periodId");

-- AddForeignKey
ALTER TABLE "KewajibanPelaporanPerusahaan" ADD CONSTRAINT "KewajibanPelaporanPerusahaan_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KewajibanPelaporanPerusahaan" ADD CONSTRAINT "KewajibanPelaporanPerusahaan_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KewajibanPelaporanAplikasi" ADD CONSTRAINT "KewajibanPelaporanAplikasi_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KewajibanPelaporanAplikasi" ADD CONSTRAINT "KewajibanPelaporanAplikasi_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KewajibanPelaporanAplikasi" ADD CONSTRAINT "KewajibanPelaporanAplikasi_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KewajibanPelaporanAplikasi" ADD CONSTRAINT "KewajibanPelaporanAplikasi_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KewajibanPelaporanRegistrasi" ADD CONSTRAINT "KewajibanPelaporanRegistrasi_registrasiId_fkey" FOREIGN KEY ("registrasiId") REFERENCES "Registrasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KewajibanPelaporanRegistrasi" ADD CONSTRAINT "KewajibanPelaporanRegistrasi_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KewajibanPelaporanRegistrasi" ADD CONSTRAINT "KewajibanPelaporanRegistrasi_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
