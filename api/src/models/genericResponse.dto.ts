import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class GenericResponseDTO {
  @IsDefined()
  @IsBoolean()
  success: boolean;

  @IsOptional()
  @IsString()
  message?: string;
}
