import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJenisSampleTypeDto {
  @ApiProperty({
    description: "Type of the sample (e.g., 'JNS', 'BML')",
    example: 'JNS'
  })
  @IsNotEmpty()
  @IsString()
  type: string;  // 'JNS', 'BML', etc.

  @ApiPropertyOptional({
    description: 'Description of the sample type',
    example: 'Jenis Sampel or Baku Mutu Lingkungan'
  })
  @IsOptional()
  @IsString()
  deskripsi: string;  // Optional description for the sample type
}
