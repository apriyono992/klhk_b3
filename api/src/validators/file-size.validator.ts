import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class MaxFileSizeConstraint implements ValidatorConstraintInterface {
    validate(file: Express.Multer.File, args: any) {
      const maxSizeInBytes: number = args.constraints[0];
      return file.size <= maxSizeInBytes;
    }
  
    defaultMessage(args: any) {
      return `File size exceeds the maximum allowed size of ${args.constraints[0] / (1024 * 1024)} MB`;
    }
  }
  
  export function MaxFileSize(maxSizeInBytes: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [maxSizeInBytes],
        validator: MaxFileSizeConstraint,
      });
    };
  }
  