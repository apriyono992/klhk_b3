import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';

@Injectable()
@ValidatorConstraint({ async: true })
export class DraftSuratExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(draftSurat: any, args: ValidationArguments) {
    const draft = await this.prisma.draftSurat.findUnique({ where: { id: draftSurat } });
    return !!draft; // Return true if company exists, otherwise false
  }

  defaultMessage(args: ValidationArguments) {
    return 'Draft Surat does not exist'; // Error message
  }
}

export function IsDraftExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DraftSuratExistsConstraint,
    });
  };
}
