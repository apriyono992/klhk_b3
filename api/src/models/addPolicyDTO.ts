import { IsEnum, IsString } from 'class-validator';
import { Source } from '../models/enums/Source';
import { Action } from '../models/enums/action';

export class AddPolicyDto {
  @IsString()
  role: string;

  @IsEnum(Source)
  resource: Source;

  @IsEnum(Action)
  action: Action;
}