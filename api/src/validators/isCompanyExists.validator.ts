import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';

@Injectable()
@ValidatorConstraint({ async: true })
export class CompanyExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(companyId: any, args: ValidationArguments) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    return !!company; // Return true if company exists, otherwise false
  }

  defaultMessage(args: ValidationArguments) {
    return 'Company with ID $value does not exist'; // Error message
  }
}

export function IsCompanyExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CompanyExistsConstraint,
    });
  };
}
