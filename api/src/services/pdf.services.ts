import { Injectable, NotFoundException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from './prisma.services';
import { TipeSurat } from 'src/models/enums/tipeSurat';
import { TipeSuratNotifikasi } from 'src/models/enums/tipeSuratNotifikasi';

@Injectable()
export class PdfService {
  constructor(private readonly prisma: PrismaService) {}
  
  async generateRekomendasiB3Pdf(applicationId: string) {
    // Fetch application, company, pejabat, tembusan, and identitasPemohon details
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        company: true,
        draftSurat: {
          include: {
            pejabat: true,
            tembusan: true,
          },
        },
        identitasPemohon: true,  // Include Identitas Pemohon
        vehicles: {
          include: {
            vehicle: true,
          },
        },
        b3Substances: {include: {asalMuatLocations: true, tujuanBongkarLocations: true}},
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
      tembusan: application.draftSurat?.tembusan,
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
    draftSuratId: string
  ) {
    // Fetch the DraftSuratNotifikasi with related data
    const draftSurat = await this.prisma.baseSuratNotfikasi.findUnique({
      where: { id: draftSuratId },
      include: {
        KebenaranImport: true,
        pejabat: true,
        tembusan: true,
        notifikasi: {
          include: {
            dataBahanB3: true,
            company: true,  // Include company details
          },
        },
      },
    });

    if (!draftSurat) {
      throw new NotFoundException(`DraftSuratNotifikasi with ID ${draftSuratId} not found`);
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

    // Render the template with dynamic data
    const renderedHtml = ejs.render(template, {
      base64Image,
      nomorSurat: draftSurat.nomorSurat,
      sifatSurat: draftSurat.sifatSurat,
      pejabat: draftSurat.pejabat,
      company: draftSurat.notifikasi?.company,
      tembusan: draftSurat.tembusan,
      bahanKimia: draftSurat.notifikasi.dataBahanB3Id,
      email: draftSurat.emailPenerima,
      tanggalPengiriman: draftSurat.tanggalPengiriman,
      // Custom points for Kebenaran Import
      customPoint1: draftSurat.KebenaranImport?.[0]?.point1 || '',
      customPoint2: draftSurat.KebenaranImport?.[0]?.point2 || '',
      customPoint3: draftSurat.KebenaranImport?.[0]?.point3 || '',
    });

    // Launch Puppeteer to generate the PDF
    const browser = await puppeteer.launch({ headless: true });
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
      where: { id: draftSuratId },
      data: {
        printed: true,  // Update the 'printed' flag to true
        printedAt: new Date(),  // Set the 'printedAt' timestamp
      },
    });

    return pdfBuffer;
  }

  async generatePersetujuanImportPdf(draftSuratId: string) {
    // Fetch the DraftSuratNotifikasi with related data, including DataBahanB3
    const draftSurat = await this.prisma.baseSuratNotfikasi.findUnique({
      where: { id: draftSuratId },
      include: {
        pejabat: true,
        tembusan: true,
        PersetujuanImport: true,
        notifikasi: {
          include: {
            dataBahanB3: true,  // Include DataBahanB3 to get namaBahanKimia and namaDagang
            company: true,  // Include company details
          },
        },
      },
    });
  
    if (!draftSurat) {
      throw new NotFoundException(`DraftSuratNotifikasi with ID ${draftSuratId} not found`);
    }
  
    // Determine the template path based on the type of Persetujuan Import
    const templatePath = draftSurat.tipeSurat === TipeSuratNotifikasi.EXPLICIT_CONSENT_AND_PERSETUJUAN_ECHA
      ? path.resolve(__dirname, '../pdf/surat-persetujuan-impor-echa.html')
      : path.resolve(__dirname, '../pdf/surat-persetujuan-impor-non-echa.html');
  
    // Load the KLHK logo image and convert it to base64
    const base64Logo = fs.readFileSync(path.resolve(__dirname, '../pdf/logo_klhk.png')).toString('base64');
    const base64Image = `data:image/png;base64,${base64Logo}`;
  
    // Render the template with null-safe checks
    const renderedHtml = ejs.render(templatePath, {
      base64Image,
      nomorSurat: draftSurat.nomorSurat || '',  // Handle nullable field with empty string as default
      sifatSurat: draftSurat.sifatSurat || 'Biasa',  // Default to 'Biasa' if null
      pejabat: draftSurat.pejabat?.nama || 'Pejabat Tidak Diketahui',  // Fallback if pejabat is null
      pejabatNIP: draftSurat.pejabat?.nip || 'NIP Tidak Diketahui',    // Fallback for NIP
      company: draftSurat.notifikasi?.company?.name || 'Company Tidak Diketahui',
      tembusan: draftSurat.tembusan?.map(t => t.nama) || [],
      namaKimia: draftSurat.notifikasi.dataBahanB3?.namaBahanKimia || 'Nama Bahan Kimia Tidak Diketahui',
      namaDagang: draftSurat.notifikasi.dataBahanB3?.namaDagang || 'Nama Dagang Tidak Diketahui',
      tanggalPengiriman: draftSurat.tanggalPengiriman ? draftSurat.tanggalPengiriman.toDateString() : 'Tanggal Pengiriman Tidak Diketahui',
      customPoint1: draftSurat.PersetujuanImport[0]?.point1 || 'Point 1 Tidak Diketahui',
      customPoint2: draftSurat.PersetujuanImport[0]?.point2 || 'Point 2 Tidak Diketahui',
      customPoint3: draftSurat.PersetujuanImport[0]?.point3 || 'Point 3 Tidak Diketahui',
      customPoint4: draftSurat.PersetujuanImport[0]?.point4 || 'Point 4 Tidak Diketahui',
      referenceNumber: draftSurat.notifikasi?.referenceNumber || 'Reference Number Tidak Diketahui',
      negaraAsal: draftSurat.notifikasi?.negaraAsal || 'Negara Asal Tidak Diketahui',
      validUntil: draftSurat.PersetujuanImport[0]?.validitasSurat ? draftSurat.PersetujuanImport[0]?.validitasSurat.toDateString() : 'Validitas Surat Tidak Diketahui',
    });
  
    // Generate the PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: true });
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
  
    return pdfBuffer;
  }
  
   // Generate Explicit Consent PDF (Non ECHA)
   async generateExplicitConsentPdf(draftSuratId: string) {
    // Fetch the DraftSuratNotifikasi with related data, including DataBahanB3, PDFHeader, and Explicit Consent details
    const draftSurat = await this.prisma.baseSuratNotfikasi.findUnique({
      where: { id: draftSuratId },
      include: {
        ExplicitConsent: {include:{
          pdfHeader: true,
        }}, // Fetch Explicit Consent related data
        pejabat: true,         // Include pejabat details
        tembusan: true,        // Include tembusan details
        notifikasi: {
          include: {
            dataBahanB3: true,  // Include DataBahanB3 to get chemical details
            company: true,      // Include company details
          },
        },
      },
    });

    if (!draftSurat) {
      throw new NotFoundException(`DraftSuratNotifikasi with ID ${draftSuratId} not found`);
    }

    // Determine the template path for Explicit Consent Non ECHA
    const templatePath = path.resolve(__dirname, '../pdf/explicit-consent-non-echa.html');

    // Load the KLHK logo image and convert it to base64
    const base64Logo = fs.readFileSync(path.resolve(__dirname, '../pdf/logo_klhk.png')).toString('base64');
    const base64Image = `data:image/png;base64,${base64Logo}`;

    // Read the EJS template
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Render the template with dynamic data (falling back to defaults if null)
    const renderedHtml = ejs.render(template, {
      base64Image,
      // PDF Header fields (from active PDFHeader)
      header: draftSurat.ExplicitConsent[0]?.pdfHeader.header || 'KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN',
      subHeader: draftSurat.ExplicitConsent[0]?.pdfHeader?.subHeader || 'DIREKTORAT JENDERAL PENGELOLAAN SAMPAH, LIMBAH DAN BAHAN BERBAHAYA DAN BERACUN',
      alamatHeader: draftSurat.ExplicitConsent[0]?.pdfHeader?.alamatHeader || 'Gedung Manggala Wanabakti Blok 4 Lantai 5 – Jl. Gatot Subroto, Jakarta 10270',
      telp: draftSurat.ExplicitConsent[0]?.pdfHeader?.telp || '021-5704 501/04 Ext. 4112',
      fax: draftSurat.ExplicitConsent[0]?.pdfHeader?.fax || '021-5790 2750',
      kotakPos: draftSurat.ExplicitConsent[0]?.pdfHeader?.kotakPos || '6505',

      // Content fields from Explicit Consent and Notifikasi
      nomorSurat: draftSurat.nomorSurat || '',
      tanggalSurat: draftSurat.tanggalSurat?.toLocaleDateString() || 'September 2024',
      referenceNumber: draftSurat.referenceNumber || 'Reference Number Tidak Diketahui',
      negaraAsal: draftSurat.negaraAsal || 'Thailand',
      namaKimia: draftSurat.notifikasi?.dataBahanB3?.namaBahanKimia || 'Ethylene Oxide',
      casNumber: draftSurat.notifikasi?.dataBahanB3?.casNumber || '75-21-8',
      namaDagang: draftSurat.notifikasi?.dataBahanB3?.namaDagang || '-',
      namaImporter: draftSurat.notifikasi?.company?.name || 'PT. Samator Tomoe',
      namaExporter: draftSurat.ExplicitConsent[0]?.namaExporter || 'Tomoe Asia Co., Ltd',
      tujuanImport: draftSurat.ExplicitConsent[0]?.tujuanImport || 'Industrial use (Industrial sterilization of medical devices)',
      validUntil: draftSurat.ExplicitConsent[0]?.validitasSurat?.toLocaleDateString() || 'Oktober 31, 2025',

      // Custom points for Explicit Consent
      point1: draftSurat.ExplicitConsent[0]?.point1 || 'Point 1 Tidak Diketahui',
      point2: draftSurat.ExplicitConsent[0]?.point2 || 'Point 2 Tidak Diketahui',
      point3: draftSurat.ExplicitConsent[0]?.point3 || 'Point 3 Tidak Diketahui',
      point4: draftSurat.ExplicitConsent[0]?.point4 || 'Point 4 Tidak Diketahui',

      // Additional info from ExplicitConsent or fallback value
      additionalInfo: draftSurat.ExplicitConsent[0]?.additionalInfo || 'Multilateral Environmental Agreements and Strategies Unit',
      alamat: draftSurat.ExplicitConsent[0]?.additionalInfo || '75/6 Rama VI Road, Ratchathewi, Bangkok, 10400 Thailand',
    });

    // Generate the PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: true });
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
