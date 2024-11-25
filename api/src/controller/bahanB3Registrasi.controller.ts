import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BahanB3RegistrasiService } from '../services/bahanB3Registrasi.services';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BahanB3RegistrasiDto } from '../models/createUpdateBahanB3regDTO';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesGuard } from 'src/utils/roles.guard';
import { RolesAccess } from 'src/models/enums/roles';
import { Roles } from 'src/utils/roles.decorator';

@ApiTags('B3 Registrasi')
@ApiBearerAuth() // Dokumentasi untuk token
@Controller('b3-registrasi')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BahanB3RegistrasiController {
  constructor(private readonly bahanB3RegServices: BahanB3RegistrasiService) {}

  @Post()
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PENGELOLA, RolesAccess.PIC_REGISTRASI, RolesAccess.KAB_SUBDIT_REGISTRASI) 
  @ApiOperation({ summary: 'Create a new B3 Registrasi entry' })
  @ApiResponse({
    status: 201,
    description: 'The B3 Registrasi has been successfully created.',
  })
  async create(@Body() data: BahanB3RegistrasiDto) {
    return this.bahanB3RegServices.createBahanB3Reg(data);
  }

  @Put(':id')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PENGELOLA, RolesAccess.PIC_REGISTRASI, RolesAccess.KAB_SUBDIT_REGISTRASI) 
  @ApiOperation({ summary: 'Update an existing B3 Registrasi entry' })
  @ApiResponse({
    status: 200,
    description: 'The B3 Registrasi has been successfully updated.',
  })
  async update(@Param('id') id: string, @Body() data: BahanB3RegistrasiDto) {
    return this.bahanB3RegServices.updateBahanB3Reg(id, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of B3 Registrasi entries' })
  @ApiResponse({ status: 200, description: 'List of B3 Registrasi entries.' })
  async findAll() {
    return this.bahanB3RegServices.listBahanB3Reg();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific B3 Registrasi entry' })
  @ApiResponse({
    status: 200,
    description: 'Details of the B3 Registrasi entry.',
  })
  async findOne(@Param('id') id: string) {
    return this.bahanB3RegServices.detailBahanB3Reg(id);
  }

  @Delete(':id')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PENGELOLA, RolesAccess.PIC_REGISTRASI, RolesAccess.KAB_SUBDIT_REGISTRASI) 
  @ApiOperation({ summary: 'Delete a B3 Registrasi entry' })
  @ApiResponse({
    status: 200,
    description: 'The B3 Registrasi has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return this.bahanB3RegServices.deleteBahanB3Reg(id);
  }
}
