import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { PrismaService } from 'src/services/prisma.services';
import { PrismaInit } from 'src/utils/prismaInit';

export function IsBakuMutuLingkunganExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsBakuMutuLingkunganExists,
    });
  };
}

@Injectable()
@ValidatorConstraint({ async: true })  // Make it asynchronous
export class IsBakuMutuLingkunganExists implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}
  async validate(bakuMutuLingkunganId: string, args: ValidationArguments) {
    if (typeof bakuMutuLingkunganId === 'undefined' || bakuMutuLingkunganId === null || !this.prisma) {
        return false;  // Return false immediately if undefined or null
    }
    const bakuMutuLingkungan = await this.prisma.jenisSample.findUnique({
      where: { id: bakuMutuLingkunganId },
    });
    return !!bakuMutuLingkungan;  // Returns true if the environmental standard exists
  }

  defaultMessage(args: ValidationArguments) {
    if (typeof args.value === 'undefined' || args.value === null) {
        return `${args.property} cannot be null or undefined`;
    }
    return `BakuMutuLingkungan not found`;
  }
}

