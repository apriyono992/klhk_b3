import { registerDecorator, ValidationOptions } from "class-validator";

// Custom validator for nomor polisi (Indonesian vehicle registration number)
export function IsValidNoPolisi(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidNoPolisi',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = /^[A-Z]{1,2}\s\d{1,4}\s?[A-Z]{0,3}$/i; // Format like B 1234 XYZ
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(): string {
          return 'Nomor polisi must follow the pattern: 1-2 letters, 1-4 digits, optional 1-3 letters (e.g., B 1234 XYZ)';
        },
      },
    });
  };
}