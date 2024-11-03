import { IsString, IsNotEmpty, IsOptional, IsNumber, IsLongitude, IsLatitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO for LocationDetails with longitude and latitude
export class LocationDetailsDto {
  @ApiProperty({ description: 'Name of the company or entity' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Address of the location' })
  @IsString()
  @IsNotEmpty()
  alamat: string;

  @ApiProperty({ description: 'Longitude of the location' })
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({ description: 'Latitude of the location' })
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;
}
