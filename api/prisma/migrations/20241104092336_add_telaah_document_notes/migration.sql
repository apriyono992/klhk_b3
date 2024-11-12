-- CreateTable
CREATE TABLE "TelaahTeknisDocumentNotesRekomendasiB3" (
    "id" TEXT NOT NULL,
    "telaahTeknisRekomendasiB3Id" TEXT NOT NULL,
    "tipeDokumen" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "changedBy" TEXT,

    CONSTRAINT "TelaahTeknisDocumentNotesRekomendasiB3_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TelaahTeknisDocumentNotesRekomendasiB3_telaahTeknisRekomend_key" ON "TelaahTeknisDocumentNotesRekomendasiB3"("telaahTeknisRekomendasiB3Id");

-- CreateIndex
CREATE UNIQUE INDEX "TelaahTeknisDocumentNotesRekomendasiB3_tipeDokumen_key" ON "TelaahTeknisDocumentNotesRekomendasiB3"("tipeDokumen");

-- AddForeignKey
ALTER TABLE "TelaahTeknisDocumentNotesRekomendasiB3" ADD CONSTRAINT "TelaahTeknisDocumentNotesRekomendasiB3_telaahTeknisRekomen_fkey" FOREIGN KEY ("telaahTeknisRekomendasiB3Id") REFERENCES "TelaahTeknisRekomendasiB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelaahTeknisDocumentNotesRekomendasiB3" ADD CONSTRAINT "TelaahTeknisDocumentNotesRekomendasiB3_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
