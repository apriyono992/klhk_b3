import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateStokB3Dto {
  @IsNotEmpty()
  @IsUUID()
  companyId: string;

  @IsOptional()
  @IsUUID()
  dataBahanB3CompanyId: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  newStokB3: number;

  @IsOptional()
  notes: string;

  @IsOptional()
  @IsUUID()
  approvedById: string;
}