import { IsString, IsInt, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsValidNoPolisi } from 'src/validators/validNomorPolisiFormat.validator';
import { IsValidYear } from 'src/validators/validYearFormat.validator';
import { IsValidNomorRangka } from 'src/validators/validNomorRangkaFormat.validator';
import { IsValidNomorMesin } from 'src/validators/validNomorMesinFormat.validator';
import { IsApplicationExists } from 'src/validators/isApplicationIdExists.validatior';
import { IsVehicleExists } from 'src/validators/isVehicleExists.validator';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';

export class CreateVehicleDto {
  @ApiPropertyOptional({ description: 'Vehicle registration number (noPolisi)' })
  @IsValidNoPolisi()
  @IsString()
  noPolisi?: string;

  @ApiPropertyOptional({ description: 'Vehicle model' })
  @IsString()
  modelKendaraan?: string;

  @ApiPropertyOptional({ description: 'Year of manufacture' })
  @IsValidYear()
  @IsInt()
  tahunPembuatan?: number;

  @ApiPropertyOptional({ description: 'Vehicle chassis number' })
  @IsValidNomorRangka()
  @IsString()
  nomorRangka?: string;

  @ApiPropertyOptional({ description: 'Vehicle engine number' })
  @IsValidNomorMesin()
  @IsString()
  nomorMesin?: string;

  @ApiPropertyOptional({ description: 'Ownership status of the vehicle (kepemilikan)' })
  @IsString()
  kepemilikan?: string;

  @ApiProperty({ description: 'Application ID to associate the vehicle' })
  @IsString()
  @IsNotEmpty()
  @IsApplicationExists()
  applicationId: string; // Foreign key for associating with the application

  @ApiProperty({ description: 'Vehicle ID of an existing vehicle to link to an application' })
  @IsOptional()
  @IsUUID()
  @IsVehicleExists()
  vehicleId: string;

  @ApiProperty({ description: 'Company ID to associate the vehicle with' })
  @IsUUID()
  @IsNotEmpty()
  @IsCompanyExists()
  companyId: string;
}
