import { Module } from '@nestjs/common';
import { PelaporanBahanB3DistribusiController } from 'src/controller/pelaporanDistribusiBahanB3.controller';
import { PelaporanDistribusiBahanB3Service } from 'src/services/pelaporanDistribusiBahanB3.services';

import { PrismaService } from 'src/services/prisma.services';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';

@Module({
      imports: [PrismaModule, AuthModule],
    providers: [PrismaService,PelaporanDistribusiBahanB3Service ],
    controllers: [PelaporanBahanB3DistribusiController],
})
export class PelaporanDistribusiBahanB3Module {}