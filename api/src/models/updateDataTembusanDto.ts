
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Import Swagger decorator
import { TembusanTipe } from './enums/tipeTembusan';
import { IsTembusanExist } from 'src/validators/dataTembusan.validator';
import { IsApplicationExists } from 'src/validators/isApplicationIdExists.validatior';

export class UpdateDataTembusanDto {
  @ApiProperty({
    description: 'The name of the tembusan.',
    example: 'General Directorate of Environment',  // Example value
  })
  @IsString()
  @IsOptional()
  @IsTembusanExist()
  nama: string;

  @ApiProperty({
    description: 'The application Id of the pejabat will assign to it.',
    example: '12313123123',  // Example value
  })
  @IsOptional()
  @IsString()
  @IsApplicationExists()
  applicationId: string;

  @ApiProperty({
    description: 'The type of the tembusan (e.g., UMUM, DIREKTUR).',
    enum: TembusanTipe,  // Enum values automatically listed
  })
  @IsOptional()
  @IsEnum(TembusanTipe)
  tipe: TembusanTipe;
}
