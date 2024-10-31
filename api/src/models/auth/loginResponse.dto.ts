import { IsDefined, IsNumber, IsString } from 'class-validator';

export class LoginResponseDTO {
  @IsDefined()
  @IsString()
  accessToken: string;

  @IsDefined()
  @IsString()
  refreshToken: string;

  @IsDefined()
  @IsNumber()
  sessionExpired: number; // unix epoch
}