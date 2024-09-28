import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
  } from 'class-validator';
  import { Injectable } from '@nestjs/common';
  import { PrismaService } from '../services/prisma.services';
  
  export function IsRegencyValidate(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: IsRegencyValid,
      });
    };
  }
  
  @ValidatorConstraint({ async: true })
  @Injectable()
  export class IsRegencyValid implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}
    async validate(regencyId: string, args: ValidationArguments) {
      const [relatedPropertyName] = args.constraints;
      const provinceId = (args.object as any)[relatedPropertyName]; // Access the actual 'provinceId' value from the DTO object
      const regency = await this.prisma.regencies.findFirst({
        where: { id: regencyId ?? '' , provinceId: provinceId ?? '' }, // Ensure regency belongs to the province
      });
      return !!regency; // Returns true if regency exists and belongs to the province
    }
  
    defaultMessage(args: ValidationArguments) {
      return `Regency with ID ${args.value} does not exist or does not belong to the specified province`;
    }
  }
  