import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';

export function IsPejabatExist(validationOptions?: ValidationOptions) {
return function (object: any, propertyName: string) {
  registerDecorator({
    target: object.constructor,
    propertyName: propertyName,
    options: validationOptions,
    validator: IsPejabatExists,
  });
};
}


@ValidatorConstraint({ async: true })
@Injectable()
export class IsPejabatExists implements ValidatorConstraintInterface {
constructor(private readonly prisma: PrismaService) {}

async validate(nip: string, args: ValidationArguments) {
  // Since "nama" is set as citext in Prisma, this will automatically be case-insensitive
  const pejabats = await this.prisma.dataPejabat.findFirst({
    where: { nip: nip ?? '' },
  });
  return !pejabats; // Returns true if province exists
}

defaultMessage(args: ValidationArguments) {
  return `Pejabat with NIP ${args.value} is already exist`;
}
}
