import { Module } from '@nestjs/common';
import { PeriodController } from 'src/controller/period.controller';
import { PeriodService } from 'src/services/period.services';
import { PrismaService } from 'src/services/prisma.services';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';


@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [PeriodController],
    providers: [PrismaService, PeriodService],
    exports: [PeriodService]
})
export class PeriodModule {}