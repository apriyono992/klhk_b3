import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';

export function IsTembusanExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsTembusanExists,
    });
  };
}


@ValidatorConstraint({ async: true })
@Injectable()
export class IsTembusanExists implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(tembusan: string, args: ValidationArguments) {
    // Since "nama" is set as citext in Prisma, this will automatically be case-insensitive
    const tembusans = await this.prisma.dataTembusan.findFirst({
      where: { nama: tembusan ?? '' },
    });
    return !tembusans; // Returns true if province exists
  }

  defaultMessage(args: ValidationArguments) {
    return `Tembusan with name ${args.value} is already exist`;
  }
}
  