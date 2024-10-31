import { IsOptional, IsString } from 'class-validator';

export class UpdateApprovalPersyaratanDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  approved_by?: string;
}
