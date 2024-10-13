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

@Injectable()
@ValidatorConstraint({ async: true })
export class TembusanIdExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(tembusanId: any, args: ValidationArguments) {
    // Check if DataTembusan exists in the database
    const tembusan = await this.prisma.dataTembusan.findUnique({ where: { id: tembusanId } });
    return !!tembusan; // Return true if DataTembusan exists, otherwise false
  }

  defaultMessage(args: ValidationArguments) {
    const index = (args.object as any)[args.property].indexOf(args.value);
    return `Tembusan at index ${index} does not exist`; // Custom error message with index
  }
}

export function IsTembusanIdExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: TembusanIdExistsConstraint,
    });
  };
}
  