import { Module } from '@nestjs/common';
import { PelaporanBahanB3DihasilkanController } from 'src/controller/pelaporanBahanB3Dihasilkan.controller';
import { PelaporanBahanB3DihasilkanService } from 'src/services/pelaporanBahanB3Dihasilkan.services';

import { PrismaService } from 'src/services/prisma.services';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';

@Module({
      imports: [PrismaModule, AuthModule],
    providers: [PrismaService, PelaporanBahanB3DihasilkanService],
    controllers: [PelaporanBahanB3DihasilkanController],
})
export class PelaporanBahanB3DihasilkanModule {}