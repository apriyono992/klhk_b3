import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from '../services/pdf.services';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('PDF')
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('generateRekomendasiB3/:applicationId')
  @ApiOperation({
    summary:
      'Generate a PDF document with header, first content, and lampiran sections',
  })
  @ApiResponse({ status: 200, description: 'PDF generated successfully.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async generatePdf(
    @Param('applicationId') applicationId: string,
    @Res() res: Response,
  ) {
    const pdfBuffer =
      await this.pdfService.generateRekomendasiB3Pdf(applicationId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="document.pdf"', // Inline for opening in a new tab
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Get('generateRegistrasiB3/:registrasiId')
  @ApiOperation({ summary: 'Generate a PDF document for Registrasi B3' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async generateRegistrasiB3(
    @Param('registrasiId') id: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.pdfService.generateRegistrasiB3Pdf(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="document.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Get('generateKebenaranImpor/:referenceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate Surat Kebenaran Impor (Pestisida/Non-Pestisida)',
  })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Notifikasi or DraftSurat not found.' })
  @ApiParam({ name: 'referenceId', description: 'The ID of the Notifikasi to generate the surat for' })
  async generateSuratKebenaranImpor(
    @Param('referenceId') referenceId: string,
    @Res() res: Response,
  ) {
    try {
      // Call the PdfService to generate the PDF
      const pdfBuffer = await this.pdfService.generateKebenaranImporPdf(referenceId);

      // Set the response headers for the PDF
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="surat-kebenaran-impor.pdf"',
        'Content-Length': pdfBuffer.length,
      });

      // Send the PDF back as a response
      res.end(pdfBuffer);
    } catch (error) {
      throw new NotFoundException(`Failed to generate PDF: ${error.message}`);
    }
  }

  @Get('generatePersetujuanImport/:referenceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate Surat Persetujuan Import' })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Permohonan Refence Number not found.' })
  @ApiParam({ name: 'applicationId', description: 'The ID of the Permohonan Rekomendasi to generate the surat for Surat Persetujuan Import' })
  async generatePesetujuanImport(
    @Param('referenceId') referenceId: string,
    @Res() res: Response,
  ) {
    try {
      // Call the PdfService to generate the PDF
      const pdfBuffer = await this.pdfService.generatePersetujuanImportPdf(referenceId);

      // Set the response headers for the PDF
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Persetujuan-Import.pdf"',
        'Content-Length': pdfBuffer.length,
      });

      // Send the PDF back as a response
      res.end(pdfBuffer);
    } catch (error) {
      throw new NotFoundException(`Failed to generate PDF: ${error.message}`);
    }
  }

  @Get('generateExplicitConsent/:referenceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate Surat Telaah Teknis' })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Refence Not Found not found.' })
  @ApiParam({ name: 'applicationId', description: 'The ID of the Permohonan Rekomendasi to generate the surat for Telaah Teknis' })
  async generateExplicitConsent(
    @Param('referenceId') referenceId: string,
    @Res() res: Response,
  ) {
    try {
      // Call the PdfService to generate the PDF
      const pdfBuffer = await this.pdfService.generateExplicitConsentPdf(referenceId);

      // Set the response headers for the PDF
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="explicit consent.pdf"',
        'Content-Length': pdfBuffer.length,
      });

      // Send the PDF back as a response
      res.end(pdfBuffer);
    } catch (error) {
      throw new NotFoundException(`Failed to generate PDF: ${error.message}`);
    }
  }


  @Get('generateTelaahTeknis/:applicationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate Surat Telaah Teknis' })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Permohonan Aplication not found.' })
  @ApiParam({ name: 'applicationId', description: 'The ID of the Permohonan Rekomendasi to generate the surat for Telaah Teknis' })
  async generateTelaahTeknis(
    @Param('applicationId') applicationId: string,
    @Res() res: Response,
  ) {
    try {
      // Call the PdfService to generate the PDF
      const pdfBuffer = await this.pdfService.generateTelaahTeknisPdf(applicationId);

      // Set the response headers for the PDF
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="telaah-teknis.pdf"',
        'Content-Length': pdfBuffer.length,
      });

      // Send the PDF back as a response
      res.end(pdfBuffer);
    } catch (error) {
      throw new NotFoundException(`Failed to generate PDF: ${error.message}`);
    }
  }
}
