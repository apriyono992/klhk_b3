import { IsNotEmpty, IsUUID, IsNumber, IsPositive } from 'class-validator';
import { IsDataBahanB3Exist } from 'src/validators/dataBahanB3.validator';

export class CreateBahanB3CompanyDto {
  @IsNotEmpty()
  @IsUUID()
  companyId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsDataBahanB3Exist()
  dataBahanB3Id: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stokB3: number;
}