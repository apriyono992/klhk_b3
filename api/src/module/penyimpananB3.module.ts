import { Module } from '@nestjs/common';
import { PenyimpananB3Controller } from 'src/controller/penyimpananB3.controller';
import { PenyimpananB3Service } from 'src/services/penyimpananB3.service';
import { PrismaService } from 'src/services/prisma.services';

@Module({
    imports: [],
    controllers: [PenyimpananB3Controller],
    providers: [PrismaService, PenyimpananB3Service],
    exports: [PenyimpananB3Service]
})
export class PenyimpananB3Module {}