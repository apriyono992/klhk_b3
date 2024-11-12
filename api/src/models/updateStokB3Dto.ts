import { IsNotEmpty, IsUUID, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateStokB3Dto {
  @IsNotEmpty()
  @IsUUID()
  companyId: string;

  @IsOptional()
  @IsUUID()
  dataBahanB3CompanyId: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  newStokB3: number;

  @IsOptional()
  @IsUUID()
  approvedById: string;
}