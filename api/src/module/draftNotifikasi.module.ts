import { Module } from '@nestjs/common';
import { DraftSuratNotifikasiController } from 'src/controller/draftSuratNotfikasi.controller';
import { NotifikasiController } from 'src/controller/notifikasi.controller';
import { DraftSuratNotifikasiService } from 'src/services/draftSuratNotifikasi.service';
import { NotifikasiService } from 'src/services/notifikasi.services';
import { PrismaService } from 'src/services/prisma.services';

@Module({
    providers: [PrismaService, DraftSuratNotifikasiService],
    controllers: [DraftSuratNotifikasiController],
    exports: [DraftSuratNotifikasiService]
})
export class DraftNotifikasiModule {}