import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
  } from 'class-validator';
  import { Injectable } from '@nestjs/common';
  import { CountryService } from 'src/services/country.service';
  
  @ValidatorConstraint({ async: true })
  @Injectable()
  export class IsISO2Country implements ValidatorConstraintInterface {
    constructor(private readonly countryService: CountryService) {}
  
    async validate(code: string): Promise<boolean> {
      // Use the countryService to check if the ISO2 code is valid
      const country = this.countryService.getCountryByCode2(code);
      return !!country; // Returns true if the code is valid, otherwise false
    }
  
    defaultMessage(args: ValidationArguments) {
      return `The country code "${args.value}" is not a valid ISO2 code.`;
    }
  }
  
  export function IsISO2CountryCode(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: IsISO2Country,
      });
    };
  }
  