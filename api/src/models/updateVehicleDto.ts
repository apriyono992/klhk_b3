import { IsString, IsInt, IsOptional, isNotEmpty, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsVehicleExists } from 'src/validators/isVehicleExists.validator';

export class UpdateVehicleDto {
  @ApiPropertyOptional({ description: 'Vehicle registration number (noPolisi)' })
  @IsString()
  @IsNotEmpty()
  @IsVehicleExists()
  vehicleId?: string;

  @ApiPropertyOptional({ description: 'Vehicle registration number (noPolisi)' })
  @IsString()
  @IsOptional()
  noPolisi?: string;

  @ApiPropertyOptional({ description: 'Vehicle model' })
  @IsString()
  @IsOptional()
  modelKendaraan?: string;

  @ApiPropertyOptional({ description: 'Year of manufacture' })
  @IsInt()
  @IsOptional()
  tahunPembuatan?: number;

  @ApiPropertyOptional({ description: 'Vehicle chassis number' })
  @IsString()
  @IsOptional()
  nomorRangka?: string;

  @ApiPropertyOptional({ description: 'Vehicle engine number' })
  @IsString()
  @IsOptional()
  nomorMesin?: string;

  @ApiPropertyOptional({ description: 'Ownership status of the vehicle (kepemilikan)' })
  @IsString()
  @IsOptional()
  kepemilikan?: string;
}
