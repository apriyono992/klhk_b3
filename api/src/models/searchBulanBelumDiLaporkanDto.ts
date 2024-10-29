import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchBulanBelumDiLaporkanDto {
  @ApiProperty({ description: 'Vehicle ID to check unreported months', example: '456e7890-e12b-34d5-c678-890123456789' })
  @IsUUID()
  vehicleId: string;

  @ApiProperty({ description: 'Application ID to check missing months', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  applicationId: string;

  @ApiProperty({ description: 'Period ID to check missing months', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  periodId: string;
}