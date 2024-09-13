import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class IsFileTypeConstraint implements ValidatorConstraintInterface {
    validate(file: Express.Multer.File, args: any) {
      const allowedExtensions: string[] = args.constraints;
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      return allowedExtensions.includes(fileExtension);
    }
  
    defaultMessage(args: any) {
      return `File type is invalid. Allowed file types are: ${args.constraints.join(', ')}`;
    }
  }
  
  export function IsFileType(allowedExtensions: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: allowedExtensions,
        validator: IsFileTypeConstraint,
      });
    };
  }
  