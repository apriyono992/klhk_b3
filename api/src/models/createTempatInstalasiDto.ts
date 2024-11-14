import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTempatInstalasiDto {
  @ApiProperty({
    description: 'Name of the installation place',
    example: 'Instalasi Jakarta Selatan',
  })
  @IsString()
  nama: string;

  @ApiProperty({
    description: 'Address of the installation place',
    example: 'Jl. Gatot Subroto No. 123, Jakarta',
  })
  @IsString()
  alamat: string;
}
