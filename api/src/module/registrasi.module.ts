import { Module } from '@nestjs/common';
import { RegistrasiServices } from '../services/registrasi.services';
import { RegistrasiController } from '../controller/registrasi.controller';
import { PrismaService } from '../services/prisma.services';
import { BahanB3RegistrasiModule } from './bahanB3Registrasi.module';
import {InswServices} from "../services/insw.services";
import {InswModule} from "./insw.module";
import { BahanB3Module } from './bahanB3.module';

import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [BahanB3RegistrasiModule, PrismaModule, AuthModule],
  controllers: [RegistrasiController],
  providers: [RegistrasiServices, PrismaService],
  exports: [RegistrasiServices],
})
export class RegistrasiModule {}
