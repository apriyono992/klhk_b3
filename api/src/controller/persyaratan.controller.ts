import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { RegistrasiServices } from '../services/registrasi.services';
import { SavePersyaratanDto } from '../models/savePersyaratanDto';
import { UpdateApprovalPersyaratanDto } from '../models/updateApprovalPersyaratanDto';

@ApiTags('Persyaratan Registrasi')
@Controller('persyaratan-reg')
export class PersyaratanController {
  constructor(private readonly registrasiService: RegistrasiServices) {}

  @Post('save')
  async savePersyaratan(@Body() savePersyaratan: SavePersyaratanDto) {
    return this.registrasiService.savePersyaratan(savePersyaratan);
  }

  @Put('update-status-approval/:id')
  async updateApprovalPersyaratan(
    @Param('id') id: string,
    @Body() updateApprovalPersyaratan: UpdateApprovalPersyaratanDto,
  ) {
    return this.registrasiService.updateStatusApprovalPersyaratan(
      id,
      updateApprovalPersyaratan,
    );
  }
}
