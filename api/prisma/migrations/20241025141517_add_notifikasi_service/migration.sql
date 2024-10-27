/*
  Warnings:

  - Added the required column `jenisPermohonan` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DraftSurat" DROP CONSTRAINT "DraftSurat_applicationId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "jenisPermohonan" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DraftSurat" ALTER COLUMN "applicationId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "tanggalDiterima" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3),
    "tanggalPerubahan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referenceNumber" TEXT,
    "negaraAsal" TEXT,
    "dataBahanB3Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exceedsThreshold" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotifikasiStatusHistory" (
    "id" TEXT NOT NULL,
    "notifikasiId" TEXT NOT NULL,
    "notes" TEXT,
    "oldStatus" TEXT,
    "tanggalPerubahan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "newStatus" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT,

    CONSTRAINT "NotifikasiStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaseSuratNotfikasi" (
    "id" TEXT NOT NULL,
    "nomorSurat" TEXT,
    "tanggalSurat" TIMESTAMP(3),
    "tipeSurat" TEXT NOT NULL,
    "kodeDBKlh" TEXT,
    "sifatSurat" TEXT,
    "emailPenerima" TEXT,
    "tanggalPengiriman" TIMESTAMP(3),
    "pejabatId" TEXT,
    "notifikasiId" TEXT,
    "referenceNumber" TEXT,
    "negaraAsal" TEXT,
    "dataBahanB3Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "printed" BOOLEAN NOT NULL DEFAULT false,
    "printedAt" TIMESTAMP(3),

    CONSTRAINT "BaseSuratNotfikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersetujuanImport" (
    "id" TEXT NOT NULL,
    "baseSuratId" TEXT NOT NULL,
    "validitasSurat" TIMESTAMP(3),
    "echaSpecificData" TEXT,
    "point1" TEXT,
    "point2" TEXT,
    "point3" TEXT,
    "point4" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersetujuanImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplicitConsent" (
    "id" TEXT NOT NULL,
    "baseSuratId" TEXT NOT NULL,
    "validitasSurat" TIMESTAMP(3),
    "jenisExplicitConsent" TEXT,
    "point1" TEXT,
    "point2" TEXT,
    "point3" TEXT,
    "point4" TEXT,
    "namaExporter" TEXT,
    "tujuanImport" TEXT,
    "additionalInfo" TEXT,
    "pdfHeaderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExplicitConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KebenaranImport" (
    "id" TEXT NOT NULL,
    "baseSuratId" TEXT NOT NULL,
    "tanggalMaksimalPengiriman" TIMESTAMP(3),
    "point1" TEXT,
    "point2" TEXT,
    "point3" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KebenaranImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PDFHeader" (
    "id" TEXT NOT NULL,
    "header" TEXT,
    "subHeader" TEXT,
    "alamatHeader" TEXT,
    "telp" TEXT,
    "fax" TEXT,
    "kotakPos" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PDFHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplicitConsentDetails" (
    "id" TEXT NOT NULL,
    "explicitConsentId" TEXT NOT NULL,
    "nameOfChemicalSubstance" TEXT,
    "casNumberSubstance" TEXT,
    "nameOfPreparation" TEXT,
    "nameOfChemicalInPreparation" TEXT,
    "concentrationInPreparation" TEXT,
    "casNumberPreparation" TEXT,
    "consentToImport" BOOLEAN,
    "useCategoryPesticide" BOOLEAN,
    "useCategoryIndustrial" BOOLEAN,
    "consentForOtherPreparations" BOOLEAN,
    "allowedConcentrations" TEXT,
    "consentForPureSubstance" BOOLEAN,
    "hasRestrictions" BOOLEAN,
    "restrictionDetails" TEXT,
    "isTimeLimited" BOOLEAN,
    "timeLimitDetails" TIMESTAMP(3),
    "sameTreatment" BOOLEAN,
    "differentTreatmentDetails" TEXT,
    "otherRelevantInformation" TEXT,
    "dnaInstitutionName" TEXT,
    "dnaInstitutionAddress" TEXT,
    "dnaContactName" TEXT,
    "dnaTelephone" TEXT,
    "dnaTelefax" TEXT,
    "dnaEmail" TEXT,
    "dnaDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExplicitConsentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BaseSuratNotfikasiToDataTembusan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_KebenaranImportToPDFHeader" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PDFHeaderToPersetujuanImport" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BaseSuratNotfikasiToDataTembusan_AB_unique" ON "_BaseSuratNotfikasiToDataTembusan"("A", "B");

-- CreateIndex
CREATE INDEX "_BaseSuratNotfikasiToDataTembusan_B_index" ON "_BaseSuratNotfikasiToDataTembusan"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_KebenaranImportToPDFHeader_AB_unique" ON "_KebenaranImportToPDFHeader"("A", "B");

-- CreateIndex
CREATE INDEX "_KebenaranImportToPDFHeader_B_index" ON "_KebenaranImportToPDFHeader"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PDFHeaderToPersetujuanImport_AB_unique" ON "_PDFHeaderToPersetujuanImport"("A", "B");

-- CreateIndex
CREATE INDEX "_PDFHeaderToPersetujuanImport_B_index" ON "_PDFHeaderToPersetujuanImport"("B");

-- AddForeignKey
ALTER TABLE "DraftSurat" ADD CONSTRAINT "DraftSurat_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotifikasiStatusHistory" ADD CONSTRAINT "NotifikasiStatusHistory_notifikasiId_fkey" FOREIGN KEY ("notifikasiId") REFERENCES "Notifikasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaseSuratNotfikasi" ADD CONSTRAINT "BaseSuratNotfikasi_pejabatId_fkey" FOREIGN KEY ("pejabatId") REFERENCES "DataPejabat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaseSuratNotfikasi" ADD CONSTRAINT "BaseSuratNotfikasi_notifikasiId_fkey" FOREIGN KEY ("notifikasiId") REFERENCES "Notifikasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaseSuratNotfikasi" ADD CONSTRAINT "BaseSuratNotfikasi_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersetujuanImport" ADD CONSTRAINT "PersetujuanImport_baseSuratId_fkey" FOREIGN KEY ("baseSuratId") REFERENCES "BaseSuratNotfikasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplicitConsent" ADD CONSTRAINT "ExplicitConsent_baseSuratId_fkey" FOREIGN KEY ("baseSuratId") REFERENCES "BaseSuratNotfikasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplicitConsent" ADD CONSTRAINT "ExplicitConsent_pdfHeaderId_fkey" FOREIGN KEY ("pdfHeaderId") REFERENCES "PDFHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KebenaranImport" ADD CONSTRAINT "KebenaranImport_baseSuratId_fkey" FOREIGN KEY ("baseSuratId") REFERENCES "BaseSuratNotfikasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplicitConsentDetails" ADD CONSTRAINT "ExplicitConsentDetails_explicitConsentId_fkey" FOREIGN KEY ("explicitConsentId") REFERENCES "ExplicitConsent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BaseSuratNotfikasiToDataTembusan" ADD CONSTRAINT "_BaseSuratNotfikasiToDataTembusan_A_fkey" FOREIGN KEY ("A") REFERENCES "BaseSuratNotfikasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BaseSuratNotfikasiToDataTembusan" ADD CONSTRAINT "_BaseSuratNotfikasiToDataTembusan_B_fkey" FOREIGN KEY ("B") REFERENCES "DataTembusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KebenaranImportToPDFHeader" ADD CONSTRAINT "_KebenaranImportToPDFHeader_A_fkey" FOREIGN KEY ("A") REFERENCES "KebenaranImport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KebenaranImportToPDFHeader" ADD CONSTRAINT "_KebenaranImportToPDFHeader_B_fkey" FOREIGN KEY ("B") REFERENCES "PDFHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PDFHeaderToPersetujuanImport" ADD CONSTRAINT "_PDFHeaderToPersetujuanImport_A_fkey" FOREIGN KEY ("A") REFERENCES "PDFHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PDFHeaderToPersetujuanImport" ADD CONSTRAINT "_PDFHeaderToPersetujuanImport_B_fkey" FOREIGN KEY ("B") REFERENCES "PersetujuanImport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
