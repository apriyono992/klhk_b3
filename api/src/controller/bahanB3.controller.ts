import { Controller, Post, Put, Delete, Get, Param, Body, Query } from '@nestjs/common';
import { CreateB3PermohonanRekomDto } from 'src/models/createB3PermohonanRekomDto';
import { UpdateB3PermohonanRekomDto } from 'src/models/updateB3PermohonanRekomDto';
import { SearchBahanB3PermohonanRekomDto } from 'src/models/searchBahanB3PermohonanRekomDto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BahanB3Service } from 'src/services/bahanB3.services';

@ApiTags('B3Substance')
@Controller('b3-substance')
export class BahanB3Controller {
  constructor(private readonly bahanB3Service: BahanB3Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new B3Substance' })
  @ApiBody({ type: CreateB3PermohonanRekomDto })
  async createB3Substance(@Body() createB3SubstanceDto: CreateB3PermohonanRekomDto) {
    return this.bahanB3Service.createB3Substance(createB3SubstanceDto);
  }

  @Put()
  @ApiOperation({ summary: 'Update an existing B3Substance' })
  @ApiBody({ type: UpdateB3PermohonanRekomDto })
  async updateB3Substance( @Body() updateB3SubstanceDto: UpdateB3PermohonanRekomDto) {
    return this.bahanB3Service.updateB3Substance( updateB3SubstanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a B3Substance' })
  @ApiParam({ name: 'id', description: 'ID of the B3Substance to delete' })
  async deleteB3Substance(@Param('id') id: string) {
    return this.bahanB3Service.deleteB3Substance(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single B3Substance by ID' })
  @ApiParam({ name: 'id', description: 'ID of the B3Substance to retrieve' })
  async getB3SubstanceById(@Param('id') id: string) {
    return this.bahanB3Service.getB3SubstanceById(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search and list B3Substances with filtering options' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sortBy', description: 'Sort by field', required: false, type: String, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', description: 'Sort order', required: false, type: String, example: 'desc' })
  @ApiQuery({ name: 'karakteristikB3', description: 'Filter by characteristics of the B3', required: false, type: [String] })
  @ApiQuery({ name: 'fasaB3', description: 'Filter by phase of the B3', required: false, type: [String] })
  @ApiQuery({ name: 'jenisKemasan', description: 'Filter by packaging type', required: false, type: [String] })
  @ApiQuery({ name: 'asalMuat', description: 'Filter by origin of the B3', required: false, type: [String] })
  @ApiQuery({ name: 'tujuanBongkar', description: 'Filter by destination of the B3', required: false, type: [String] })
  @ApiQuery({ name: 'tujuanPenggunaan', description: 'Filter by purpose of the B3', required: false, type: [String] })
  @ApiQuery({ name: 'b3pp74', description: 'Filter by whether the B3 is listed in PP 74/2001', required: false, type: Boolean })
  @ApiQuery({ name: 'b3DiluarList', description: 'Filter by whether the B3 is outside the list of PP 74/2001', required: false, type: Boolean })
  @ApiQuery({ name: 'applicationId', description: 'Filter by application ID', required: false, type: String })
  async searchB3Substances(@Query() searchDto: SearchBahanB3PermohonanRekomDto) {
    return this.bahanB3Service.searchB3Substances(searchDto);
  }
}
