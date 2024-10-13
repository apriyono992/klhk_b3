import { Module } from '@nestjs/common';
import { PermohonanRekomendasiB3Controller } from 'src/controller/permohonanRekom.controller';
import { PermohonanRekomendasiB3Service } from 'src/services/permohonanRekom.services';
import { PrismaService } from 'src/services/prisma.services';

@Module({
  controllers: [PermohonanRekomendasiB3Controller],
  providers: [PermohonanRekomendasiB3Service, PrismaService],
  exports: [PermohonanRekomendasiB3Service],  // Export PrismaService for use in other modules
})
export class PermohonanRekomendasiB3Module {}