import { Module } from '@nestjs/common';
import { PelaporanPenggunaanBahanB3Controller } from 'src/controller/pelaporanPenggunaanBahanB3.controller';
import { PelaporanPenggunaanBahanB3Service } from 'src/services/pelaporanPenggunaanBahanB3.services';

import { PrismaService } from 'src/services/prisma.services';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';

@Module({
      imports: [PrismaModule, AuthModule],
    providers: [PrismaService, PelaporanPenggunaanBahanB3Service],
    controllers: [PelaporanPenggunaanBahanB3Controller],
})
export class PelaporanPenggunaanB3Module {}