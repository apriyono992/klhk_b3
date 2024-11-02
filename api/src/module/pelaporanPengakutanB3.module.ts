import { Module } from '@nestjs/common';
import { PelaporanPengangkutanController } from 'src/controller/pelaporanPengakutanB3.controller';
import { PelaporanPengangkutanService } from 'src/services/pelaporanPengakutanB3.services';
import { PrismaService } from 'src/services/prisma.services';
@Module({
    providers: [PrismaService, PelaporanPengangkutanService],
    controllers: [PelaporanPengangkutanController],
})
export class PelaporanPengakutanB3Module {}