import { Module } from '@nestjs/common';
import { UploadController } from '../controller/upload.controller';

import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UploadController],
})
export class UploadModule {}
