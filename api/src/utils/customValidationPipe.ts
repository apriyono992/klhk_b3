import { ValidationPipe, ArgumentMetadata, Injectable, Scope } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator';
import { Injectable as InjectableValidator } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST }) // Make sure it's request-scoped
export class CustomValidationPipe extends ValidationPipe {
  constructor(private readonly moduleRef: ModuleRef) {
    super();
  }

  // Override this to inject dependencies into class-validator validators
  async createValidatorInstance(validator: ValidatorConstraintInterface) {
    const instance = validator as any;
    if (instance && this.moduleRef) {
      await this.moduleRef.resolve(instance.constructor as any);
    }
    return instance;
  }
}
