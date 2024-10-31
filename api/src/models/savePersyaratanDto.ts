import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SavePersyaratanDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  document_number: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  notes: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  approved_by?: string;

  @IsUUID()
  @IsOptional()
  registrasiId?: string;
}
