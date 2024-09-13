import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class StartDateBeforeEndDateConstraint implements ValidatorConstraintInterface {
    validate(startDate: string, args: ValidationArguments) {
      const endDate = (args.object as any)[args.constraints[0]];
      if (!startDate || !endDate) {
        return true; // If one or both are missing, no need to validate
      }
      return new Date(startDate) <= new Date(endDate);
    }
  
    defaultMessage(args: ValidationArguments) {
      return `startDate must be earlier than or equal to endDate`;
    }
  }
  
  export function ValidateStartDateBeforeEndDate(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        validator: StartDateBeforeEndDateConstraint,
      });
    };
  }
  