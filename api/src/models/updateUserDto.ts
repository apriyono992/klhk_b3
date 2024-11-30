import { IsString, IsOptional, Matches, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password lama harus terdiri dari minimal 8 karakter.' })
  readonly oldPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password baru harus terdiri dari minimal 8 karakter.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password baru harus mengandung huruf besar, huruf kecil, dan angka.',
  })
  readonly newPassword?: string;
}