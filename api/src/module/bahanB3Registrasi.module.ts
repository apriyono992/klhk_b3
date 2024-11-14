import { Module } from '@nestjs/common';
import { BahanB3RegistrasiController } from '../controller/bahanB3Registrasi.controller';
import { PrismaService } from '../services/prisma.services';
import { BahanB3RegistrasiService } from '../services/bahanB3Registrasi.services';

@Module({
  controllers: [BahanB3RegistrasiController],
  providers: [PrismaService, BahanB3RegistrasiService],
  exports: [BahanB3RegistrasiService],
})
export class BahanB3RegistrasiModule {}
