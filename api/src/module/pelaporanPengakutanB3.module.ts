import { Module } from '@nestjs/common';
import { PelaporanPengangkutanController } from 'src/controller/pelaporanPengakutanB3.controller';
import { PelaporanPengangkutanService } from 'src/services/pelaporanPengakutanB3.services';
import { PrismaService } from 'src/services/prisma.services';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';

@Module({
      imports: [PrismaModule, AuthModule],
    providers: [PrismaService, PelaporanPengangkutanService],
    controllers: [PelaporanPengangkutanController],
})
export class PelaporanPengakutanB3Module {}