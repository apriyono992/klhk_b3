/*
  Warnings:

  - A unique constraint covering the columns `[telaahTeknisRekomendasiB3Id,tipeDokumen]` on the table `TelaahTeknisDocumentNotesRekomendasiB3` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TelaahTeknisDocumentNotesRekomendasiB3_telaahTeknisRekomend_key";

-- DropIndex
DROP INDEX "TelaahTeknisDocumentNotesRekomendasiB3_tipeDokumen_key";

-- CreateIndex
CREATE UNIQUE INDEX "TelaahTeknisDocumentNotesRekomendasiB3_telaahTeknisRekomend_key" ON "TelaahTeknisDocumentNotesRekomendasiB3"("telaahTeknisRekomendasiB3Id", "tipeDokumen");
