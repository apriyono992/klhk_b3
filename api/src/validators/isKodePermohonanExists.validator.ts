import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';

@Injectable()
@ValidatorConstraint({ async: true })
export class KodePermohonanExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(kodePermohonan: any, args: ValidationArguments) {
    const vehicle = await this.prisma.application.findUnique({ where: { kodePermohonan: kodePermohonan } });
    return !!vehicle; // Return true if vehicle exists, otherwise false
  }

  defaultMessage(args: ValidationArguments) {
    return 'Kode Permohonan does not exist'; // Error message
  }
}

export function IsKodePermohonanExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: KodePermohonanExistsConstraint,
    });
  };
}
