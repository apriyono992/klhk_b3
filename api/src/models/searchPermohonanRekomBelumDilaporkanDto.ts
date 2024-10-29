import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchPermohonanRekomBelumDilaporkanDto {
  @ApiProperty({ description: 'Period ID to check for missing reports', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsOptional()
  @IsUUID()
  periodId: string;

  @ApiProperty({ description: 'Optional Company ID to filter applications', example: '123e4567-e89b-12d3-a456-426614174002' })
  @IsOptional()
  @IsUUID()
  companyId?: string;
}