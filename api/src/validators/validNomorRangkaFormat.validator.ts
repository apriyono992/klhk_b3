import { registerDecorator, ValidationOptions } from "class-validator";

// Custom validator for nomor rangka (Indonesian chassis number)
export function IsValidNomorRangka(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidNomorRangka',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = /^[A-Z0-9]{17}$/i; // Commonly 17 alphanumeric characters
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(): string {
          return 'Nomor rangka must be a valid 17-character alphanumeric string';
        },
      },
    });
  };
}