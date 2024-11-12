import { Module } from '@nestjs/common';
import { NotifikasiController } from 'src/controller/notifikasi.controller';
import { DraftSuratNotifikasiService } from 'src/services/draftSuratNotifikasi.service';
import { NotifikasiService } from 'src/services/notifikasi.services';
import { PrismaService } from 'src/services/prisma.services';
import { DraftNotifikasiModule } from './draftNotifikasi.module';
import { CountryModule } from './country.module';

@Module({
    imports: [DraftNotifikasiModule, CountryModule],
    providers: [PrismaService, NotifikasiService],
    controllers: [ NotifikasiController],
})
export class NotifikasiModule {}