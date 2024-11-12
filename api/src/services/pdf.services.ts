import { Injectable, NotFoundException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from './prisma.services';
import { TipeSurat } from 'src/models/enums/tipeSurat';
import { TipeSuratNotifikasi } from 'src/models/enums/tipeSuratNotifikasi';
import { Test } from '@nestjs/testing';
import { TipeDokumenTelaah } from 'src/models/enums/tipeDokumenTelaah';
import { CountryService } from './country.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class PdfService {
  
  private readonly logger = new Logger(PdfService.name)
  constructor(
    private readonly prisma: PrismaService,
    private readonly countryService: CountryService,
    ) {}
  
  async generateRekomendasiB3Pdf(applicationId: string) {
    // Fetch application, company, pejabat, tembusan, and identitasPemohon details
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        company: true,
        draftSurat: {
          include: {
            pejabat: true,
            PermohonanRekomendasiTembusan: {include: {DataTembusan: true}},
          },
        },
        identitasPemohon: true,  // Include Identitas Pemohon
        vehicles: {
          include:{vehicle:true}
        },
        b3Substances: {include: {dataBahanB3:true, asalMuatLocations: true, tujuanBongkarLocations: true}},
      },
    });
  
    if (!application) {
      throw new NotFoundException(`Application with ID ${applicationId} not found.`);
    }
  
    // Resolve the path to the main EJS template
    const templatePath = path.resolve(__dirname, '../pdf/rekomendasiB3.html');
  
    // Read binary file (logo image) and convert it to base64
    const base64Logo = fs.readFileSync(path.resolve(__dirname, '../pdf/logo_klhk.png')).toString('base64');
    const base64Image = `data:image/png;base64,${base64Logo}`;
    
    // Read the template
    const template = fs.readFileSync(templatePath, 'utf-8');
    // Render the EJS template and pass dynamic data
    const renderedHtml = ejs.render(template, {
      base64Image,
      draftSurat: application.draftSurat,
      company: application.company,
      pejabat: application.draftSurat?.pejabat,
      tembusan: application.draftSurat?.PermohonanRekomendasiTembusan,
      vehicles: application.vehicles.map(v => v.vehicle),
      b3Substances: application.b3Substances,
      identitasPemohon: application.identitasPemohon,  // Pass identitasPemohon to the template
      application,
    }, {
      views: [path.resolve(__dirname, '../pdf')],
    });
  
    const browser = await puppeteer.launch({ headless: 'shell' });
    const page = await browser.newPage();
  
    await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });
  
    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        bottom: '20mm',
        left: '20mm',
        right: '20mm',
      },
    });
  
    await browser.close();
  
    return pdfBuffer;
  }

  async generateRegistrasiB3Pdf() {
    // Resolve the path to the main EJS template
    const templatePath = path.resolve(__dirname, '../pdf/registrasiB3.html');

    // Read binary file (logo image) and convert it to base64
    const base64Logo = fs.readFileSync(path.resolve(__dirname, '../pdf/logo_klhk.png')).toString('base64');
    const base64Image = `data:image/png;base64,${base64Logo}`; // Base64 string for the logo image

    // Read the template
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Render the EJS template and pass the base64 image to the template
    const renderedHtml = ejs.render(template, { base64Image }, {
      views: [path.resolve(__dirname, '../pdf')] // Ensure EJS looks for included files in the pdf folder
    });

    const browser = await puppeteer.launch({headless: 'shell'});
    const page = await browser.newPage();

    await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Ensures that background colors are printed
      margin: {
        bottom: '10mm',
        left: '10mm',
        right: '10mm',
      },
    });

    await browser.close();

    // Return the PDF buffer
    return pdfBuffer;
  }

  // Generate Surat Kebenaran Impor PDF (Pestisida or Non-Pestisida)
  async generateKebenaranImporPdf(
    referenceId: string
  ) {
    // Fetch the DraftSuratNotifikasi with related data
    const draftSurat = await this.prisma.baseSuratNotfikasi.findFirst({
      where: { 
        notifikasi: {
          referenceNumber: referenceId  // Check for a specific reference number in the related notifikasi
        },
        KebenaranImport: {
          some: {}  // Ensure there's at least one related PersetujuanImport
        }
      },
      include: {
        KebenaranImport: true,
        pejabat: true,
        NotifikasiTembusan: {include: { DataTembusan: true }},
        notifikasi: {
          include: {
            dataBahanB3: true,
            company: true,  // Include company details
          },
        },
      },
    });

    if (!draftSurat) {
      throw new NotFoundException(`DraftSuratNotifikasi with ID ${referenceId} not found`);
    }

    // Determine the template path based on the type
    const templatePath = draftSurat.tipeSurat === TipeSuratNotifikasi.KEBENARAN_IMPORT_PESTISIDA
      ? path.resolve(__dirname, '../pdf/surat-kebenaran-impor-pestisida.html')
      : path.resolve(__dirname, '../pdf/surat-kebenaran-impor-non-pestisida.html');

    // Load the KLHK logo image and convert it to base64
    const base64Logo = fs.readFileSync(path.resolve(__dirname, '../pdf/logo_klhk.png')).toString('base64');
    const base64Image = `data:image/png;base64,${base64Logo}`;

    // Read the EJS template
    const template = fs.readFileSync(templatePath, 'utf-8');
    const currentMonth = new Date().toLocaleDateString('id-ID', { month: '2-digit' });
    const currentYear = new Date().getFullYear();
    
    const currentMonthYear = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    const tanggalSurat = draftSurat.tanggalSurat?.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) || currentMonthYear;
    
    const month = draftSurat.tanggalSurat ? draftSurat.tanggalSurat.getMonth() : currentMonth;
    const year = draftSurat.tanggalSurat ? draftSurat.tanggalSurat.getFullYear() : currentYear;
    
    const nomorSurat = `S.${draftSurat.nomorSurat || ''}/PBSLB3-PB3/PPI/PLB.4.4/B/${month}/${year}`;
    // Render the template with dynamic data
    const renderedHtml = ejs.render(template, {
      base64Image,
      draftSurat: draftSurat ?? {},
      nomorSurat: nomorSurat ?? '',
      sifatSurat: draftSurat.sifatSurat ?? '',
      pejabat: draftSurat.pejabat ?? '',
      company: draftSurat.notifikasi?.company ?? '',
      tembusan: draftSurat.NotifikasiTembusan ?? '',
      bahanKimia: draftSurat.notifikasi.dataBahanB3.namaBahanKimia ?? '',
      namaDagang: draftSurat.notifikasi.dataBahanB3.namaDagang ?? '',
      perusahaanAsal : draftSurat.perusaahaanAsal,
      negaraAsal: this.countryService.getCountryByCode2(draftSurat.notifikasi.negaraAsal)?.name?.common ,
      email: draftSurat.emailPenerima ?? '',
      tanggalPengiriman: draftSurat.tanggalPengiriman?.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) ?? '',
      tanggalSurat: tanggalSurat,
      referenceNumber: draftSurat.notifikasi.referenceNumber ?? '',
      // Custom points for Kebenaran Import
      customPoint1: draftSurat.KebenaranImport?.[0]?.point1 || '',
      customPoint2: draftSurat.KebenaranImport?.[0]?.point2 || '',
      customPoint3: draftSurat.KebenaranImport?.[0]?.point3 || '',
    });

    // Launch Puppeteer to generate the PDF
    const browser = await puppeteer.launch({ headless: 'shell' });
    const page = await browser.newPage();

    // Set the content for the PDF generation
    await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        bottom: '20mm',
        left: '20mm',
        right: '20mm',
      },
    });

    await browser.close();

    // Mark the Notifikasi as having generated a Surat Kebenaran Impor and update the printedAt timestamp
    await this.prisma.baseSuratNotfikasi.update({
      where: { id: draftSurat.id },
      data: {
        printed: true,  // Update the 'printed' flag to true
        printedAt: new Date(),  // Set the 'printedAt' timestamp
      },
    });

    return pdfBuffer;
  }

  async generatePersetujuanImportPdf(referenceId: string) {
    // Fetch the DraftSuratNotifikasi with related data, including DataBahanB3
    const draftSurat = await this.prisma.baseSuratNotfikasi.findFirst({
      include: {
        pejabat: true,
        NotifikasiTembusan: {include: {DataTembusan: true}},
        PersetujuanImport: true,
        notifikasi: {
          include: {
            dataBahanB3: true,  // Include DataBahanB3 to get namaBahanKimia and namaDagang
            company: true,  // Include company details
          },
        },
      },
      where: { 
        notifikasi: {
          referenceNumber: referenceId  // Check for a specific reference number in the related notifikasi
        },
        PersetujuanImport: {
          some: {}  // Ensure there's at least one related PersetujuanImport
        }
      },
    });
  
    if (!draftSurat) {
      throw new NotFoundException(`DraftSuratNotifikasi with ID ${referenceId} not found`);
    }
  
    // Determine the template path based on the type of Persetujuan Import
    const templatePath = draftSurat.tipeSurat === TipeSuratNotifikasi.EXPLICIT_CONSENT_AND_PERSETUJUAN_ECHA
      ? path.resolve(__dirname, '../pdf/surat-persetujuan-impor-echa.html')
      : path.resolve(__dirname, '../pdf/surat-persetujuan-impor-non-echa.html');
  
    // Load the KLHK logo image and convert it to base64
    const base64Logo = fs.readFileSync(path.resolve(__dirname, '../pdf/logo_klhk.png')).toString('base64');
    const base64Image = `data:image/png;base64,${base64Logo}`;
    
        // Read the EJS template
    const template = fs.readFileSync(templatePath, 'utf-8');

    const currentMonth = new Date().toLocaleDateString('id-ID', { month: '2-digit' });
    const currentYear = new Date().getFullYear();

    const currentMonthYear = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    const tanggalSurat = draftSurat.tanggalSurat?.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) || currentMonthYear;
    
    const month = draftSurat.tanggalSurat ? draftSurat.tanggalSurat.getMonth() : currentMonth;
    const year = draftSurat.tanggalSurat ? draftSurat.tanggalSurat.getFullYear() : currentYear;

    const nomorSurat = `S.${draftSurat.nomorSurat || ''}/PBSLB3-PB3/PPI/PLB.4.4/B/${month}/${year}`;
  
    // Render the template with null-safe checks
    const renderedHtml = ejs.render(template, {
      base64Image,
      draftSurat: draftSurat ?? {},
      nomorSurat: nomorSurat ?? '',
      tanggalSurat: tanggalSurat,
      sifatSurat: draftSurat.sifatSurat ?? '',
      pejabat: draftSurat.pejabat ?? '',
      company: draftSurat.notifikasi?.company ?? '',
      tembusan: draftSurat.NotifikasiTembusan ?? [],
      bahanKimia: draftSurat.notifikasi.dataBahanB3.namaBahanKimia ?? '',
      email: draftSurat.emailPenerima ?? '',
      tanggalPengiriman: draftSurat.tanggalPengiriman.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) ?? '',
      namaKimia: draftSurat.notifikasi.dataBahanB3?.namaBahanKimia || 'Nama Bahan Kimia Tidak Diketahui',
      namaDagang: draftSurat.notifikasi.dataBahanB3?.namaDagang || 'Nama Dagang Tidak Diketahui',
      customPoint1: draftSurat.PersetujuanImport[0]?.point1 || 'Point 1 Tidak Diketahui',
      customPoint2: draftSurat.PersetujuanImport[0]?.point2 || 'Point 2 Tidak Diketahui',
      customPoint3: draftSurat.PersetujuanImport[0]?.point3 || 'Point 3 Tidak Diketahui',
      customPoint4: draftSurat.PersetujuanImport[0]?.point4 || 'Point 4 Tidak Diketahui',
      referenceNumber: draftSurat.notifikasi?.referenceNumber || 'Reference Number Tidak Diketahui',
      negaraAsal: this.countryService.getCountryByCode2(draftSurat.notifikasi.negaraAsal)?.name?.common || 'Negara Asal Tidak Diketahui',
      validitasSurat: draftSurat.PersetujuanImport[0]?.validitasSurat ? draftSurat.PersetujuanImport[0]?.validitasSurat.toDateString() : 'Validitas Surat Tidak Diketahui',
      regulation: draftSurat.PersetujuanImport[0]?.regulation || 'Regulation Tidak Diketahui',
      nomorSuratKebenaranImport: draftSurat.PersetujuanImport[0]?.nomorSuratKebenaranImport || 'Nomor Surat Kebenaran Import Tidak Diketahui',
      tanggalKebenaranImport: draftSurat.PersetujuanImport[0]?.tanggalKebenaranImport.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) ? draftSurat.PersetujuanImport[0]?.tanggalKebenaranImport.toDateString() : 'Tanggal Kebenaran Import Tidak Diketahui',
      nomorSuratExplicitConsent: draftSurat.PersetujuanImport[0]?.nomorSuratExplicitConsent || 'Nomor Surat Explicit Consent Tidak Diketahui',
      tanggalSuratExplicitConsent: draftSurat.PersetujuanImport[0]?.tanggalSuratExplicitConsent.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) ? draftSurat.PersetujuanImport[0]?.tanggalSuratExplicitConsent.toDateString() : 'Tanggal Explicit Consent Tidak Diketahui', 
      nomorSuratPerusahaanPengimpor: draftSurat.PersetujuanImport[0]?.nomorSuratPerusahaanPengimpor || 'Nomor Surat Perusahaan Pengimpor Tidak Diketahui',
      tanggalDiterimaKebenaranImport: draftSurat.PersetujuanImport[0]?.tanggalDiterimaKebenaranImport.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) ? draftSurat.PersetujuanImport[0]?.tanggalDiterimaKebenaranImport.toDateString() : 'Tanggal Surat Perusahaan Pengimpor Tidak Diketahui',
    });
  
    // Generate the PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: 'shell' });
    const page = await browser.newPage();
  
    // Set the content for the PDF generation
    await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });
  
    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        bottom: '20mm',
        left: '20mm',
        right: '20mm',
      },
    });
  
    await browser.close();

    // Mark the Notifikasi as having generated a Surat Kebenaran Impor and update the printedAt timestamp
    await this.prisma.baseSuratNotfikasi.update({
    where: { id: draftSurat.id },
    data: {
      printed: true,  // Update the 'printed' flag to true
      printedAt: new Date(),  // Set the 'printedAt' timestamp
    },
  });

  
    return pdfBuffer;
  }
  
   // Generate Explicit Consent PDF (Non ECHA)
   async generateExplicitConsentPdf(referenceId: string) {
    // Fetch the DraftSuratNotifikasi with related data, including DataBahanB3, PDFHeader, and Explicit Consent details
    const draftSurat = await this.prisma.baseSuratNotfikasi.findFirst({
      where: { 
        notifikasi: {
          referenceNumber: referenceId  // Check for a specific reference number in the related notifikasi
        },
        ExplicitConsent: {
          some: {}  // Ensure there's at least one related PersetujuanImport
        }
      },
      include: {
        ExplicitConsent: {
          include: {
            pdfHeader: true,
            ExplicitConsentDetails: true,
          }
        }, // Fetch Explicit Consent related data
        pejabat: true,         // Include pejabat details
        NotifikasiTembusan: {include: {DataTembusan: true}},        // Include tembusan details
        notifikasi: {
          include: {
            dataBahanB3: true,  // Include DataBahanB3 to get chemical details
            company: true,      // Include company details
          }
        },
      },
    });

    if (!draftSurat) {
      throw new NotFoundException(`DraftSuratNotifikasi with ID ${referenceId} not found`);
    }

  
    // Determine the template path based on the type of Persetujuan Import
    const templatePath = draftSurat.tipeSurat === TipeSuratNotifikasi.EXPLICIT_CONSENT_AND_PERSETUJUAN_ECHA
      ? path.resolve(__dirname, '../pdf/surat-explicit-consent-echa.html')
      : path.resolve(__dirname, '../pdf/surat-explicit-consent-non-echa.html');
  

    // Load the KLHK logo image and convert it to base64
    const base64Logo = fs.readFileSync(path.resolve(__dirname, '../pdf/logo_klhk.png')).toString('base64');
    const base64Image = `data:image/png;base64,${base64Logo}`;

    // Read the EJS template
    const template = fs.readFileSync(templatePath, 'utf-8');

    const currentMonth = new Date().toLocaleDateString('id-ID', { month: '2-digit' });
    const currentYear = new Date().getFullYear();

    const currentMonthYear = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    const tanggalSurat = draftSurat.tanggalSurat?.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) || currentMonthYear;
    
    const month = draftSurat.tanggalSurat ? draftSurat.tanggalSurat.getMonth() : currentMonth;
    const year = draftSurat.tanggalSurat ? draftSurat.tanggalSurat.getFullYear() : currentYear;

    const nomorSurat = `S.${draftSurat.nomorSurat || ''}/PBSLB3-PB3/PPI/PLB.4.4/B/${month}/${year}`;

    // Render the template with dynamic data (falling back to defaults if null)
    const renderedHtml = ejs.render(template, {
      base64Image,
      draftSurat: draftSurat,
      pejabat: draftSurat.pejabat ?? '',
      company: draftSurat.notifikasi?.company ?? '',
      tembusan: draftSurat.NotifikasiTembusan ?? [],
      bahanKimia: draftSurat.notifikasi.dataBahanB3.namaDagang ?? '',
      email: draftSurat.emailPenerima ?? '',
      tanggalPengiriman: draftSurat.tanggalPengiriman ?? '',
      namaKimia: draftSurat.notifikasi.dataBahanB3?.namaBahanKimia || 'Nama Bahan Kimia Tidak Diketahui',
      namaDagang: draftSurat.notifikasi.dataBahanB3?.namaDagang || 'Nama Dagang Tidak Diketahui',
      // PDF Header fields (from active PDFHeader)
      header: draftSurat.ExplicitConsent[0]?.pdfHeader.header || 'KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN',
      subHeader: draftSurat.ExplicitConsent[0]?.pdfHeader?.subHeader || 'DIREKTORAT JENDERAL PENGELOLAAN SAMPAH, LIMBAH DAN BAHAN BERBAHAYA DAN BERACUN',
      alamatHeader: draftSurat.ExplicitConsent[0]?.pdfHeader?.alamatHeader || 'Gedung Manggala Wanabakti Blok 4 Lantai 5 – Jl. Gatot Subroto, Jakarta 10270',
      telp: draftSurat.ExplicitConsent[0]?.pdfHeader?.telp || '021-5704 501/04 Ext. 4112',
      fax: draftSurat.ExplicitConsent[0]?.pdfHeader?.fax || '021-5790 2750',
      kotakPos: draftSurat.ExplicitConsent[0]?.pdfHeader?.kotakPos || '6505',
      // Content fields from Explicit Consent and Notifikasi
      nomorSurat: nomorSurat || '',
      tanggalSurat: tanggalSurat || 'September 2024',
      referenceNumber: draftSurat.notifikasi.referenceNumber || 'Reference Number Tidak Diketahui',
      negaraAsal: this.countryService.getCountryByCode2(draftSurat.notifikasi.negaraAsal)?.name?.common || 'Tidak Diketahui',
      casNumber: draftSurat.notifikasi?.dataBahanB3?.casNumber || '75-21-8',
      namaImporter: draftSurat.notifikasi?.company?.name || 'PT. Samator Tomoe',
      tujuanSurat : draftSurat.ExplicitConsent[0]?.tujuanSurat || 'Tujuan Surat Tidak Diketahui',  
      namaImpoter : draftSurat.notifikasi.company.name || 'Nama Importer Tidak Diketahui',  
      tujuanPenggunaan : draftSurat.ExplicitConsent[0]?.tujuanPenggunaan || 'Tujuan Penggunaan Tidak Diketahui',  

      namaExporter: draftSurat.ExplicitConsent[0]?.namaExporter || 'Tomoe Asia Co., Ltd',
      tujuanImport: draftSurat.ExplicitConsent[0]?.tujuanImport || 'Industrial use (Industrial sterilization of medical devices)',
      validUntil: draftSurat.ExplicitConsent[0]?.validitasSurat?.toLocaleDateString() || 'Oktober 31, 2025',

      // Custom points for Explicit Consent
      point1: draftSurat.ExplicitConsent[0]?.point1 || 'Point 1 Tidak Diketahui',
      point2: draftSurat.ExplicitConsent[0]?.point2 || 'Point 2 Tidak Diketahui',
      point3: draftSurat.ExplicitConsent[0]?.point3 || 'Point 3 Tidak Diketahui',
      point4: draftSurat.ExplicitConsent[0]?.point4 || 'Point 4 Tidak Diketahui',

      nameOfChemicalSubstance: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.nameOfChemicalSubstance || 'Name Chemical Substance Tidak Diketahui',
      casNumberSubstance: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.casNumberSubstance || 'CAS Number Tidak Diketahui',
      nameOfPreparation: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.nameOfPreparation || 'Name Preparation Tidak Diketahui',
      nameOfChemicalInPreparation: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.nameOfChemicalInPreparation || 'Name Chemical in Preparation Tidak Diketahui',
      concentrationInPreparation: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.concentrationInPreparation || 'Concentration in Preparation Tidak Diketahui',
      casNumberPreparation: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.casNumberPreparation || 'CAS Number Preparation Tidak Diketahui',
      consentToImport: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.consentToImport || 'Consent to Import Tidak Diketahui',
      useCategoryPesticide: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.useCategoryPesticide || false,
      useCategoryIndustrial: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.useCategoryIndustrial || false,
      consentForOtherPreparations: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.consentForOtherPreparations || false,
      allowedConcentrations: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.allowedConcentrations || false,
      consentForPureSubstance: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.consentForPureSubstance || false,
      hasRestrictions: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.hasRestrictions || false,
      restrictionDetails: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.restrictionDetails || undefined,
      isTimeLimited: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.isTimeLimited || false,
      timeLimitDetails: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.timeLimitDetails?.toLocaleDateString() || undefined,
      sameTreatment: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.sameTreatment || false,
      differentTreatmentDetails: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.differentTreatmentDetails || undefined,
      otherRelevantInformation: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.otherRelevantInformation || undefined,
      dnaInstitutionName: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaInstitutionName || undefined,
      dnaInstitutionAddress: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaInstitutionAddress || undefined,
      dnaContactName: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaContactName || undefined,
      dnaTelephone: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaTelephone || undefined,
      dnaTelefax: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaTelefax || undefined,
      dnaEmail: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaEmail
      ? draftSurat.ExplicitConsent[0].ExplicitConsentDetails[0].dnaEmail.join(', ')
      : undefined,
      dnaDate: draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaDate ? draftSurat.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaDate.toLocaleDateString() : undefined,
    });

    // Generate the PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: 'shell' });
    const page = await browser.newPage();

    await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        bottom: '20mm',
        left: '20mm',
        right: '20mm',
      },
    });

    await browser.close();

     // Mark the Notifikasi as having generated a Surat Kebenaran Impor and update the printedAt timestamp
     await this.prisma.baseSuratNotfikasi.update({
      where: { id: draftSurat.id },
      data: {
        printed: true,  // Update the 'printed' flag to true
        printedAt: new Date(),  // Set the 'printedAt' timestamp
      },
    });


    return pdfBuffer;
  }
  
  async generateTelaahTeknisPdf(applicationId: string) {
    // Fetch data from TelaahTeknisRekomendasiB3 with related Application, Company, and Pejabat
    const telaahTeknis = await this.prisma.telaahTeknisRekomendasiB3.findFirst({
      where: { applicationId: applicationId },
      include: {
        application: {
          include: { 
            company: true,
            vehicles:{ include:{vehicle:true}},
            b3Substances: {include: {asalMuatLocations: true, tujuanBongkarLocations: true, dataBahanB3:true}},
           },
        },
        TelaahTeknisDocumentNotesRekomendasiB3:true,
        TelaahTeknisPejabat: {include:{ DataPejabat:true}},  // Include DataPejabat array
      },
    });

    if (telaahTeknis == undefined) {
      throw new NotFoundException(`Telaah Teknis with application ID ${applicationId} not found.`);
    }

    // Define the path to the HTML template file
    const templatePath = path.resolve(__dirname, '../pdf/surat-telaah-teknis-rekomendasiB3.html');

    // Load the logo image and convert it to base64 for embedding
    const base64Logo = fs.readFileSync(path.resolve(__dirname, '../pdf/logo_klhk.png')).toString('base64');
    const base64Image = `data:image/png;base64,${base64Logo}`;

    // Render the HTML template with dynamic data
    const template = fs.readFileSync(templatePath, 'utf-8');
    const renderedHtml = ejs.render(template, {
      base64Image,
      application: telaahTeknis.application,
      company: telaahTeknis.application.company,
      notes: telaahTeknis.notes,
      kronologiPermohonan: telaahTeknis.kronologi_permohonan,
      lainLain: telaahTeknis.lain_lain,
      tindakLanjut: telaahTeknis.tindak_lanjut,
      pejabat: telaahTeknis.TelaahTeknisPejabat?.map((pejabat) => pejabat.DataPejabat),  // Pass the DataPejabat array to the template
      documentRekomendasiB3: telaahTeknis.TelaahTeknisDocumentNotesRekomendasiB3,  // Pass the DataPejabat array to the template
      b3Substances: telaahTeknis.application.b3Substances,
      vehicles : telaahTeknis.application.vehicles.map(v => v.vehicle),
    });

    // Launch Puppeteer and generate the PDF
    const browser = await puppeteer.launch({ headless: 'shell' });
    const page = await browser.newPage();
    await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        bottom: '20mm',
        left: '20mm',
        right: '20mm',
      },
    });

    await browser.close();
    return pdfBuffer;
  }
}
