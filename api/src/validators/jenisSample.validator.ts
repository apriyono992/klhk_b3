import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { PrismaService } from '../services/prisma.services';
import { PrismaInit } from 'src/utils/prismaInit';

export function IsJenisSampelExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsJenisSampelExists,
    });
  };
}

@Injectable()
@ValidatorConstraint({ async: true })
export class IsJenisSampelExists implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}
  async validate(jenisSampelId: string, args: ValidationArguments) {

    if (!jenisSampelId || !this.prisma) {
      return false;
    }

    const jenisSampel = await this.prisma.jenisSample.findUnique({
      where: { id: jenisSampelId },
    });

    return !!jenisSampel;  // Return true if jenisSampel exists
  }

  defaultMessage(args: ValidationArguments) {
    if (typeof args.value === 'undefined' || args.value === null) {
        return `${args.property} cannot be null or undefined`;
    }
    return `JenisSampel not found`;
  }
}
