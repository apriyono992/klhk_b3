import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services';
import { InswServices } from '../services/insw.services';
import { HttpModule, HttpService } from '@nestjs/axios';
import { InswController } from '../controller/insw.controller';
import {RegistrasiModule} from "./registrasi.module";

@Module({
  imports: [HttpModule, RegistrasiModule],
  controllers: [InswController],
  providers: [InswServices, PrismaService],
})
export class InswModule {}
