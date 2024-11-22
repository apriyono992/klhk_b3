import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services';
import { InswServices } from '../services/insw.services';
import { HttpModule, HttpService } from '@nestjs/axios';
import { InswController } from '../controller/insw.controller';
import {RegistrasiModule} from "./registrasi.module";
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';


@Module({
  imports: [HttpModule, RegistrasiModule, PrismaModule, AuthModule],
  controllers: [InswController],
  providers: [InswServices, PrismaService],
})
export class InswModule {}
