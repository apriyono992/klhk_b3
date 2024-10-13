import { Controller, Get, Post, Body, Param, Patch, BadRequestException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { DraftSuratDto } from 'src/models/draftSuratDto';
import { StatusPermohonan } from 'src/models/enums/statusPermohonan';
import { CreateIdentitasPemohonDto } from 'src/models/identitasPemohonDto';
import { SearchApplicationDto } from 'src/models/searchPermohonanRekomendasiDto';
import { UpdateApplicationStatusDto } from 'src/models/updateApplicationStatusDto';
import { PermohonanRekomendasiB3Service } from 'src/services/permohonanRekom.services';

@ApiTags('Permohonan')
@Controller('rekom/permohonan')
export class PermohonanRekomendasiB3Controller {
  constructor(private readonly permohonanService: PermohonanRekomendasiB3Service) {}

  @Post()
  @ApiOperation({ summary: 'Create initial application and Identitas Pemohon for a company' })
  async createInitialApplication(
    @Body() createIdentitasPemohonDto: CreateIdentitasPemohonDto,
  ) {
    return this.permohonanService.createInitialApplicationWithPemohon(createIdentitasPemohonDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search applications based on multiple filters with pagination' })
  @ApiResponse({ status: 200, description: 'List of applications matching the criteria' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async searchApplications(@Query() searchDto: SearchApplicationDto) {
    if (!searchDto.page || !searchDto.limit) {
      throw new BadRequestException('Page and limit parameters are required for pagination.');
    }

    const applications = await this.permohonanService.searchApplications(searchDto);
    return applications;
  }

  // Endpoint to get a single application by ID
  @Get(':applicationId')
  @ApiOperation({ summary: 'Get a single application by its ID' })
  @ApiParam({
    name: 'applicationId',
    type: String,
    description: 'The ID of the application to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The application details',
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
  })
  async getApplicationById(@Param('applicationId') applicationId: string) {
    return this.permohonanService.getApplicationById(applicationId);
  }

  // Endpoint to update application status
  @Patch('status')
  @ApiOperation({ summary: 'Update the status of an application' })
  @ApiBody({ type: UpdateApplicationStatusDto })
  @ApiResponse({
    status: 200,
    description: 'The application status was successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Application ID or new status is missing.',
  })
  async updateApplicationStatus(@Body() data: UpdateApplicationStatusDto) {
    return this.permohonanService.updateApplicationStatus(data);
  }

  // Endpoint to retrieve the status history of an application
  @Get('status-history/:applicationId')
  @ApiOperation({ summary: 'Get the status history of an application' })
  async getApplicationStatusHistory(
    @Param('applicationId') applicationId: string,
  ) {
    if (!applicationId) {
      throw new BadRequestException('Application ID is required.');
    }

    return this.permohonanService.getApplicationStatusHistory(applicationId);
  }
  
  
  @Patch('draft-surat')
  @ApiOperation({ summary: 'Update DraftSurat by ID' })
  @ApiParam({ name: 'id', description: 'ID of the DraftSurat' })
  @ApiBody({ type: DraftSuratDto })
  @ApiResponse({ status: 200, description: 'Successfully updated the DraftSurat' })
  @ApiResponse({ status: 404, description: 'DraftSurat not found' })
  async updateDraftSurat(
    @Body() updateData: DraftSuratDto
  ) {
    // Call the service method to update the DraftSurat
    const updatedDraftSurat = await this.permohonanService.updateDraftSurat(updateData);
    return {
      message: 'Successfully updated the DraftSurat',
      data: updatedDraftSurat,
    };
  }
}