import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeletePhotosDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  photoIds: string[];
}
