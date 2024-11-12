import { IsNotEmpty, IsUUID } from 'class-validator';

export class ApproveBahanB3RequestDto {
  @IsNotEmpty()
  @IsUUID()
  requestId: string;

  @IsNotEmpty()
  @IsUUID()
  approvedById: string;
}
