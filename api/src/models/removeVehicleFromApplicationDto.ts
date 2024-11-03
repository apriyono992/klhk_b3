// dto/remove-vehicle.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { IsApplicationExists } from 'src/validators/isApplicationIdExists.validatior';
import { IsVehicleExists } from 'src/validators/isVehicleExists.validator';

export class RemoveVehicleFromApplicationDto {
  @IsString()
  @IsApplicationExists()
  @IsNotEmpty()
  applicationId: string;

  @IsString()
  @IsVehicleExists()
  @IsNotEmpty()
  vehicleId: string;
}