import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RegistrasiServices } from '../services/registrasi.services';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { SearchRegistrasiDto } from '../models/searchRegistrasiDto';
import { SaveRegistrasiDto } from '../models/saveRegistrasiDto';
import { UpdateRegistrasiPerusahaanDto } from '../models/updateRegistrasiPerusahaanDto';
import { UpdateB3PermohonanRekomDto } from '../models/updateB3PermohonanRekomDto';
import { UpdateApprovalPersyaratanDto } from '../models/updateApprovalPersyaratanDto';

@ApiTags('Registrasi')
@Controller('registrasi')
export class RegistrasiController {
  constructor(private readonly registrasiService: RegistrasiServices) {}

  @Post('save')
  @ApiOperation({ summary: 'Create Registrasi B3' })
  @ApiResponse({
    status: 200,
    description: 'Registrasi B3 saved successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid data.',
  })
  @ApiBody({ type: SaveRegistrasiDto }) // Add request body description for Swagger
  async createRegistrasiB3(@Body() saveRegistrasiDto: SaveRegistrasiDto) {
    return this.registrasiService.saveRegistrasiSKB3(saveRegistrasiDto);
  }

  @Post('submit-draft-sk/:id')
  @ApiOperation({ summary: 'Submit Draft SK' })
  @ApiResponse({ status: 200, description: 'Draft SK submitted successfully.' })
  async submitDraftSK(@Param('id') id: string) {
    return this.registrasiService.submitDraftSK(id);
  }

  @Put('update-status-approval/:id')
  @ApiOperation({ summary: 'Submit Draft SK' })
  @ApiResponse({ status: 200, description: 'Draft SK submitted successfully.' })
  async updateStatusApprovalRegistrasi(
    @Param('id') id: string,
    @Body() udpateStatusApproval: UpdateApprovalPersyaratanDto,
  ) {
    return this.registrasiService.updateStatusApprovalSubmitSk(
      id,
      udpateStatusApproval,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'List Registrasi B3' })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by field',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Sort order',
    required: false,
    type: String,
    example: 'desc',
  })
  @ApiQuery({
    name: 'search',
    description: 'search',
    required: false,
    type: String,
    example: 'a',
  })
  @ApiResponse({ status: 200, description: 'List of Registrasi B3.' })
  async listRegistrasiB3(@Query() searchDto: SearchRegistrasiDto) {
    return this.registrasiService.listRegistrasiB3(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail Registrasi B3' })
  @ApiResponse({
    status: 200,
    description: 'Detailed information of Registrasi B3.',
  })
  async detailRegistrasiB3(@Param('id') id: string) {
    return this.registrasiService.getRegistrasiById(id);
  }

  @Put('update-bahan')
  @ApiOperation({ summary: 'Update Bahan Registrasi B3' })
  @ApiResponse({
    status: 200,
    description: 'Bahan Registrasi B3 updated successfully.',
  })
  async updateBahanRegistrasiB3(
    @Body() updateBahanB3: UpdateB3PermohonanRekomDto,
  ) {
    return this.registrasiService.updateBahanRegistrasiB3(updateBahanB3);
  }

  @Put('update-perusahaan/:id')
  @ApiOperation({ summary: 'Update Perusahaan Registrasi B3' })
  @ApiResponse({
    status: 200,
    description: 'Perusahaan Registrasi B3 updated successfully.',
  })
  async updatePerusahaanRegistrasiB3(
    @Param('id') id: string,
    @Body() updateRegistrasiPerusahaanDto: UpdateRegistrasiPerusahaanDto,
  ) {
    return this.registrasiService.updatePerusahaanRegistrasiB3(
      id,
      updateRegistrasiPerusahaanDto,
    );
  }
}
