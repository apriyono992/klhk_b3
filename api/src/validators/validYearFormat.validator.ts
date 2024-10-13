import { registerDecorator, ValidationOptions } from "class-validator";

export function IsValidYear(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isValidYear',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any) {
            const currentYear = new Date().getFullYear();
            return typeof value === 'number' && value >= 1900 && value <= currentYear;
          },
          defaultMessage(): string {
            return 'The year must be between 1900 and the current year';
          },
        },
      });
    };
  }