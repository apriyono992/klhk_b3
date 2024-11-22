import { Module } from '@nestjs/common';
import { PengangkutanStatistikController } from 'src/controller/pelaporanPengakutanStatistik.controller';
import { PengangkutanStatistikService } from 'src/services/pelaporanPengakutanStatistik.services';
import { PrismaService } from 'src/services/prisma.services';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';


@Module({
      imports: [PrismaModule, AuthModule],
    controllers: [PengangkutanStatistikController],
    providers: [PengangkutanStatistikService, PrismaService],
})
export class PelaporanPengakutanStatistikB3Module {}