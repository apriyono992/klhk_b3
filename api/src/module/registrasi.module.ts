import { Module } from '@nestjs/common';
import { RegistrasiServices } from '../services/registrasi.services';
import { RegistrasiController } from '../controller/registrasi.controller';
import { PrismaService } from '../services/prisma.services';
import { BahanB3Module } from './bahanB3.module';

@Module({
  imports: [BahanB3Module],
  controllers: [RegistrasiController],
  providers: [RegistrasiServices, PrismaService],
  exports: [RegistrasiModule],
})
export class RegistrasiModule {}
