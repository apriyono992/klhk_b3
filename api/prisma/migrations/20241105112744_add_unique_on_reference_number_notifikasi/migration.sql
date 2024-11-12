/*
  Warnings:

  - A unique constraint covering the columns `[referenceNumber]` on the table `Notifikasi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notifikasi_referenceNumber_key" ON "Notifikasi"("referenceNumber");
