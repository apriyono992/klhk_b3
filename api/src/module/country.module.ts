import { Module } from '@nestjs/common';
import { CountryController } from 'src/controller/country.controller';
import { CountryService } from 'src/services/country.service';

import { PrismaService } from 'src/services/prisma.services';
import { AuthModule } from './auth.module';

@Module({
    imports: [AuthModule],
    controllers:[CountryController],
    providers: [PrismaService, CountryService],
    exports: [CountryService], // Export if needed in other modules
})
export class CountryModule {}