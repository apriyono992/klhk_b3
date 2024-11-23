import {
  IsInt,
  IsOptional,
} from 'class-validator';
export class CreateUpdateValidasiTeknis {

  @IsOptional()
  keterangan: string;

  @IsOptional()
  isValid: string;
}
