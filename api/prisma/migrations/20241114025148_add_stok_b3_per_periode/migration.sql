-- CreateTable
CREATE TABLE "StokB3Periode" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "dataBahanB3Id" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "stokB3" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StokB3Periode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StokB3PeriodeHistory" (
    "id" TEXT NOT NULL,
    "stokB3PeriodeId" TEXT NOT NULL,
    "previousStokB3" DOUBLE PRECISION NOT NULL,
    "newStokB3" DOUBLE PRECISION NOT NULL,
    "changeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StokB3PeriodeHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StokB3Periode_companyId_dataBahanB3Id_bulan_tahun_key" ON "StokB3Periode"("companyId", "dataBahanB3Id", "bulan", "tahun");

-- AddForeignKey
ALTER TABLE "StokB3Periode" ADD CONSTRAINT "StokB3Periode_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokB3Periode" ADD CONSTRAINT "StokB3Periode_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokB3PeriodeHistory" ADD CONSTRAINT "StokB3PeriodeHistory_stokB3PeriodeId_fkey" FOREIGN KEY ("stokB3PeriodeId") REFERENCES "StokB3Periode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
