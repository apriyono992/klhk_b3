import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';

export function IsProvinceExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsProvinceExists,
    });
  };
}


  @ValidatorConstraint({ async: true })
  @Injectable()
  export class IsProvinceExists implements ValidatorConstraintInterface {
    
    constructor(private readonly prisma: PrismaService) {}
    async validate(provinceId: string, args: ValidationArguments) {
      const province = await this.prisma.province.findUnique({
        where: { id: provinceId ?? '' },
      });
      return !!province; // Returns true if province exists
    }
  
    defaultMessage(args: ValidationArguments) {
      return `Province with ID ${args.value} does not exist`;
    }
  }
  