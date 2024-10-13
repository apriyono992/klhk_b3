import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';

export function IsDataBahanB3Exist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsDataBahanB3Exists,
    });
  };
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsBahanB3Exists implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  // Validate the combination of casNumber and namaDagang
  async validate(cas: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const namaDagang = (args.object as any)[relatedPropertyName]; // Access the actual 'namaDagang' value from the DTO object

    // Check if a record with the same casNumber and namaDagang already exists
    const bahanB3 = await this.prisma.dataBahanB3.findFirst({
      where: {
        casNumber: cas ?? '',
        namaDagang: namaDagang ?? '',
      },
    });

    return !bahanB3; // Returns true if no such record exists (validation passes)
  }

  defaultMessage(args: ValidationArguments) {
    return `Bahan B3 with CAS Number "${args.value}" and Nama Dagang "${(args.object as any).namaDagang}" already exists.`;
  }
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsDataBahanB3Exists implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  // Validate the combination of casNumber and namaDagang
  async validate(id: string) {

    // Check if a record with the same casNumber and namaDagang already exists
    const bahanB3 = await this.prisma.dataBahanB3.findFirst({
      where: {
        id: id ?? '',
      },
    });

    return !!bahanB3; // Returns true if no such record exists (validation passes)
  }

  defaultMessage() {
    return `Bahan B3 is not exists.`;
  }
}
