import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private readonly allowedTypes: string[], // Allowed MIME types, e.g., ['application/pdf', 'application/msword']
    private readonly maxSize: number, // Max file size in bytes
  ) {}

  async transform(files: Express.Multer.File | Express.Multer.File[]) {
    if (!files || (Array.isArray(files) && files.length === 0)) {
      throw new BadRequestException('File(s) is missing');
    }

    // Convert single file to array for consistent processing
    const filesArray = Array.isArray(files) ? files : [files];

    // Array to collect error messages
    const errorMessages: string[] = [];

    // Validate each file, ignoring non-file objects
    filesArray.forEach((file) => {
      // Check if the object has file-related properties
      if (!file.originalname || !file.mimetype || !file.size) {
        return; // Skip non-file objects
      }

      const fileErrors: string[] = [];

      if (file.size > this.maxSize) {
        fileErrors.push(`File size exceeds the maximum allowed size of ${this.maxSize / (1024 * 1024)} MB`);
      }

      const ext = extname(file.originalname).toLowerCase();
      const allowedExtensions = this.allowedTypes.map(type => `.${type.split('/')[1]}`);
      if (!allowedExtensions.includes(ext)) {
        fileErrors.push(`Invalid file type. Allowed types are: ${allowedExtensions.join(', ')}`);
      }

      // If any errors were found for this file, add them to the errorMessages array
      if (fileErrors.length > 0) {
        errorMessages.push(`File "${file.originalname}": ${fileErrors.join('; ')}`);
      }
    });

    // If there are any errors, throw a BadRequestException with all the errors
    if (errorMessages.length > 0) {
      throw new BadRequestException(`Validation failed for the following file(s):\n${errorMessages.join('\n')}`);
    }

    return filesArray.length === 1 ? filesArray[0] : filesArray;
  }
}
