import { Controller, UseFilters, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SeedService } from '../services/seed.services';
import { ValidationFilter } from 'src/utils/response.filter';
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesAccess } from 'src/models/enums/roles';
import { Roles } from 'src/utils/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Seed') // This adds a "Seed" section in Swagger UI
@Controller('seed')
@ApiBearerAuth() // Dokumentasi untuk token
@UseFilters(ValidationFilter)  
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  // Seed data for provinces, regencies, and villages
  @Get("seed")
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

  // Seed data for provinces, regencies, and villages
  @Get("seedMercuryMonitoring")
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
  async seedMercuryMonitoringEndp() {
    return await this.seedService.seedMercuryMonitoringEndp();
  }
  
}
