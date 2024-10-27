import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.services';

export function IsNotifikasiExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotifikasiConstraint,
    });
  };
}


@ValidatorConstraint({ async: true })
@Injectable()
export class NotifikasiConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(notifikasiId: string, args: ValidationArguments) {
    // Since "nama" is set as citext in Prisma, this will automatically be case-insensitive
    const notifikasi = await this.prisma.notifikasi.findFirst({
      where: { id: notifikasiId ?? '' },
    });
    return !!notifikasi; // Returns true if province exists
  }

  defaultMessage(args: ValidationArguments) {
    return `Notifikasi ${args.value} Not Found`;
  }
}

export function IsDraftNotifikasiExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotifikasiConstraint,
    });
  };
}


@ValidatorConstraint({ async: true })
@Injectable()
export class DraftNotifikasiConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(draftNotifikasiId: string, args: ValidationArguments) {
    // Since "nama" is set as citext in Prisma, this will automatically be case-insensitive
    const notifikasi = await this.prisma.baseSuratNotfikasi.findFirst({
      where: { id: draftNotifikasiId ?? '' },
    });
    return !!notifikasi; // Returns true if province exists
  }

  defaultMessage(args: ValidationArguments) {
    return `Draft Notifikasi ${args.value} Not Found`;
  }
}