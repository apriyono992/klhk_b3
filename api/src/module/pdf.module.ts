import { Module } from '@nestjs/common';
import { PdfService } from '../services/pdf.services'; // Shared Prisma service
import { PdfController } from 'src/controller/pdf.controller';
import { PrismaService } from 'src/services/prisma.services';
import { RegistrasiModule } from './registrasi.module';
import { CountryModule } from './country.module';

@Module({
  imports: [RegistrasiModule, CountryModule],
  controllers: [PdfController],
  providers: [PdfService, PrismaService],
  exports: [PdfService], // Export PrismaService for use in other modules
})
export class PDfModule {}
