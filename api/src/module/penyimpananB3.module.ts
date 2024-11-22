import { Module } from '@nestjs/common';
import { PenyimpananB3Controller } from 'src/controller/penyimpananB3.controller';
import { PenyimpananB3Service } from 'src/services/penyimpananB3.service';
import { PrismaService } from 'src/services/prisma.services';

import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [PenyimpananB3Controller],
    providers: [PrismaService, PenyimpananB3Service],
    exports: [PenyimpananB3Service]
})
export class PenyimpananB3Module {}