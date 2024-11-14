import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateTempatInstalasiDto } from '../models/createTempatInstalasiDto';
import { DataMasterService } from '../services/dataMaster.services';

@Controller('tempat-instalasi')
export class TempatInstalasiController {
  constructor(private readonly dataMaster: DataMasterService) {}
  @Post()
  async createTempatInstalasi(@Body() body: CreateTempatInstalasiDto) {
    return await this.dataMaster.createTempatInstalasi(body);
  }

  @Get('/:id')
  async detailTempatInstalasi(@Param('id') id: string) {
    return await this.dataMaster.tempatInstalasiById(id);
  }

  @Get('')
  async listTempatInstalasi() {
    return await this.dataMaster.tempatInstalasiList();
  }

  @Put('/:id')
  async updateTempatInstalasi(
    @Param('id') id: string,
    @Body() body: CreateTempatInstalasiDto,
  ) {
    return await this.dataMaster.updateTempatInstalasi(id, body);
  }
}
