import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from '../services/pdf.services';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('PDF')
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('generateRekomendasiB3/:applicationId')
  @ApiOperation({ summary: 'Generate a PDF document with header, first content, and lampiran sections' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async generatePdf(@Param('applicationId') applicationId: string, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.generateRekomendasiB3Pdf(applicationId);
  
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="document.pdf"',  // Inline for opening in a new tab
      'Content-Length': pdfBuffer.length,
    });
  
    res.end(pdfBuffer);
  }  
  
  @Get('generateRegistrasiB3')
  @ApiOperation({ summary: 'Generate a PDF document for Registrasi B3' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async generateRegistrasiB3(@Res() res: Response) {
    const pdfBuffer = await this.pdfService.generateRegistrasiB3Pdf();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="document.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
