import { Module } from '@nestjs/common';
import { PdfService } from '../services/pdf.services';  // Shared Prisma service
import { PdfController } from 'src/controller/pdf.controller';

@Module({
  controllers: [PdfController],
  providers: [PdfService],
  exports: [PdfService],  // Export PrismaService for use in other modules
})
export class PDfModule {}