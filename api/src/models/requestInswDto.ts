import { IsString, IsOptional, IsEmail } from 'class-validator';

export class RequestInswDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsOptional()
    @IsString()
    approval_status?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    jnsPengajuan ?: string;
}
