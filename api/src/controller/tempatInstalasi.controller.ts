import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateTempatInstalasiDto } from '../models/createTempatInstalasiDto';
import { DataMasterService } from '../services/dataMaster.services';
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesAccess } from 'src/models/enums/roles';
import { Roles } from 'src/utils/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
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
