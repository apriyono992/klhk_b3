import { Type } from 'class-transformer';
import { IsString, IsDate, IsBoolean, IsOptional } from 'class-validator';
export class CreatePeriodDto {
  @IsString()
  name: string;
  
  @IsDate()
  @Type(() => Date)
  startPeriodDate: Date;
  
  @IsDate()
  @Type(() => Date)
  endPeriodDate: Date;
  
  @IsDate()
  @Type(() => Date)
  finalizationDeadline: Date;

  @IsDate()
  @Type(() => Date)
  startReportingDate: Date;

  @IsDate()
  @Type(() => Date)
  endReportingDate: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isReportingActive?: boolean;
}