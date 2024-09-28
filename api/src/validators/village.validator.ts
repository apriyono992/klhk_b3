import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
  } from 'class-validator';
  import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';
  
export function IsVillageValidate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsVillageValid,
    });
  };
}

  @ValidatorConstraint({ async: true })
  @Injectable()
  export class IsVillageValid implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}
    async validate(villageId: string, args: ValidationArguments) {     
      const [relatedPropertyName] = args.constraints;
      const districtId = (args.object as any)[relatedPropertyName]; // Access the actual 'districtId' value from the DTO object
      const village = await this.prisma.village.findFirst({
        where: { id: villageId, districtId: districtId }, // Ensure the village belongs to the district
      });
      return !!village; // Return true if village exists and belongs to the district
    }
  
    defaultMessage(args: ValidationArguments) {
      return `Village with ID ${args.value} does not exist or does not belong to the specified district`;
    }
  }
  