import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services'; // Import PrismaService

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(email: string, args: ValidationArguments) {
    const [shouldExist] = args.constraints;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return shouldExist ? !!user : !user;
  }

  defaultMessage(args: ValidationArguments) {
    const [shouldExist] = args.constraints;
    return shouldExist
      ? 'Email ($value) does not exist!'
      : 'Email ($value) already exists!';
  }
}

export function IsEmailExist(
  shouldExist: boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [shouldExist],
      validator: IsEmailExistConstraint,
    });
  };
}
