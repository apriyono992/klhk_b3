import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
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
import { UpdateApprovalPersyaratanDto } from '../models/updateApprovalPersyaratanDto';
import { BahanB3RegistrasiDto } from '../models/createUpdateBahanB3regDTO';
import { CreateRegistrasiDto } from '../models/createRegistrasiDto';
import {CreateSubmitDraftSKDto} from "../models/createSubmitDraftSKDto";
import { UpdateB3PermohonanRekomDto } from '../models/updateB3PermohonanRekomDto';
import {CreateUpdateValidasiTeknis} from "../models/createUpdateValidasiTeknis";
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesAccess } from 'src/models/enums/roles';
import { Roles } from 'src/utils/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Registrasi')
@Controller('registrasi')
export class RegistrasiController {
  constructor(private readonly registrasiService: RegistrasiServices) {}

  @Roles(RolesAccess.PIC_REGISTRASI, RolesAccess.SUPER_ADMIN)
  @Put('update/:id')
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
  async updateRegistrasiB3(
    @Param('id') id: string,
    @Body() saveRegistrasiDto: SaveRegistrasiDto,
  ) {
    return this.registrasiService.update(id, saveRegistrasiDto);
  }

  @Roles(RolesAccess.PIC_REGISTRASI, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
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
  async createRegistrasiB3(@Body() craeteRegistrasiDto: CreateRegistrasiDto) {
    return this.registrasiService.create(craeteRegistrasiDto);
  }

  @Roles(RolesAccess.PIC_REGISTRASI, RolesAccess.SUPER_ADMIN)
  @Post('submit-insw/:id')
  @ApiOperation({ summary: 'Submit Insw' })
  @ApiResponse({ status: 200, description: 'Draft SK submitted successfully.' })
  async submitDraftSkToInsw(
      @Param('id') id: string
  ) {
    return this.registrasiService.submitInsw(id);
  }

  @Roles(RolesAccess.PIC_REGISTRASI, RolesAccess.DIREKTUR, RolesAccess.SUPER_ADMIN)
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
  @ApiQuery({
    name: 'status',
    description: 'status',
    required: true,
    type: String,
    example: 'pending',
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

  @Roles(RolesAccess.PIC_REGISTRASI, RolesAccess.SUPER_ADMIN)
  @Put(':id/update-bahan')
  @ApiOperation({ summary: 'Update Bahan Registrasi B3' })
  @ApiResponse({
    status: 200,
    description: 'Bahan Registrasi B3 updated successfully.',
  })
  async updateBahanRegistrasiB3(
    @Param('id') id: string,
    @Body() updateBahanB3: Partial<BahanB3RegistrasiDto>,
  ) {
    return this.registrasiService.updateBahanRegistrasiB3(id, updateBahanB3);
  }

  @Roles(RolesAccess.PIC_REGISTRASI,RolesAccess.SUPER_ADMIN)
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

  @Get('validasi-teknis/:nomor')
  async getListValidateTeknis(
      @Param('nomor') nomor: string,
  ) {
    return this.registrasiService.getListValidasiTeknis(nomor);
  }

  @Put('edit-document/:id')
  async editDocumentValidasiTeknis(
      @Param('id') id: string,
      @Body() updateData : CreateUpdateValidasiTeknis
  ) {
    return this.registrasiService.editDocumentValidasiTeknis(id, updateData);
  }

  @Post('validasi-teknis/submit/:id')
  @ApiResponse({
    status: 200,
    description: 'Submit Validasi Teknis successfully.',
  })
  async submitValidasiTeknis( @Param('id') id: string,) {
    return this.registrasiService.submitValidasiTeknis(id);
  }

  @Post('simpan-draft-sk/:id')
  @ApiResponse({
    status: 200,
    description: 'Simpan Draft SK successfully.',
  })
  async simpanDraftSk(
      @Param('id') id: string,
      @Body() saveDraft : CreateSubmitDraftSKDto
      ) {
    return this.registrasiService.simpanDraftSK(id, saveDraft);
  }

  @Roles(RolesAccess.PIC_REGISTRASI, RolesAccess.DIREKTUR, RolesAccess.SUPER_ADMIN)
  @Post('submit-draft-sk/:id')
  @ApiOperation({ summary: 'Submit Draft SK' })
  @ApiResponse({ status: 200, description: 'Draft SK submitted successfully.' })
  async submitDraftSK(
      @Param('id') id: string
  ) {
    return this.registrasiService.submitDraftSK(id);
  }
}
