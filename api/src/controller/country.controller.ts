import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CountryService } from 'src/services/country.service';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesGuard } from 'src/utils/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('countries')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiOperation({ summary: 'Get country details by ISO alpha-2 code' })
  @ApiResponse({
    status: 200,
    description: 'Details of the country using alpha-2 code',
    schema: {
      example: {
        code2: 'US',
        code3: 'USA',
        name: 'United States',
        officialName: 'United States of America',
        region: 'Americas',
        subregion: 'Northern America',
        borders: ['CAN', 'MEX'],
        area: 9833517,
        capital: 'Washington, D.C.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Country not found',
    schema: {
      example: { message: 'Country with code US not found.' },
    },
  })
  @Get(':code2/details')
  getCountryByCode2(@Param('code2') code: string) {
    const country = this.countryService.getCountryByCode2(code);
    if (!country) {
      return { message: `Country with code ${code} not found.` };
    }
    return country;
  }

  @ApiOperation({ summary: 'Get country details by ISO alpha-3 code' })
  @ApiResponse({
    status: 200,
    description: 'Details of the country using alpha-3 code',
    schema: {
      example: {
        code2: 'US',
        code3: 'USA',
        name: 'United States',
        officialName: 'United States of America',
        region: 'Americas',
        subregion: 'Northern America',
        borders: ['CAN', 'MEX'],
        area: 9833517,
        capital: 'Washington, D.C.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Country not found',
    schema: {
      example: { message: 'Country with code USA not found.' },
    },
  })
  @Get('alpha3/:code3/details')
  getCountryByCode3(@Param('code3') code: string) {
    const country = this.countryService.getCountryByCode3(code);
    if (!country) {
      return { message: `Country with code ${code} not found.` };
    }
    return country;
  }

  @ApiOperation({ summary: 'Get a list of all countries' })
  @ApiResponse({
    status: 200,
    description: 'List of all countries with basic information',
    schema: {
      example: [
        {
          code2: 'US',
          code3: 'USA',
          name: 'United States',
          officialName: 'United States of America',
          region: 'Americas',
          subregion: 'Northern America',
          borders: ['CAN', 'MEX'],
          area: 9833517,
          capital: 'Washington, D.C.',
        },
        {
          code2: 'CA',
          code3: 'CAN',
          name: 'Canada',
          officialName: 'Canada',
          region: 'Americas',
          subregion: 'Northern America',
          borders: ['USA'],
          area: 9984670,
          capital: 'Ottawa',
        },
      ],
    },
  })
  @Get()
  getAllCountries() {
    return this.countryService.getAllCountries();
  }
}
