import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';

@Injectable()
@ValidatorConstraint({ async: true })
export class VehicleExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(vehicleId: any, args: ValidationArguments) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
    return !!vehicle; // Return true if vehicle exists, otherwise false
  }

  defaultMessage(args: ValidationArguments) {
    return 'Vehicle does not exist'; // Error message
  }
}

export function IsVehicleExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: VehicleExistsConstraint,
    });
  };
}
