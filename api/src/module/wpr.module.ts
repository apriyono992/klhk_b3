import { Module } from '@nestjs/common';
import { Wprontroller } from 'src/controller/wpr.controller';
import { PrismaService } from 'src/services/prisma.services';
import { WprService } from 'src/services/wpr.services';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [Wprontroller],
    providers: [PrismaService, WprService],
    exports: [WprService]
})
export class WprModule {}