/*
  Warnings:

  - A unique constraint covering the columns `[companyId,dataBahanB3Id]` on the table `DataBahanB3Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DataBahanB3Company_companyId_dataBahanB3Id_key" ON "DataBahanB3Company"("companyId", "dataBahanB3Id");
