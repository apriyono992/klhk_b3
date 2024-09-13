import { applyDecorators, UseInterceptors, UsePipes } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileValidationPipe } from '../validators/file-validation.pipe';

export function UploadFiles(
  fieldName: string = 'attachments',
  maxFiles: number = 10,
  maxFileSize: number = 10 * 1024 * 1024, // 10 MB
  allowedTypes: string[] = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  destination: string = './uploads/documents',
) {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(fieldName, maxFiles, {
        storage: diskStorage({
          destination: destination,
          filename: (req, file, cb) => {
            const randomName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        limits: { fileSize: maxFileSize },
      }),
    ),
    UsePipes(new FileValidationPipe(allowedTypes, maxFileSize)),
  );
}
