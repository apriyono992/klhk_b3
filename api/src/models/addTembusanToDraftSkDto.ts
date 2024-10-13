import { IsUUID, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';
import { IsTembusanExist } from 'src/validators/dataTembusan.validator';
import { IsApplicationExists } from 'src/validators/isApplicationIdExists.validatior';

export class AddTembusanToDraftSkDto {
  @IsUUID()
  @IsNotEmpty()
  @IsApplicationExists( )
  applicationId: string; // ID aplikasi

  @IsArray()
  @ArrayNotEmpty() // Array tidak boleh kosong
  @IsUUID('all', { each: true }) // Memastikan setiap item di array adalah UUID yang valid
  @IsTembusanExist({ each: true, message: 'Tembusan at index $constraint1 does not exist' }) // Custom validator to check if each Tembusan exists
  tembusanIds: string[]; // Array ID DataTembusan yang akan ditambahkan
}
