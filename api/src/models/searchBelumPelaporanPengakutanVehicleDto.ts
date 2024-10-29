import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchBelumPelaporanPengakutanVehicleDto {
  @ApiProperty({ description: 'Application ID to check unreported vehicles', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  applicationId: string;

  @ApiProperty({ description: 'Period ID to check missing reports', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  periodId: string;
}