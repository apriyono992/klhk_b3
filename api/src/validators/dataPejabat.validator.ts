import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';

export function IsPejabatNipExist(validationOptions?: ValidationOptions) {
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


@Injectable()
@ValidatorConstraint({ async: true })
export class PejabatIdExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(pejabatId: any, args: ValidationArguments) {
    const vehicle = await this.prisma.dataPejabat.findUnique({ where: { id: pejabatId } });
    return !!vehicle; // Return true if vehicle exists, otherwise false
  }

  defaultMessage(args: ValidationArguments) {
    return 'Pejabat does not exist'; // Error message
  }
}

export function IsPejabatIdExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: PejabatIdExistsConstraint,
    });
  };
}
@Injectable()
@ValidatorConstraint({ async: true })
export class PejabatUsedConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(pejabatId: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints; 
    const applicationId = (args.object as any)[relatedPropertyName]; // Access applicationId from DTO

    // Check if the pejabat is already connected to the draftSurat of this application
    const draftSurat = await this.prisma.draftSurat.findFirst({
      where: { 
        applicationId, 
        pejabatId 
      },
      select: { id: true } // Check if there's a record
    });

    // Returns true if no record exists, meaning the pejabat is not yet used in this application
    return !draftSurat;
  }

  defaultMessage(args: ValidationArguments) {
    return 'This Application already assigned to pejabat'; // Custom error message
  }
}

export function IsPejabatUsed(relatedPropertyName: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [relatedPropertyName], // Pass the related field name (e.g., applicationId)
      validator: PejabatUsedConstraint,
    });
  };
}
