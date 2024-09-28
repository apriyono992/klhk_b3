import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
  } from 'class-validator';
  import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';
  
export function IsDistrictValidate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsDistrictValid,
    });
  };
}

  @ValidatorConstraint({ async: true })
  @Injectable()
  export class IsDistrictValid implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}
    async validate(districtId: string, args: ValidationArguments) {
      const [relatedPropertyName] = args.constraints;
      const regencyId = (args.object as any)[relatedPropertyName]; // Access the actual 'regencyId' value from the DTO object
      const district = await this.prisma.districts.findFirst({
        where: { id: districtId, regencyId: regencyId }, // Ensure the district belongs to the regency
      });
      return !!district; // Return true if district exists and belongs to the regency
    }
  
    defaultMessage(args: ValidationArguments) {
      return `District with ID ${args.value} does not exist or does not belong to the specified regency`;
    }
  }