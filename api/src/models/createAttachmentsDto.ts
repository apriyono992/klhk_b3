import { IsString, IsArray, IsOptional, IsNotEmpty, ValidateNested, IsEnum } from 'class-validator';

export class CreateAttachmentDto {
    @IsString()
    fileUrl: string;
  
    @IsString()
    filePath: string;
}