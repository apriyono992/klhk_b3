import { Controller, UseFilters, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from '../services/seed.services';
import { ValidationFilter } from 'src/utils/response.filter';

@ApiTags('Seed') // This adds a "Seed" section in Swagger UI
@Controller('seed')
@UseFilters(ValidationFilter)  
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  // Seed data for provinces, regencies, and villages
  @Get()
  @ApiOperation({
    summary: 'Run the data seed process',
    description: 'Seeds the database with provinces, regencies, and villages data. It skips already existing records.',
  })
  @ApiResponse({
    status: 200,
    description: 'Seeding completed successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred during seeding',
  })
  async seed() {
    return await this.seedService.seed();
  }
}
