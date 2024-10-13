import { registerDecorator, ValidationOptions } from "class-validator";

// Custom validator for nomor mesin (Indonesian engine number)
export function IsValidNomorMesin(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidNomorMesin',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = /^[A-Z0-9]{5,12}$/i; // Example pattern for engine number (5-12 alphanumeric characters)
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(): string {
          return 'Nomor mesin must be a valid alphanumeric string between 5 and 12 characters';
        },
      },
    });
  };
}