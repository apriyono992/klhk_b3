import { IsEnum, IsString } from 'class-validator';
import { Source } from '../models/enums/source';
import { Action } from '../models/enums/action';

export class AddPolicyDto {
  @IsString()
  role: string;

  @IsEnum(Source)
  resource: Source;

  @IsEnum(Action)
  action: Action;
}