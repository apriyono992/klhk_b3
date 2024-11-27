import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class SuccessRes<M, D> {
    @IsBoolean()
    readonly responseCode: string;

    @IsBoolean()
    readonly error: boolean;

    @IsString()
    @ApiProperty()
    readonly responseMessage: M;

    @IsArray()
    @ApiProperty({ isArray: true })
    readonly responseData: D;

    constructor(message: M, data: D) {
        this.responseCode = '200';
        this.error = false;
        this.responseMessage = message;
        this.responseData = data;
    }
}
