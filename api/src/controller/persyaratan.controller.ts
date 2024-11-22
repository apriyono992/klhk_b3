import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RegistrasiServices } from '../services/registrasi.services';
import { SavePersyaratanDto } from '../models/savePersyaratanDto';
import { UpdateApprovalPersyaratanDto } from '../models/updateApprovalPersyaratanDto';
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesAccess } from 'src/models/enums/roles';
import { Roles } from 'src/utils/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Persyaratan Registrasi')
@Controller('persyaratan-reg')
export class PersyaratanController {
  constructor(private readonly registrasiService: RegistrasiServices) {}

  @Roles(RolesAccess.PIC_REGISTRASI, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Post('save')
  async savePersyaratan(@Body() savePersyaratan: SavePersyaratanDto) {
    return this.registrasiService.savePersyaratan(savePersyaratan);
  }

  @Roles(RolesAccess.PIC_REGISTRASI, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
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
