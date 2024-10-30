// dto/remove-vehicle.dto.ts
import { IsString } from 'class-validator';
import { IsApplicationExists } from 'src/validators/isApplicationIdExists.validatior';
import { IsVehicleExists } from 'src/validators/isVehicleExists.validator';

export class RemoveVehicleFromApplicationDto {
  @IsString()
  @IsApplicationExists()
  applicationId: string;

  @IsString()
  @IsVehicleExists()
  vehicleId: string;
}