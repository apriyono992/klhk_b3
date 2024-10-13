import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';

@Injectable()
@ValidatorConstraint({ async: true })
export class ApplicationExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(applicationId: any, args: ValidationArguments) {
    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    return !!application; // Return true if application exists, otherwise false
  }

  defaultMessage(args: ValidationArguments) {
    return 'Application with ID $value does not exist'; // Error message
  }
}

export function IsApplicationExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ApplicationExistsConstraint,
    });
  };
}
