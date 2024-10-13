import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectVehiclePemohonanDto {
  @ApiProperty({ description: 'Vehicle ID of an existing vehicle to link to an application' })
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ description: 'Application ID to associate the vehicle with' })
  @IsUUID()
  @IsNotEmpty()
  applicationId: string;
}
