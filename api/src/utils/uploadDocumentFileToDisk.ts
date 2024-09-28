import * as fs from 'fs';
import { join, extname } from 'path';
import { Express } from 'express';

interface UploadResult {
  filename: string;
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
}

export const uploadFilesToDisk = (
  files: Express.Multer.File[],
  uploadFolder: string = './uploads/document'
): UploadResult[] => {
  const uploadedFiles: UploadResult[] = [];

  // Create upload folder if it doesn't exist
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

  // Process each file and save it to disk
  for (const file of files) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}${extname(file.originalname)}`;
    const filePath = join(uploadFolder, fileName);

    // Save the file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Push file details to the uploadedFiles array
    uploadedFiles.push({
      filename: fileName,
      path: filePath,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
  }

  return uploadedFiles;
};
