import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class StartDateConstraint implements ValidatorConstraintInterface {
  private failureReason: string | null = null;

  validate(startDate: string, args: ValidationArguments) {
    const endDate = (args.object as any)[args.constraints[0]];

    // If both are missing, no need to validate, it passes
    if (!startDate && !endDate) {
      return true;
    }

    // If one of the dates is missing, set failure reason and fail validation
    if (!startDate) {
      this.failureReason = 'startDate is missing, but endDate is provided.';
      return false;
    }

    if (!endDate) {
      this.failureReason = 'endDate is missing, but startDate is provided.';
      return false;
    }

    // If startDate is after endDate, set failure reason and fail validation
    if (new Date(startDate) > new Date(endDate)) {
      this.failureReason = 'startDate must be earlier than or equal to endDate.';
      return false;
    }

    // If all conditions are met, validation passes
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    // Return the specific failure reason set during validation
    return this.failureReason || `startDate must be earlier than or equal to ${args.constraints[0]}.`;
  }
}

export function ValidateStartDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: StartDateConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class EndDateConstraint implements ValidatorConstraintInterface {
  private failureReason: string | null = null;

  validate(endDate: string, args: ValidationArguments) {
    const startDate = (args.object as any)[args.constraints[0]];

    // If both are missing, no need to validate, it passes
    if (!startDate && !endDate) {
      return true;
    }

    // If one of the dates is missing, set failure reason and fail validation
    if (!startDate) {
      this.failureReason = 'startDate is missing, but endDate is provided.';
      return false;
    }

    if (!endDate) {
      this.failureReason = 'endDate is missing, but startDate is provided.';
      return false;
    }

    // If startDate is after endDate, set failure reason and fail validation
    if (new Date(startDate) > new Date(endDate)) {
      this.failureReason = 'startDate must be earlier than or equal to endDate.';
      return false;
    }

    // If all conditions are met, validation passes
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    // Return the specific failure reason set during validation
    return this.failureReason || `startDate must be earlier than or equal to ${args.constraints[0]}.`;
  }
}

export function ValidateEndDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: EndDateConstraint,
    });
  };
}
