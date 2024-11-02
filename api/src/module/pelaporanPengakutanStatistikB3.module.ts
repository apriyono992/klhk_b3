import { Module } from '@nestjs/common';
import { PengangkutanStatistikController } from 'src/controller/pelaporanPengakutanStatistik.controller';
import { PengangkutanStatistikService } from 'src/services/pelaporanPengakutanStatistik.services';
import { PrismaService } from 'src/services/prisma.services';

@Module({
    imports: [],
    controllers: [PengangkutanStatistikController],
    providers: [PengangkutanStatistikService, PrismaService],
})
export class PelaporanPengakutanStatistikB3Module {}