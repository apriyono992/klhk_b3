import { IsUUID, IsNotEmpty } from 'class-validator';
import { IsPejabatIdExists, IsPejabatUsed } from 'src/validators/dataPejabat.validator';
import { IsApplicationExists } from 'src/validators/isApplicationIdExists.validatior';

export class AddPejabatToDraftSkDto {
  @IsUUID()
  @IsNotEmpty()
  @IsApplicationExists()
  applicationId: string; // ID aplikasi

  @IsUUID()
  @IsNotEmpty()
  @IsPejabatIdExists()
  @IsPejabatUsed("applicationId")
  pejabatId: string; // ID pejabat yang akan ditambahkan
}
