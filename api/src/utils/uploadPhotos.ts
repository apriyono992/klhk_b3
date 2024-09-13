import { applyDecorators, UseInterceptors, UsePipes } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileValidationPipe } from '../validators/file-validation.pipe';

export function UploadPhotos(
  fieldName: string = 'attachments',
  maxFiles: number = 10,
  maxFileSize: number = 5 * 1024 * 1024, // 5 MB for photos
  allowedTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
  ],
  destination: string = './uploads/photos',
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
