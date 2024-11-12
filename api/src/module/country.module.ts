import { Module } from '@nestjs/common';
import { CountryController } from 'src/controller/country.controller';
import { CountryService } from 'src/services/country.service';

@Module({
    controllers:[CountryController],
    providers: [CountryService],
    exports: [CountryService], // Export if needed in other modules
})
export class CountryModule {}