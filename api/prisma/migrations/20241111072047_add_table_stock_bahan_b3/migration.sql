/*
  Warnings:

  - The `tipePerusahaan` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "tipePerusahaan",
ADD COLUMN     "tipePerusahaan" TEXT[];

-- CreateTable
CREATE TABLE "DataBahanB3Company" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "dataBahanB3Id" TEXT NOT NULL,
    "stokB3" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DataBahanB3Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StokB3History" (
    "id" TEXT NOT NULL,
    "dataBahanB3CompanyId" TEXT NOT NULL,
    "previousStokB3" DOUBLE PRECISION NOT NULL,
    "newStokB3" DOUBLE PRECISION NOT NULL,
    "changeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StokB3History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StokB3UpdateRequest" (
    "id" TEXT NOT NULL,
    "dataBahanB3CompanyId" TEXT NOT NULL,
    "requestedStokB3" DOUBLE PRECISION NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approvalId" TEXT,

    CONSTRAINT "StokB3UpdateRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StokB3AddRequest" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "dataBahanB3Id" TEXT NOT NULL,
    "requestedStokB3" DOUBLE PRECISION NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approvalId" TEXT,

    CONSTRAINT "StokB3AddRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PelaporanPenggunaanBahanB3" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "dataBahanB3Id" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "tipePembelian" TEXT NOT NULL,
    "jumlahPembelianB3" DOUBLE PRECISION NOT NULL,
    "jumlahB3Digunakan" DOUBLE PRECISION NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PelaporanPenggunaanBahanB3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSupplierOnPelaporanPenggunaanB3" (
    "id" TEXT NOT NULL,
    "pelaporanPenggunaanB3Id" TEXT NOT NULL,
    "dataSupplierId" TEXT NOT NULL,

    CONSTRAINT "DataSupplierOnPelaporanPenggunaanB3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSupplier" (
    "id" TEXT NOT NULL,
    "namaSupplier" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "email" TEXT,
    "telepon" TEXT,
    "fax" TEXT,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "provinceId" TEXT NOT NULL,
    "regencyId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataSupplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PelaporanB3Dihasilkan" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "prosesProduksi" TEXT,
    "dataBahanB3Id" TEXT NOT NULL,
    "jumlahB3Dihasilkan" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PelaporanB3Dihasilkan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataCustomer" (
    "id" TEXT NOT NULL,
    "namaSupplier" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "fax" TEXT,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "provinceId" TEXT NOT NULL,
    "regencyId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataPIC" (
    "id" TEXT NOT NULL,
    "namaPIC" TEXT,
    "jabatan" TEXT,
    "email" TEXT,
    "telepon" TEXT,
    "fax" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataPIC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DataCustomerToDataPIC" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DataPICToDataSupplier" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PelaporanPenggunaanBahanB3_dataBahanB3Id_bulan_tahun_key" ON "PelaporanPenggunaanBahanB3"("dataBahanB3Id", "bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "_DataCustomerToDataPIC_AB_unique" ON "_DataCustomerToDataPIC"("A", "B");

-- CreateIndex
CREATE INDEX "_DataCustomerToDataPIC_B_index" ON "_DataCustomerToDataPIC"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DataPICToDataSupplier_AB_unique" ON "_DataPICToDataSupplier"("A", "B");

-- CreateIndex
CREATE INDEX "_DataPICToDataSupplier_B_index" ON "_DataPICToDataSupplier"("B");

-- AddForeignKey
ALTER TABLE "DataBahanB3Company" ADD CONSTRAINT "DataBahanB3Company_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataBahanB3Company" ADD CONSTRAINT "DataBahanB3Company_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokB3History" ADD CONSTRAINT "StokB3History_dataBahanB3CompanyId_fkey" FOREIGN KEY ("dataBahanB3CompanyId") REFERENCES "DataBahanB3Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokB3UpdateRequest" ADD CONSTRAINT "StokB3UpdateRequest_dataBahanB3CompanyId_fkey" FOREIGN KEY ("dataBahanB3CompanyId") REFERENCES "DataBahanB3Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokB3UpdateRequest" ADD CONSTRAINT "StokB3UpdateRequest_approvalId_fkey" FOREIGN KEY ("approvalId") REFERENCES "Approval"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokB3AddRequest" ADD CONSTRAINT "StokB3AddRequest_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokB3AddRequest" ADD CONSTRAINT "StokB3AddRequest_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokB3AddRequest" ADD CONSTRAINT "StokB3AddRequest_approvalId_fkey" FOREIGN KEY ("approvalId") REFERENCES "Approval"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPenggunaanBahanB3" ADD CONSTRAINT "PelaporanPenggunaanBahanB3_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPenggunaanBahanB3" ADD CONSTRAINT "PelaporanPenggunaanBahanB3_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPenggunaanBahanB3" ADD CONSTRAINT "PelaporanPenggunaanBahanB3_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplierOnPelaporanPenggunaanB3" ADD CONSTRAINT "DataSupplierOnPelaporanPenggunaanB3_pelaporanPenggunaanB3I_fkey" FOREIGN KEY ("pelaporanPenggunaanB3Id") REFERENCES "PelaporanPenggunaanBahanB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplierOnPelaporanPenggunaanB3" ADD CONSTRAINT "DataSupplierOnPelaporanPenggunaanB3_dataSupplierId_fkey" FOREIGN KEY ("dataSupplierId") REFERENCES "DataSupplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplier" ADD CONSTRAINT "DataSupplier_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplier" ADD CONSTRAINT "DataSupplier_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "reg_regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplier" ADD CONSTRAINT "DataSupplier_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "reg_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplier" ADD CONSTRAINT "DataSupplier_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "reg_village"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplier" ADD CONSTRAINT "DataSupplier_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanB3Dihasilkan" ADD CONSTRAINT "PelaporanB3Dihasilkan_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanB3Dihasilkan" ADD CONSTRAINT "PelaporanB3Dihasilkan_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanB3Dihasilkan" ADD CONSTRAINT "PelaporanB3Dihasilkan_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataCustomer" ADD CONSTRAINT "DataCustomer_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataCustomer" ADD CONSTRAINT "DataCustomer_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "reg_regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataCustomer" ADD CONSTRAINT "DataCustomer_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "reg_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataCustomer" ADD CONSTRAINT "DataCustomer_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "reg_village"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataCustomerToDataPIC" ADD CONSTRAINT "_DataCustomerToDataPIC_A_fkey" FOREIGN KEY ("A") REFERENCES "DataCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataCustomerToDataPIC" ADD CONSTRAINT "_DataCustomerToDataPIC_B_fkey" FOREIGN KEY ("B") REFERENCES "DataPIC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataPICToDataSupplier" ADD CONSTRAINT "_DataPICToDataSupplier_A_fkey" FOREIGN KEY ("A") REFERENCES "DataPIC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataPICToDataSupplier" ADD CONSTRAINT "_DataPICToDataSupplier_B_fkey" FOREIGN KEY ("B") REFERENCES "DataSupplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
