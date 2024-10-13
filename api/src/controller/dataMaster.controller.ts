import { Body, Controller, Delete, Param, Post, Put, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDataBahanB3Dto } from 'src/models/createDataBahanB3Dto';
import { CreateDataPejabatDto } from 'src/models/createDataPejabatDto';
import { CreateDataTembusanDto } from 'src/models/createDataTembusanDto';
import { SearchDataBahanB3Dto } from 'src/models/searchBahanB3Dto';
import { SearchDataPejabatDto } from 'src/models/searchDataPejabatDto';
import { SearchDataTembusanDto } from 'src/models/seatchDataTembusanDto';
import { DataMasterService } from 'src/services/dataMaster.services';


@ApiTags('Data Master')
@Controller('data-master')
export class DataMasterController {
  constructor(private readonly dataMasterService: DataMasterService) {}

  // ============================================
  // Data Bahan B3 Endpoints
  // ============================================
  @Post('bahan-b3')
  @ApiOperation({ summary: 'Create Data Bahan B3' })
  @ApiResponse({ status: 201, description: 'Data Bahan B3 successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createDataBahanB3(@Body() createDataBahanB3Dto: CreateDataBahanB3Dto) {
    return this.dataMasterService.createDataBahanB3(createDataBahanB3Dto);
  }

  @Put('bahan-b3/:id')
  @ApiOperation({ summary: 'Update Data Bahan B3' })
  @ApiResponse({ status: 200, description: 'Data Bahan B3 successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateDataBahanB3(@Param('id') id: string, @Body() updateDataBahanB3Dto: CreateDataBahanB3Dto) {
    return this.dataMasterService.updateDataBahanB3(id, updateDataBahanB3Dto);
  }

  @Delete('bahan-b3/:id')
  @ApiOperation({ summary: 'Delete Data Bahan B3' })
  @ApiResponse({ status: 200, description: 'Data Bahan B3 successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  async deleteDataBahanB3(@Param('id') id: string) {
    return this.dataMasterService.deleteDataBahanB3(id);
  }

  // Search Data Pejabat
  @Get('bahan-b3')
  @ApiOperation({ summary: 'Search Data Bahan B3' })
  @ApiResponse({ status: 200, description: 'Successful search operation.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async searchDataBahanB3(@Query() query: SearchDataBahanB3Dto) {
    return this.dataMasterService.searchDataBahanB3(query);
  }

  // Get Single Data Pejabat by ID
  @Get('bahan-b3/:id')
  @ApiOperation({ summary: 'Get Data Pejabat by ID' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of data.' })
  @ApiResponse({ status: 404, description: 'Data not found.' })
  async getDataBahanB3ById(@Param('id') id: string) {
    return this.dataMasterService.getDataBahanB3ById(id);
  }

  // ============================================
  // Data Pejabat Endpoints
  // ============================================
  @Post('pejabat')
  @ApiOperation({ summary: 'Create Data Pejabat' })
  @ApiResponse({ status: 201, description: 'Data Pejabat successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createDataPejabat(@Body() createDataPejabatDto: CreateDataPejabatDto) {
    return this.dataMasterService.createDataPejabat(createDataPejabatDto);
  }

  @Put('pejabat/:id')
  @ApiOperation({ summary: 'Update Data Pejabat' })
  @ApiResponse({ status: 200, description: 'Data Pejabat successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateDataPejabat(@Param('id') id: string, @Body() updateDataPejabatDto: CreateDataPejabatDto) {
    return this.dataMasterService.updateDataPejabat(id, updateDataPejabatDto);
  }

  @Delete('pejabat/:id')
  @ApiOperation({ summary: 'Delete Data Pejabat' })
  @ApiResponse({ status: 200, description: 'Data Pejabat successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  async deleteDataPejabat(@Param('id') id: string) {
    return this.dataMasterService.deleteDataPejabat(id);
  }

   // Search Data Pejabat
   @Get('pejabat')
   @ApiOperation({ summary: 'Search Data Pejabat' })
   @ApiResponse({ status: 200, description: 'Successful search operation.' })
   @ApiResponse({ status: 400, description: 'Bad Request.' })
   async searchDataPejabat(@Query() query: SearchDataPejabatDto) {
     return this.dataMasterService.searchDataPejabat(query);
   }
 
   // Get Single Data Pejabat by ID
   @Get('pejabat/:id')
   @ApiOperation({ summary: 'Get Data Pejabat by ID' })
   @ApiResponse({ status: 200, description: 'Successful retrieval of data.' })
   @ApiResponse({ status: 404, description: 'Data not found.' })
   async getDataPejabatById(@Param('id') id: string) {
     return this.dataMasterService.getDataPejabatById(id);
   }

  // ============================================
  // Data Tembusan Endpoints
  // ============================================
  @Post('tembusan')
  @ApiOperation({ summary: 'Create Data Tembusan' })
  @ApiResponse({ status: 201, description: 'Data Tembusan successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createDataTembusan(@Body() createDataTembusanDto: CreateDataTembusanDto) {
    return this.dataMasterService.createDataTembusan(createDataTembusanDto);
  }

  @Put('tembusan/:id')
  @ApiOperation({ summary: 'Update Data Tembusan' })
  @ApiResponse({ status: 200, description: 'Data Tembusan successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateDataTembusan(@Param('id') id: string, @Body() updateDataTembusanDto: CreateDataTembusanDto) {
    return this.dataMasterService.updateDataTembusan(id, updateDataTembusanDto);
  }

  @Delete('tembusan/:id')
  @ApiOperation({ summary: 'Delete Data Tembusan' })
  @ApiResponse({ status: 200, description: 'Data Tembusan successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  async deleteDataTembusan(@Param('id') id: string) {
    return this.dataMasterService.deleteDataTembusan(id);
  }

   // Search Data Tembusan
   @Get('tembusan')
   @ApiOperation({ summary: 'Search Data Tembusan' })
   @ApiResponse({ status: 200, description: 'Successful search operation.' })
   @ApiResponse({ status: 400, description: 'Bad Request.' })
   async searchDataTembusan(@Query() query: SearchDataTembusanDto) {
     return this.dataMasterService.searchDataTembusan(query);
   }
 
   // Get Single Data Tembusan by ID
   @Get('tembusan/:id')
   @ApiOperation({ summary: 'Get Data Tembusan by ID' })
   @ApiResponse({ status: 200, description: 'Successful retrieval of data.' })
   @ApiResponse({ status: 404, description: 'Data not found.' })
   async getDataTembusanById(@Param('id') id: string) {
     return this.dataMasterService.getDataTembusanById(id);
   }
}
