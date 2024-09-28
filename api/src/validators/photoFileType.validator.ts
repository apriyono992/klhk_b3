import { BadRequestException, Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Express } from 'express';  // For file type

interface IsPhotoValidFileOptions {
  supportedFormats?: string[];
  maxFileSize?: number;
}

@Injectable()
@ValidatorConstraint({ async: false })
export class IsPhotoValidFile implements ValidatorConstraintInterface {
  private readonly supportedFormats: string[];
  private readonly maxFileSize: number;

  constructor(options: IsPhotoValidFileOptions = {}) {
    // Set default values but allow for customization via options
    this.supportedFormats = options.supportedFormats || ['image/jpeg', 'image/png', 'image/jpg'];
    this.maxFileSize = options.maxFileSize || 1 * 1024 * 1024;  // Default 1 MB
  }

  // Validate and automatically throw BadRequestException if invalid
  validateAndThrow(files: Express.Multer.File[]): void {
    // Handle case where `files` is `undefined` or `null`
    
    if (!files || files.length === 0) {
      throw new BadRequestException('Photos cannot be empty or undefined. Please upload at least one valid file.');
    }

    // Iterate through files and validate
    for (const file of files) {
      if (!this.supportedFormats.includes(file.mimetype)) {
        throw new BadRequestException(`Unsupported file format: ${file.mimetype}. Only ${this.supportedFormats.join(', ')} are allowed.`);
      }
      if (file.size > this.maxFileSize) {
        throw new BadRequestException(`File ${file.originalname} exceeds the size limit of ${this.maxFileSize / (1024 * 1024)} MB.`);
      }
    }
  }

  // If used in the class-validator context, fallback to this default validation
  validate(files: Express.Multer.File[], args: ValidationArguments) {
    if (!files || files.length === 0) {
      return false;  // No files provided
    }

    for (const file of files) {
      if (!this.supportedFormats.includes(file.mimetype) || file.size > this.maxFileSize) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `One or more files in ${args.property} are either unsupported (only ${this.supportedFormats.join(
      ', '
    )} allowed) or exceed the ${this.maxFileSize / (1024 * 1024)} MB size limit.`;
  }
}
