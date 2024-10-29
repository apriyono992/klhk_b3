import { IsString, IsDate, IsBoolean, IsOptional } from 'class-validator';

export class CreatePeriodDto {
  @IsString()
  name: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsDate()
  finalizationDeadline: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
